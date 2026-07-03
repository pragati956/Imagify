import React, { useState, useContext, useEffect } from 'react'
import { assets } from "../assets/assets";
import { motion as Motion } from "motion/react";
import { AppContext } from '../context/AppContext'


const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1)
  const [isImageLoaded, setImageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [optimizing, setOptimizing] = useState(false);
  const [input, setInput] = useState('')
  const [originalPrompt, setOriginalPrompt] = useState("")
const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const { generateImage,enhancePrompt } = useContext(AppContext)
  useEffect(() => {
    if (!input || input.trim().length < 5) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEnhancedPrompt("");
      return;
    }

    const timer = setTimeout(async () => {
      setOptimizing(true);
      const prompt = await enhancePrompt(input);
      if (prompt) setEnhancedPrompt(prompt);
      setOptimizing(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [input, enhancePrompt]);

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (input) {
      
const result = await generateImage(

enhancedPrompt || input

);
if (result) {
  setImage(result.image);
  setOriginalPrompt(result.originalPrompt);

  setImageLoaded(true);
  setInput("");
}
    }
    setLoading(false)
  }

  return (
    <Motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className='flex flex-col min-h-[90vh] justify-center items-center'
    >
     <div className="w-full max-w-3xl flex flex-col items-center">
        <div className='relative'>
      <img
  src={image}
  alt="Generated Image"
  className="w-[380px] sm:w-[420px] rounded-xl shadow-lg border object-cover"
/>
           
          <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`} />
        </div>
       {/* Original Prompt */}
    {originalPrompt && (
     <div className="mt-6 max-w-xl w-full bg-white rounded-xl shadow-md p-5 border">
      <h3 className="font-semibold text-lg text-gray-900">
  📝 Original Prompt
</h3>

        <p className="text-gray-600">
          {originalPrompt}

        </p>
      </div>

    )}
 

    {/* Loading */}
   {loading && (
  <p className="mt-4 text-blue-600 font-medium animate-pulse">
    🎨 AI is generating your image...
  </p>
)}

  </div>
  {optimizing && (
  <p className="mt-4 text-blue-600 font-medium animate-pulse">
    ✨ AI is optimizing your prompt...
  </p>
)}
{!isImageLoaded && enhancedPrompt && (
  <div className="mt-4 max-w-xl w-full bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">    <h3 className="font-semibold text-lg text-blue-600">
      AI Optimized Prompt
    </h3>

   <textarea

value={enhancedPrompt}

onChange={(e)=>

setEnhancedPrompt(e.target.value)

}

rows={5}

className="

w-full

mt-3

bg-white

rounded-lg

border

p-3

outline-none

resize-none

"

></textarea>
  </div>
)}


      {!isImageLoaded && (
        <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'>
          <input
            onChange={e => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder='Describe what you want to generate'
            className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color'
          />
         <button
type="submit"
disabled={loading || optimizing}
className="bg-zinc-900 hover:bg-black transition-all px-10 sm:px-16 py-3 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
>
{loading ? "Generating..." : "Generate"}
</button>
        </div>
      )}

      {isImageLoaded && (
        <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
          <p
            onClick={() => {
  setImageLoaded(false);
  setInput("");
  setOriginalPrompt("");
  setEnhancedPrompt("");
  setLoading(false);
setImage(assets.sample_img_1);
}}  // ✅ FIX
            className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'
          >
            Generate Another
          </p>
          <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>
            Download
          </a>
        </div>
      )}
    </Motion.form>
  )
}

export default Result
