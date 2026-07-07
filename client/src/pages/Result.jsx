import React, { useState, useContext, useEffect } from 'react';
import { motion as Motion } from "motion/react";
import { AppContext } from '../context/AppContext';
import { toast } from "react-toastify";
import { Copy, Sparkles, RotateCcw, Wand2, Image as ImageIcon, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Make sure useLocation is here

// Predefined Suggestions & Effects
const suggestions = [
  "A futuristic cyberpunk city with flying cars at sunset",
  "A magical forest with glowing bioluminescent mushrooms",
  "An astronaut relaxing on a tropical beach in space",
  "A majestic lion wearing a golden crown"
];

// Removed "None", made them actionable tags
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
  
  // New Array state for multiple tags
  const [selectedTags, setSelectedTags] = useState([]);

  const { generateImage, enhancePrompt } = useContext(AppContext);

  const location = useLocation();

// Catch the Remix prompt
useEffect(() => {
  if (location.state && location.state.remixPrompt) {
    setInput(location.state.remixPrompt);
    // Clear the router state so it doesn't trigger again on page refresh
    window.history.replaceState({}, document.title);
  }
}, [location]);

  // Toggle a tag on/off
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Auto-enhance prompt when user stops typing or changes tags
  useEffect(() => {
    if (!input || input.trim().length < 5) {
      setEnhancedPrompt("");
      return;
    }

    const timer = setTimeout(async () => {
      setOptimizing(true);
      // Pass the selected tags to Gemini so it knows the vibe you want!
      const styleContext = selectedTags.length > 0 ? `(Apply these styles: ${selectedTags.join(", ")})` : "";
      const promptToOptimize = `${input} ${styleContext}`.trim();
      
      const prompt = await enhancePrompt(promptToOptimize);
      if (prompt) {
        setEnhancedPrompt(prompt);
      }
      setOptimizing(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [input, selectedTags, enhancePrompt]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy prompt.");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const basePromptToUse = enhancedPrompt.trim() || input.trim();

    if (!basePromptToUse) {
      toast.error("Prompt cannot be empty");
      return;
    }

    setLoading(true);

    // PREPEND tags so the Image Generator prioritizes them heavily
    const tagPrefix = selectedTags.length > 0 ? `${selectedTags.join(", ")} style, highly detailed. ` : "";
    const finalPrompt = `${tagPrefix}${basePromptToUse}`;

    const result = await generateImage(finalPrompt);
    
    if (result) {
      setImage(result.image);
      // Save the EXACT final prompt to history so the user sees the tags were applied
      setOriginalPrompt(finalPrompt); 
      setEnhancedPrompt(result.originalPrompt); 
      setImageLoaded(true);
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setImageLoaded(false);
    setInput("");
    setOriginalPrompt("");
    setEnhancedPrompt("");
    setImage(null);
    setSelectedTags([]);
  };

  return (
    <Motion.div
      initial={{ opacity: 0.2, y: 50 }}
      transition={{ duration: 0.6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='flex flex-col min-h-[80vh] justify-center items-center py-10'
    >
      
      {/* --- STATE 1: IMAGE LOADED --- */}
      {isImageLoaded ? (
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className='relative overflow-hidden rounded-xl shadow-xl border'>
            <img src={image} alt="Generated Artwork" className="w-[380px] sm:w-[500px] object-cover" />
          </div>

          <div className="mt-6 w-full bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Prompt Used:</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{originalPrompt}</p>
          </div>

          <div className='flex gap-4 w-full mt-8'>
            <button
              onClick={resetForm}
              className='flex-1 border border-zinc-900 text-black px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium'
            >
              Generate Another
            </button>
            <a 
              href={image} 
              download 
              className='flex-1 bg-zinc-900 text-white px-6 py-3 rounded-full hover:bg-black transition-colors font-medium text-center'
            >
              Download Image
            </a>
          </div>
        </div>
      ) 
      
      /* --- STATE 2: LOADING --- */
      : loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
          <p className="text-2xl text-blue-600 font-medium animate-pulse flex items-center gap-2">
            <Wand2 className="animate-bounce" /> Weaving the magic...
          </p>
          <p className="text-gray-500 mt-2">This usually takes about 10-15 seconds.</p>
        </div>
      ) 
      
      /* --- STATE 3: CREATION STUDIO (Form) --- */
      : (
        <form onSubmit={onSubmitHandler} className="w-full max-w-4xl flex flex-col gap-8">
          
          <div className="text-center mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Creation Studio</h1>
            <p className="text-gray-500">Describe your vision, snap on some style tags, and let AI do the rest.</p>
          </div>

          {/* Suggestions Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Try a suggestion</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInput(sug)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-full transition-colors border border-blue-100"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Effects / Tags Selector */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Style Tags</h3>
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
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-200 border-gray-200'
                    }`}
                  >
                    {eff} {isActive && <X size={14} className="opacity-70 hover:opacity-100" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Prompts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* User Input with Visual Tags */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <ImageIcon size={18} /> Your Idea
              </h3>
              
              {/* Visual Tags Rendered inside the input area */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  {selectedTags.map(tag => (
                    <span key={tag} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                      {tag} 
                      <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => toggleTag(tag)} />
                    </span>
                  ))}
                </div>
              )}

              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Describe what you want to generate..."
                className="flex-1 w-full bg-transparent outline-none resize-none min-h-[120px] text-gray-800"
              />
            </div>

            {/* AI Assistant Output */}
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col relative focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <h3 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2"><Sparkles size={18} /> AI Assistant</span>
                {optimizing && <span className="text-xs font-medium text-blue-500 animate-pulse bg-blue-100 px-2 py-1 rounded-full">Optimizing...</span>}
              </h3>
              <textarea
                disabled={loading || optimizing}
                value={enhancedPrompt}
                onChange={e => setEnhancedPrompt(e.target.value)}
                placeholder="The AI will enhance your prompt here based on your tags. You can manually edit this text before generating."
                className="flex-1 w-full bg-transparent outline-none resize-none min-h-[120px] text-gray-800"
              />
              {enhancedPrompt && (
                 <div className="absolute bottom-6 right-6 flex gap-2">
                    <button type="button" onClick={() => setEnhancedPrompt(input)} className="bg-white p-2 rounded-lg hover:bg-gray-100 border shadow-sm transition-colors" title="Restore Original">
                      <RotateCcw size={16} className="text-gray-600" />
                    </button>
                    <button type="button" onClick={copyPrompt} className="bg-white p-2 rounded-lg hover:bg-gray-100 border shadow-sm transition-colors" title="Copy Prompt">
                      <Copy size={16} className="text-gray-600" />
                    </button>
                 </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all py-4 rounded-xl text-white font-semibold text-lg shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2 mt-2"
          >
            <Sparkles size={20} /> Generate Masterpiece
          </button>

        </form>
      )}
    </Motion.div>
  )
}

export default Result;