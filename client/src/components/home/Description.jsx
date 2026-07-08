import React from "react";
import { assets } from "../../assets/assets";
import { motion as Motion } from "motion/react";
import { Sparkles, Tags, Wand2 } from "lucide-react";

const Description = () => {
  return (
    <Motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} 
      className="flex flex-col items-center justify-center py-16 p-6 md:px-28"
    >
      <span className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-widest text-sm mb-2">
        Why Choose Imagify?
      </span>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-2 text-gray-900 dark:text-white transition-colors">
        More Than Just an Image Generator
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-16 text-center max-w-2xl">
        Imagify is engineered to bridge the gap between a simple idea and a professional masterpiece. We provide smart tools that help you craft the perfect prompt effortlessly.
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 w-full">
        
        {/* Visual Samples */}
        <div className="flex gap-4 w-full max-w-md relative">
            <img
                src={assets.sample_img_1}
                alt="AI generated artwork example 1"
                className="w-1/2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-10 hover:scale-105 transition-transform duration-300 object-cover" 
                loading="lazy"        
            />
             <img
                src={assets.sample_img_2}
                alt="AI generated artwork example 2"
                className="w-1/2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mt-8 hover:scale-105 transition-transform duration-300 object-cover" 
                loading="lazy"        
            />
        </div>

        {/* Feature Breakdown */}
        <div className="max-w-xl flex flex-col gap-8">
          
          <div className="flex gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl h-fit">
                  <Tags className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">One-Click Style Tags</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      No need to memorize complex prompt engineering terms. Simply click our curated style tags—like Cyberpunk, Cinematic, or Anime—to instantly apply precise artistic directions to your image.
                  </p>
              </div>
          </div>

          <div className="flex gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl h-fit">
                  <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Assistant</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Have a basic idea? Our integrated AI prompt assistant works in real-time to analyze your input and rewrite it into a highly detailed, textured, and optimally structured prompt for the image generator.
                  </p>
              </div>
          </div>

          <div className="flex gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl h-fit">
                  <Wand2 className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Flawless Rendering</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Powered by industry-leading diffusion models, Imagify guarantees high-resolution, photorealistic, and creative outputs that stay true to your customized vision.
                  </p>
              </div>
          </div>

        </div>
      </div>
    </Motion.div>
  );
};

export default Description;