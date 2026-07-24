import React, { useState, useContext, useEffect } from 'react';
import { motion as Motion } from "motion/react";
import { AppContext } from '../context/AppContext';
import { useNavigate, useLocation } from "react-router-dom"; 
import { toast } from "react-toastify";
import { Copy, Sparkles, RotateCcw, Wand2, Image as ImageIcon, X, ArrowLeft, Users, PlusCircle, LogIn } from "lucide-react"; 

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

const Result = () => {
  const [image, setImage] = useState(null);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  
  const [input, setInput] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const [referenceImage, setReferenceImage] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null); 

  // Added modal and join-code states
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [inputRoomId, setInputRoomId] = useState('');

  const { generateImage, enhancePrompt, user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.remixPrompt) {
      setInput(location.state.remixPrompt);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleEnhancePrompt = async () => {
    if(!input.trim()) return;
    setOptimizing(true);

    const styleContext = selectedTags.length > 0
        ? `(Apply these styles: ${selectedTags.join(", ")})`
        : "";

    const promptToOptimize = `${input} ${styleContext}`.trim();

    const prompt = await enhancePrompt(promptToOptimize, referenceImage);

    if(prompt){
        setEnhancedPrompt(prompt);
    }

    setOptimizing(false);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy prompt.");
    }
  };

  // Open collaboration selection modal
  const handleOpenCollabModal = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setShowCollabModal(true);
  };

  // Create a brand new room code
  const handleCreateNewRoom = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setShowCollabModal(false);
    navigate(`/collaboration/${newRoomCode}`, { state: { initialPrompt: input } });
  };

  // Join an existing room via typed ID
  const handleJoinExistingRoom = (e) => {
    e.preventDefault();
    const cleanedCode = inputRoomId.trim().toUpperCase();
    if (!cleanedCode) {
      toast.error("Please enter a valid Room Code");
      return;
    }
    setShowCollabModal(false);
    navigate(`/collaboration/${cleanedCode}`, { state: { initialPrompt: input } });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
        toast.error("Prompt cannot be empty");
        return;
    }

    setLoading(true);

    const tagPrefix = selectedTags.length > 0
            ? `${selectedTags.join(", ")} style, highly detailed. `
            : "";

    const finalPrompt = `${tagPrefix}${input.trim()}`;

    const result = await generateImage(finalPrompt, referenceImage);

    if (result) {
        setImage(result.image);
        setOriginalPrompt(finalPrompt);
        setImageLoaded(true);
    }

    setLoading(false);
  };

  const useSuggestion = () => {
    setInput(enhancedPrompt);
    setEnhancedPrompt("");
  };

  const keepOriginal = () => {
    setEnhancedPrompt("");
  };

  const resetForm = () => {
    setImageLoaded(false);
    setInput("");
    setOriginalPrompt("");
    setEnhancedPrompt("");
    setImage(null);
    setSelectedTags([]);
    setReferenceImage(null); 
    setPreviewUrl(null); 
  };

  const handleImageUpload = (e) => { 
    const file = e.target.files[0];
    if (file) {
      setReferenceImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0.2, y: 50 }}
      transition={{ duration: 0.6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='flex flex-col min-h-[80vh] justify-center items-center py-10 relative'
    >
      {/* Collaboration Option Modal */}
      {showCollabModal && (
        <div 
          className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex justify-center items-center p-4"
          onClick={() => setShowCollabModal(false)}
        >
          <Motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
          >
            <button 
              onClick={() => setShowCollabModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
              <Users className="text-purple-500" /> Collaboration
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Work together on a prompt in real-time.</p>

            <div className="flex flex-col gap-4">
              {/* Option A: Create Room */}
              <button
                type="button"
                onClick={handleCreateNewRoom}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-500/20"
              >
                <PlusCircle size={18} /> Create New Room
              </button>

              <div className="flex items-center my-1">
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                <span className="px-3 text-xs text-gray-400 uppercase tracking-wider font-medium">or</span>
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
              </div>

              {/* Option B: Join Room via ID */}
              <form onSubmit={handleJoinExistingRoom} className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Join via Room Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 8F92A1"
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 dark:text-white uppercase font-mono tracking-wider text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold px-4 py-2.5 rounded-xl hover:scale-105 transition-all text-sm flex items-center gap-1"
                  >
                    <LogIn size={16} /> Join
                  </button>
                </div>
              </form>
            </div>
          </Motion.div>
        </div>
      )}

      {isImageLoaded ? (
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className='relative overflow-hidden rounded-xl shadow-xl border dark:border-gray-700'>
            <img src={image} alt="Generated Artwork" className="w-[380px] sm:w-[500px] object-cover" />
          </div>

          <div className="mt-6 w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Prompt Used:</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{originalPrompt}</p>
          </div>

          <div className='flex gap-4 w-full mt-8'>
            <button
              onClick={resetForm}
              className='flex-1 border border-zinc-900 dark:border-gray-400 text-black dark:text-white px-6 py-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium'
            >
              Generate Another
            </button>
            <a 
              href={image} 
              download 
              className='flex-1 bg-zinc-900 dark:bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-black dark:hover:bg-blue-700 transition-colors font-medium text-center'
            >
              Download Image
            </a>
          </div>
        </div>
      ) 
      
      : loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-6"></div>
          <p className="text-2xl text-blue-600 dark:text-blue-400 font-medium animate-pulse flex items-center gap-2">
            <Wand2 className="animate-bounce" /> Weaving the magic...
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">This usually takes about 10-15 seconds.</p>
        </div>
      ) 
      
      : (
        <form onSubmit={onSubmitHandler} className="w-full max-w-4xl flex flex-col gap-8">
          
          <div className="flex flex-col md:flex-row items-center justify-center relative mb-2">
            <button 
                type="button"
                onClick={() => navigate('/')} 
                className="absolute left-0 hidden md:flex p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Back to Home"
            >
                <ArrowLeft className="text-gray-700 dark:text-gray-300" size={22} />
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Creation Studio</h1>
              <p className="text-gray-500 dark:text-gray-400 transition-colors">Describe your vision, snap on some style tags, and let AI do the rest.</p>
            </div>

            <button 
                type="button"
                onClick={handleOpenCollabModal} 
                className="absolute right-0 hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 border border-purple-200 dark:border-purple-700 shadow-sm rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors font-medium text-sm"
            >
                <Users size={18} /> Collaborate
            </button> 
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Try a suggestion</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInput(sug)}
                  className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm px-4 py-2 rounded-full transition-colors border border-blue-100 dark:border-blue-800"
                >
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
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleTag(eff)}
                    className={`text-sm px-4 py-2 rounded-full transition-all border flex items-center gap-2 ${
                      isActive 
                        ? 'bg-zinc-900 dark:bg-gray-200 text-white dark:text-zinc-900 border-zinc-900 dark:border-gray-200 shadow-md' 
                        : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {eff} {isActive && <X size={14} className="opacity-70 hover:opacity-100" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/50 transition-all">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <ImageIcon size={18} /> Your Idea
              </h3>
              
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                  {selectedTags.map(tag => (
                    <span key={tag} className="bg-zinc-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                      {tag} 
                      <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => toggleTag(tag)} />
                    </span>
                  ))}
                </div>
              )}

              {previewUrl && ( 
                <div className="relative mb-3 w-32 h-32">
                  <img src={previewUrl} alt="Reference" className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-600" />
                  <button 
                    type="button" 
                    onClick={() => { setReferenceImage(null); setPreviewUrl(null); }} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-105"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Describe what you want to generate..."
                className="flex-1 w-full bg-transparent outline-none resize-none min-h-[120px] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={optimizing || !input.trim()}
                className="mt-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2"
              >
                {optimizing ? "Enhancing..." : "✨ Enhance Prompt"}
              </button>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"> 
                <label className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 w-max">
                  <ImageIcon size={16} /> Upload Style Reference (Optional)
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50 shadow-sm flex flex-col relative focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/50 transition-all">
             <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    <Sparkles size={18} />
                    AI Assistant
                </span>
                {optimizing && (
                    <span className="text-xs font-medium text-blue-500 dark:text-blue-300 animate-pulse bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                        Optimizing...
                    </span>
                )}
            </h3>

            {!enhancedPrompt ? (
                <div className="flex flex-col justify-center items-center h-full text-center py-8">
                    <Sparkles className="text-blue-500 mb-3" size={32} />
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                        No AI Suggestion Yet
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Type your prompt and click
                        <br />
                        <span className="font-semibold">
                            ✨ Enhance Prompt
                        </span>
                        to get an AI-improved version.
                    </p>
                </div>
            ) : (
              <>
              <textarea
                disabled={loading || optimizing}
                value={enhancedPrompt}
                onChange={e => setEnhancedPrompt(e.target.value)}
                placeholder="The AI will enhance your prompt here based on your tags. You can manually edit this text before generating."
                className="flex-1 w-full bg-transparent outline-none resize-none min-h-[120px] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <div className="flex gap-3 mt-4">
                <button
                    type="button"
                    onClick={useSuggestion}
                    className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                >
                    Use Suggestion
                </button>

                <button
                    type="button"
                    onClick={keepOriginal}
                    className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Keep Original
                </button>
              </div>
              
              {enhancedPrompt && (
                 <div className="absolute bottom-6 right-6 flex gap-2">
                    <button type="button" onClick={keepOriginal} className="bg-white dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-600 shadow-sm transition-colors" title="Restore Original">
                      <RotateCcw size={16} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <button type="button" onClick={copyPrompt} className="bg-white dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-600 shadow-sm transition-colors" title="Copy Prompt">
                      <Copy size={16} className="text-gray-600 dark:text-gray-300" />
                    </button>
                 </div>
              )}
              </>
            )}
            </div>
          </div>

          <div className="flex gap-4 mt-2"> 
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all py-4 rounded-xl text-white font-semibold text-lg shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2"
              >
                <Sparkles size={20} /> Generate Masterpiece
              </button>
              
              <button 
                type="button"
                onClick={handleOpenCollabModal} 
                className="md:hidden flex-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 py-4 rounded-xl font-semibold text-lg flex justify-center items-center gap-2 transition-colors"
              >
                <Users size={20} /> Collaborate
              </button> 
          </div>

        </form>
      )}
    </Motion.div>
  )
}

export default Result;