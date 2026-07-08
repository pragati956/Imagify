import React from "react";
import { stepsData } from "../../assets/assets";
import { motion as Motion } from "motion/react";

const Steps = () => {
  return (
    <Motion.div
initial={{
opacity:0,
y:60
}}      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
className="
max-w-7xl
mx-auto
py-16
px-6
flex
flex-col
items-center
"    >
  
      <h1 className="text-3xl
sm:text-4xl
lg:text-5xl
font-bold  mb-2">
        How it works
      </h1>

      <p className="text-lg text-gray-500 dark:text-gray-400 transition-colors">
        Transform Words Into Stunning Images
      </p>

      <div className="space-y-4 w-full max-w-3xl text-sm">
        {stepsData.map((item, index) => (
          <div
            key={index}
            className="flex
flex-col
sm:flex-row
items-start
sm:items-center gap-4 p-5 px-8 bg-white
border
border-gray-100
rounded-2xl
shadow-md  border  hover:scale-[1.02] hover:-translate-y-1
hover:shadow-xl transition-all duration-300 "
          >
           <img
src={item.icon}
alt={item.title}
loading="lazy"
className="
w-12
h-12
object-contain
"
/>

            <div>
              <h2 className="font-semibold text-lg text-gray-900">{item.title}</h2>

              <p className="text-gray-600 mt-1 leading-7">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Motion.div>
  );
};

export default Steps;