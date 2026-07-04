import React, { useState, useContext, useEffect } from 'react'
import { assets } from "../assets/assets";
import { motion as Motion } from "motion/react";
import { AppContext } from '../context/AppContext'
import { toast } from "react-toastify";
import {
Copy,
Sparkles,
RotateCcw
} from "lucide-react";


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
if (prompt) {
    setEnhancedPrompt(prompt);
    setOriginalPrompt(input);
}      setOptimizing(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [input, enhancePrompt]);
  const copyPrompt = async () => {
  try {
    await navigator.clipboard.writeText(enhancedPrompt);

    toast.success("Prompt copied to clipboard!");

  } catch (error) {

    toast.error("Failed to copy prompt.");

  }
};

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

  if (input || enhancedPrompt)  {
    if (!enhancedPrompt.trim()) {
    toast.error("Prompt cannot be empty");
    setLoading(false);
    return;
}
      
const result = await generateImage(

enhancedPrompt || input

);
if (result) {
  setImage(result.image);
  setOriginalPrompt(result.originalPrompt);
  setEnhancedPrompt(result.enhancedPrompt); // ✅ Add this

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
<div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg px-5 py-4">

<p className="text-blue-700 animate-pulse">

🎨 AI is generating your masterpiece...

</p>

</div>
)}

  </div>
  {optimizing && (
 <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">

<p className="animate-pulse text-blue-700">

✨ Optimizing prompt...

</p>

</div>
)}
{enhancedPrompt && !loading && (
    <div className="mt-4 max-w-xl w-full bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">   
 <div className="flex justify-between items-start">

    <div>

        <h3 className="font-semibold text-lg text-blue-600">
            ✨ AI Prompt Assistant
        </h3>

        <p className="text-sm text-gray-500 mt-1">
            AI has improved your prompt. You can edit it before generating the image.
        </p>

    </div>

   

</div>

   
   <textarea
disabled={loading || optimizing}
   
   

value={enhancedPrompt}

onChange={(e)=>

setEnhancedPrompt(e.target.value)

}

rows={5}
  placeholder="Edit the AI optimized prompt..."

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
<div className="flex gap-3 mt-4">

 <button
disabled={loading || optimizing}
type="button"
onClick={() => setEnhancedPrompt(originalPrompt)}
className="
flex-1
flex
items-center
justify-center
gap-2
border
border-gray-300
rounded-lg
py-3
hover:bg-gray-100
"
>

<RotateCcw size={18}/>

Restore Original
</button>

   <button
disabled={loading || optimizing}
type="button"
onClick={copyPrompt}
className="
flex-1
flex
items-center
justify-center
gap-2
bg-gray-200
rounded-lg
py-3
hover:bg-gray-300
"
>

<Copy size={18}/>

Copy Prompt
</button>

  <button
type="submit"
disabled={loading || optimizing}
className="
flex-1
flex
items-center
justify-center
gap-2
bg-blue-600
hover:bg-blue-700
text-white
rounded-lg
py-3
"
>

<Sparkles size={18}/>

Generate Image
</button>

</div>
  </div>
)}


     {!isImageLoaded && !enhancedPrompt && (
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
  setOptimizing(false);
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
