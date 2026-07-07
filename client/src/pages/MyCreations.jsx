import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { motion as Motion } from 'motion/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// Add Wand2 (Remix) and Image (Empty State) icons
import { ArrowLeft, Download, Wand2, Image as ImageIcon } from 'lucide-react'; 

// --- SKELETON COMPONENT ---
const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border dark:border-gray-700 animate-pulse flex flex-col h-[350px]">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
        <div className="p-5 flex flex-col flex-1 justify-between">
            <div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
            <div className="flex justify-between border-t dark:border-gray-700 pt-3 mt-auto">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="flex gap-2">
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
            </div>
        </div>
    </div>
);

const MyCreations = () => {
    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate(); 
    
    const [allImages, setAllImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCreations = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/image/creations', {
                headers: { token }
            });
            if (data.success) {
                setAllImages(data.images);
                setFilteredImages(data.images); 
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl, token]);

    useEffect(() => {
        if (token) fetchCreations();
        else setLoading(false);
    }, [token, fetchCreations]);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredImages(allImages);
        } else {
            const lowercasedSearch = search.toLowerCase();
            setFilteredImages(allImages.filter(item => 
                item.prompt.toLowerCase().includes(lowercasedSearch)
            ));
        }
    }, [search, allImages]);

    const handleDelete = async (imageId) => {
        try {
            const { data } = await axios.delete(backendUrl + `/api/image/creations/${imageId}`, {
                headers: { token }
            });
            if (data.success) {
                toast.success("Creation deleted");
                setAllImages(prev => prev.filter(img => img._id !== imageId));
                setFilteredImages(prev => prev.filter(img => img._id !== imageId));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (!token) return <div className="text-center mt-20 text-xl font-medium dark:text-white">Please login to view your creations.</div>;

    return (
        <Motion.div
            initial={{ opacity: 0.2, y: 50 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="min-h-[80vh] py-10"
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 md:gap-0">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                        onClick={() => navigate('/')} 
                        className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft className="text-gray-700 dark:text-gray-300" size={22} />
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-semibold dark:text-white">My Creations</h1>
                </div>

                <input
                    type="text"
                    placeholder="Search by prompt..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white px-5 py-2 rounded-full w-full md:w-80 outline-none focus:border-blue-500 shadow-sm"
                />
            </div>

            {loading ? (
                // --- SKELETON SCREENS ---
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
                </div>
            ) : filteredImages.length === 0 ? (
                // --- ILLUSTRATIVE EMPTY STATE ---
                <Motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="text-center mt-20 flex flex-col items-center"
                >
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-6">
                        <ImageIcon className="text-blue-500 w-16 h-16" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">No Creations Yet</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">Your canvas is blank! Let your imagination run wild and generate your first AI masterpiece.</p>
                    <button 
                        onClick={() => navigate('/result')} 
                        className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 font-medium"
                    >
                        Start Creating
                    </button>
                </Motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredImages.map((item) => (
                        <Motion.div 
                            key={item._id} 
                            whileHover={{ scale: 1.02 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border dark:border-gray-700 flex flex-col"
                        >
                            <img src={item.image} alt={item.prompt} className="w-full h-48 object-cover" />
                            <div className="p-5 flex flex-col flex-1 justify-between">
                                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium line-clamp-3 mb-3">
                                    "{item.prompt}"
                                </p>
                                <div className="flex justify-between items-center border-t dark:border-gray-700 pt-3 mt-auto">
                                    <p className="text-xs text-gray-400 font-medium">
                                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </p>
                                    
                                    <div className="flex items-center gap-2">
                                        {/* --- REMIX BUTTON --- */}
                                        <button 
                                            onClick={() => navigate('/result', { state: { remixPrompt: item.prompt } })}
                                            className="bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 text-purple-600 p-1.5 rounded-full transition-colors"
                                            title="Remix this prompt"
                                        >
                                            <Wand2 size={16} />
                                        </button>
                                        <a 
                                            href={item.image} 
                                            download={`Imagify-${item._id}.png`}
                                            className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 text-blue-600 p-1.5 rounded-full transition-colors flex items-center justify-center"
                                            title="Download Image"
                                        >
                                            <Download size={16} />
                                        </a>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-500 hover:text-red-700 text-xs font-semibold px-3 py-1.5 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 rounded-full transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Motion.div>
                    ))}
                </div>
            )}
        </Motion.div>
    );
};

export default MyCreations;