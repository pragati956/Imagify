import React from "react";
import { assets } from "../../assets/assets";
import { motion as Motion } from "motion/react"


const Description = () => {
  return (
    <Motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} className="flex flex-col items-center justify-center my-24 p-6 md:px-28">
        <span className="
text-blue-600
font-semibold
uppercase
tracking-widest
text-sm
">
AI IMAGE GENERATOR
</span>
      <h1 className="text-3xl
sm:text-4xl
lg:text-5xl  font-semibold mb-2">
        Create AI Images
      </h1>

      <p className="text-gray-500 mb-8">
        Turn your imagination into visuals
      </p>
      <div
className="
flex
flex-col
md:flex-row
items-center
justify-center
gap-10
lg:gap-16
"
>
        <img
          src={assets.sample_img_1}
         alt="AI generated artwork example"
className="
w-full
max-w-sm
lg:max-w-md
rounded-xl
shadow-lg
" loading="lazy"        />
      <div className="max-w-xl">

          <h2 className="text-3xl
sm:text-4xl
lg:text-5xl font-bold max-w-lg mb-4 ">
            Introducing the AI-Powered Text to Image Generator
          </h2>

          <p className="text-gray-600 max-w-3xl leading-8  mb-4">
            Easily bring your ideas to life with our free AI image generator.
            Whether you need stunning visuals or unique imagery, our tool
            transforms your text into eye-catching images with just a few clicks.
          </p>

          <p className="text-gray-600 leading-8 max-w-3xl ">
            Simply type in a text prompt and our cutting-edge AI will generate
            high-quality images in seconds. From product visuals to character
            designs, the creative possibilities are limitless.
          </p>
        </div>
      </div>
      
    </Motion.div>
    
  );
};

export default Description;
