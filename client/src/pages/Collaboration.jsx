import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { io } from 'socket.io-client';
import { motion as Motion } from "motion/react";
import { toast } from "react-toastify";
import { ArrowLeft, Copy, Users, Sparkles, LogOut } from 'lucide-react';

const Collaboration = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, backendUrl, generateImage, loadCredits } = useContext(AppContext);
    
    const [prompt, setPrompt] = useState(location.state?.initialPrompt || "");
    const [isGenerating, setIsGenerating] = useState(false);
    const [activities, setActivities] = useState([]);
    
    const socketRef = useRef(null);

    useEffect(() => {
        if (!user) {
            toast.error("Please login to join a collaboration room.");
            navigate('/');
            return;
        }

        // Initialize Socket
        socketRef.current = io(backendUrl);

        // Join Room
        socketRef.current.emit("join_room", { roomId, userName: user.name });

        // Listen for new users
        socketRef.current.on("user_joined", (message) => {
            setActivities(prev => [...prev, { type: 'join', text: message }]);
            toast.info(message);
        });

        // Listen for prompt updates from others
        socketRef.current.on("receive_prompt_update", (newPrompt) => {
            setPrompt(newPrompt);
        });

        // Listen for users leaving
        socketRef.current.on("user_left", (message) => {
            setActivities(prev => [...prev, { type: 'leave', text: message }]);
            toast.info(message);
        });

        return () => {
            socketRef.current.emit("leave_room", { roomId, userName: user.name });
            socketRef.current.disconnect();
        };
    }, [roomId, user, backendUrl, navigate]);

    const handlePromptChange = (e) => {
        const newText = e.target.value;
        setPrompt(newText);
        socketRef.current.emit("send_prompt_update", { roomId, prompt: newText });
    };

    const copyInviteLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Invite link copied!");
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Prompt cannot be empty");
            return;
        }
        
        setIsGenerating(true);
        const result = await generateImage(prompt);
        if (result) {
            toast.success("Image generated successfully!");
            navigate('/creations'); 
        }
        setIsGenerating(false);
    };

    if (!user) return null;

    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto py-10 min-h-[80vh] flex flex-col"
        >
            {/* Header */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/result')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Users size={20} className="text-purple-500" /> Collaboration Room
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Room ID: {roomId.slice(0, 8)}...</p>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={copyInviteLink} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                        <Copy size={16} /> Copy Invite Link
                    </button>
                    <button onClick={() => navigate('/result')} className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                        <LogOut size={16} /> Leave
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6 flex-1">
                
                {/* Editor Area */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Shared Prompt Editor</h2>
                    <textarea
                        value={prompt}
                        onChange={handlePromptChange}
                        placeholder="Start typing your shared vision here. Your teammates will see changes in real-time..."
                        className="flex-1 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/50 transition-all resize-none text-gray-800 dark:text-gray-100"
                    />
                    
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors py-3 rounded-lg text-white font-semibold flex justify-center items-center gap-2"
                    >
                        {isGenerating ? "Generating..." : <><Sparkles size={18} /> Generate Masterpiece</>}
                    </button>
                </div>

                {/* Sidebar: Activity Feed */}
                <div className="w-full lg:w-80 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Room Activity</h2>
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {activities.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center mt-10">Waiting for friends to join...</p>
                        ) : (
                            activities.map((act, i) => (
                                <div key={i} className={`text-sm px-3 py-2 rounded-lg ${act.type === 'join' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'}`}>
                                    {act.text}
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </Motion.div>
    );
};

export default Collaboration;