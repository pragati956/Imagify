import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { motion as Motion } from 'motion/react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyCreations = () => {
    const { backendUrl, token } = useContext(AppContext);
    const [images, setImages] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCreations = useCallback(async (searchQuery = '') => {
        try {
            // Using Axios params handles the ?search= formatting and prevents double-slash bugs
            const { data } = await axios.get(backendUrl + '/api/image/creations', {
                params: { search: searchQuery },
                headers: { token }
            });
            if (data.success) {
                setImages(data.images);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl, token]);

    const handleDelete = async (imageId) => {
        try {
            const { data } = await axios.delete(backendUrl + `/api/image/creations/${imageId}`, {
                headers: { token }
            });
            if (data.success) {
                toast.success("Creation deleted");
                setImages(images.filter(img => img._id !== imageId));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCreations(search);
        } else {
            setLoading(false);
        }
    }, [token, search, fetchCreations]);

    // If no token, show login message
    if (!token) {
        return <div className="text-center mt-20 text-xl font-medium">Please login to view your creations.</div>;
    }

    return (
        <Motion.div
            initial={{ opacity: 0.2, y: 50 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="min-h-[80vh] py-10"
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-semibold mb-4 md:mb-0">My Creations</h1>
                <input
                    type="text"
                    placeholder="Search by prompt..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-5 py-2 rounded-full w-full md:w-80 outline-none focus:border-blue-500 shadow-sm"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <p className="text-gray-500 text-lg animate-pulse">Loading your masterpieces...</p>
                </div>
            ) : images.length === 0 ? (
                <div className="text-center mt-20">
                    <p className="text-gray-500 text-lg">No creations found. Go generate some magic!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {images.map((item) => (
                        <Motion.div 
                            key={item._id} 
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden border flex flex-col"
                        >
                            <img src={item.image} alt={item.prompt} className="w-full h-64 object-cover" />
                            <div className="p-5 flex flex-col flex-1 justify-between">
                                <p className="text-gray-800 text-sm font-medium line-clamp-3 mb-3">
                                    "{item.prompt}"
                                </p>
                                <div className="flex justify-between items-center border-t pt-3 mt-auto">
                                    <p className="text-xs text-gray-400">
                                        {new Date(item.createdAt).toLocaleString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                    <button 
                                        onClick={() => handleDelete(item._id)}
                                        className="text-red-500 hover:text-red-700 text-xs font-semibold px-3 py-1 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                                    >
                                        Delete
                                    </button>
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