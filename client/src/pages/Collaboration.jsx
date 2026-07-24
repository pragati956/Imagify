import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { io } from 'socket.io-client';
import { motion as Motion } from "motion/react";
import { toast } from "react-toastify";
import axios from 'axios';
import { ArrowLeft, Copy, Users, Sparkles, LogOut, RotateCcw, Image as ImageIcon, X, Download } from 'lucide-react';

const suggestions = [
  "A futuristic cyberpunk city with flying cars at sunset",
  "A magical forest with glowing bioluminescent mushrooms",
  "An astronaut relaxing on a tropical beach in space",
  "A majestic lion wearing a golden crown"
];

const effectTags = [
  "Cinematic", "Anime", "3D Render", "Cyberpunk", 
  "Watercolor", "Pencil Sketch", "Photorealistic", "Studio Lighting"
];

const Collaboration = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, backendUrl, generateImage, enhancePrompt, token } = useContext(AppContext);
    
    // Standard Result.jsx States
    const [input, setInput] = useState(location.state?.initialPrompt || "");
    const [enhancedPrompt, setEnhancedPrompt] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [referenceImage, setReferenceImage] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(null);
    const [optimizing, setOptimizing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Collaboration States
    const [activeUsers, setActiveUsers] = useState([]);
    const [activities, setActivities] = useState([]);
    const [roomGallery, setRoomGallery] = useState([]);
    
    const socketRef = useRef(null);

    // Fetch Room's Dedicated Gallery
    const fetchRoomGallery = useCallback(async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/image/room-creations/${roomId}`, { headers: { token } });
            if (data.success) setRoomGallery(data.images);
        } catch (error) {
            console.error("Gallery Fetch Error:", error);
        }
    }, [backendUrl, roomId, token]);

    // Socket Initialization
    useEffect(() => {
        if (!user) {
            toast.error("Please login to join a collaboration room.");
            navigate('/');
            return;
        }

        void Promise.resolve().then(() => fetchRoomGallery());
        socketRef.current = io(backendUrl);
        socketRef.current.emit("join_room", { roomId, userName: user.name });

        socketRef.current.on("room_state", ({ prompt, users, message }) => {
            if (prompt && !input) setInput(prompt); // Catch up to current prompt
            setActiveUsers(users);
            setActivities(prev => [...prev, { type: 'join', text: message }]);
        });

        socketRef.current.on("user_joined", ({ message, users }) => {
            setActiveUsers(users);
            setActivities(prev => [...prev, { type: 'join', text: message }]);
            toast.info(message);
        });

        socketRef.current.on("receive_prompt_update", (newPrompt) => {
            setInput(newPrompt);
        });

        socketRef.current.on("user_left", ({ message, users }) => {
            setActiveUsers(users);
            setActivities(prev => [...prev, { type: 'leave', text: message }]);
        });

        socketRef.current.on("refresh_gallery", () => {
            toast.success("A collaborator generated a new image!");
            fetchRoomGallery();
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit("leave_room", { roomId, userName: user.name });
                socketRef.current.disconnect();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, user, backendUrl, navigate]);

    // Handlers
    const handlePromptChange = (e) => {
        const newText = e.target.value;
        setInput(newText);
        socketRef.current.emit("send_prompt_update", { roomId, prompt: newText });
    };

    const toggleTag = (tag) => {
        let newTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
        setSelectedTags(newTags);
    };

    const handleEnhancePrompt = async () => {
        if(!input.trim()) return;
        setOptimizing(true);
        try {
            const styleContext = selectedTags.length > 0 ? `(Apply these styles: ${selectedTags.join(", ")})` : "";
            const promptToOptimize = `${input} ${styleContext}`.trim();
            const generatedPrompt = await enhancePrompt(promptToOptimize, referenceImage);
            if(generatedPrompt) setEnhancedPrompt(generatedPrompt);
        } finally {
            setOptimizing(false);
        }
    };

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomId);
        toast.success(`Room Code ${roomId} copied to clipboard!`);
    };

    const handleImageUpload = (e) => { 
        const file = e.target.files[0];
        if (file) {
            setReferenceImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        const basePromptToUse = enhancedPrompt.trim() || input.trim();
        if (!basePromptToUse) {
            toast.error("Prompt cannot be empty");
            return;
        }

        setIsGenerating(true);
        try {
            const tagPrefix = selectedTags.length > 0 ? `${selectedTags.join(", ")} style, highly detailed. ` : "";
            const finalPrompt = `${tagPrefix}${basePromptToUse}`;

            const result = await generateImage(finalPrompt, referenceImage, roomId);
            if (result) {
                toast.success("Masterpiece created!");
                fetchRoomGallery();
                socketRef.current?.emit("new_image_generated", { roomId });
            }
        } finally {
            setIsGenerating(false);
        }
    };

    if (!user) return null;

    return (
        <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto py-10 min-h-[80vh] flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/result')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ArrowLeft className="text-gray-600 dark:text-gray-300" size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Users size={20} className="text-purple-500" /> Collaboration Room
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                            Code: <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">{roomId}</span>
                            <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold">
                                {activeUsers.length} Online
                            </span>
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={copyRoomCode} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-100 transition-colors">
                        <Copy size={16} /> Copy Code
                    </button>
                    <button onClick={() => navigate('/result')} className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
                        <LogOut size={16} /> Leave
                    </button>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Col: Editor (Same as Result.jsx) */}
                <form onSubmit={handleGenerate} className="lg:col-span-2 flex flex-col gap-6">
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Try a suggestion</h3>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((sug, idx) => (
                                <button key={idx} type="button" onClick={() => handlePromptChange({target:{value: sug}})} className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs px-3 py-1.5 rounded-full transition-colors border border-blue-100 dark:border-blue-800">
                                    {sug}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Style Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {effectTags.map((eff, idx) => {
                                const isActive = selectedTags.includes(eff);
                                return (
                                    <button key={idx} type="button" onClick={() => toggleTag(eff)} className={`text-xs px-3 py-1.5 rounded-full transition-all border flex items-center gap-1.5 ${isActive ? 'bg-zinc-900 dark:bg-gray-200 text-white dark:text-zinc-900 border-zinc-900 dark:border-gray-200 shadow-md' : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'}`}>
                                        {eff} {isActive && <X size={12} className="opacity-70 hover:opacity-100" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col focus-within:border-blue-500 transition-all">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                <ImageIcon size={18} /> Shared Idea (Live)
                            </h3>
                            
                            {selectedTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                    {selectedTags.map(tag => (
                                        <span key={tag} className="bg-zinc-800 dark:bg-gray-700 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
                                            {tag} <X size={10} className="cursor-pointer hover:text-red-400" onClick={() => toggleTag(tag)} />
                                        </span>
                                    ))}
                                </div>
                            )}

                            {previewUrl && ( 
                                <div className="relative mb-3 w-32 h-32">
                                    <img src={previewUrl} alt="Reference" className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-600" />
                                    <button type="button" onClick={() => { setReferenceImage(null); setPreviewUrl(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-105"><X size={14} /></button>
                                </div>
                            )}

                            <textarea value={input} onChange={handlePromptChange} placeholder="Describe what you want to generate. Teammates see this live..." className="flex-1 w-full bg-transparent outline-none resize-none min-h-[120px] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm" />
                            <button type="button" onClick={handleEnhancePrompt} disabled={optimizing || !input.trim()} className="mt-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm">{optimizing ? "Enhancing..." : "✨ Enhance Prompt"}</button>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"> 
                                <label className="cursor-pointer text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 w-max">
                                    <ImageIcon size={14} /> Upload Style Reference
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50 shadow-sm flex flex-col relative focus-within:border-blue-500 transition-all">
                            <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center justify-between">
                                <span className="flex items-center gap-2"><Sparkles size={18} /> AI Assistant</span>
                                {optimizing && <span className="text-[10px] font-medium text-blue-500 dark:text-blue-300 animate-pulse bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">Optimizing...</span>}
                            </h3>

                            {!enhancedPrompt ? (
                                <div className="flex flex-col justify-center items-center h-full text-center py-8">
                                    <Sparkles className="text-blue-500 mb-3" size={28} />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Click ✨ Enhance Prompt to get an AI-improved version.</p>
                                </div>
                            ) : (
                                <>
                                <textarea disabled={isGenerating || optimizing} value={enhancedPrompt} onChange={e => setEnhancedPrompt(e.target.value)} className="flex-1 w-full bg-transparent outline-none resize-none min-h-[120px] text-gray-800 dark:text-gray-100 text-sm" />
                                <div className="flex gap-2 mt-4">
                                    <button type="button" onClick={() => { handlePromptChange({target:{value: enhancedPrompt}}); setEnhancedPrompt(""); }} className="flex-1 bg-blue-600 text-white text-xs rounded-lg py-2 hover:bg-blue-700">Use Suggestion</button>
                                    <button type="button" onClick={() => setEnhancedPrompt("")} className="flex-1 border border-gray-300 text-xs rounded-lg py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Discard</button>
                                </div>
                                <button type="button" onClick={async () => { await navigator.clipboard.writeText(enhancedPrompt); toast.success("Copied!"); }} className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-1.5 rounded-lg border dark:border-gray-600 shadow-sm"><Copy size={14} className="text-gray-600 dark:text-gray-300" /></button>
                                </>
                            )}
                        </div>
                    </div>

                    <button type="submit" disabled={!input.trim() || isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-all py-4 rounded-xl text-white font-semibold shadow-lg flex justify-center items-center gap-2">
                        {isGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <><Sparkles size={20} /> Generate Masterpiece</>}
                    </button>
                </form>

                {/* Right Col: Shared Gallery & Activity Feed */}
                <div className="flex flex-col gap-6">
                    {/* Activity Feed */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 flex flex-col h-48">
                        <h2 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider flex justify-between">
                            Activity Feed <span>{activeUsers.length} Online</span>
                        </h2>
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {activities.slice().reverse().map((act, i) => (
                                <div key={i} className={`text-xs px-2 py-1.5 rounded-md ${act.type === 'join' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'}`}>
                                    {act.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Collab Gallery Collection */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 flex flex-col flex-1 min-h-[400px]">
                        <h2 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Shared Room Gallery</h2>
                        {roomGallery.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-center">
                                <p className="text-xs text-gray-400 italic">No images generated in this room yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1">
                                {roomGallery.map(img => (
                                    <div key={img._id} className="relative group rounded-lg overflow-hidden border dark:border-gray-700 shadow-sm">
                                        <img src={img.image} alt={img.prompt} className="w-full h-24 object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <a href={img.image} download={`Collab-${img._id}.png`} className="p-1.5 bg-white text-black rounded-full hover:scale-110"><Download size={14}/></a>
                                            <button onClick={() => { handlePromptChange({target:{value: img.prompt}}); toast.success("Prompt loaded to editor"); }} className="p-1.5 bg-purple-500 text-white rounded-full hover:scale-110" title="Remix Prompt"><RotateCcw size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </Motion.div>
    );
};

export default Collaboration;