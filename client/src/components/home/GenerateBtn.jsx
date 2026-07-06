import React from 'react'
import { assets } from "../../assets/assets";
import { motion as Motion } from "motion/react"
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";


const GenerateBtn = () => {
    const {user,setShowLogin} =useContext(AppContext)
    const navigate=useNavigate()
    const onClickHandler=()=>{
        if(user){
            navigate('/result')
        }
        else{
            setShowLogin(true)
        }

    }
    return (
        <Motion.div
initial={{
opacity:0,
y:60
}}        transition={{duration:1}}
        whileInView={{opacity :1, y:0}}
        viewport={{once :true}} className='py-16
px-6 text-center'>
            <p className="text-gray-500 max-w-xl mx-auto mb-8">
Transform your ideas into beautiful AI-generated artwork in seconds.</p>
            <h1 className='text-3xl
sm:text-4xl
lg:text-5xl  font-semibold text-neutral-800 mb-8'>Create Stunning AI Images in Seconds</h1>
            <button onClick={onClickHandler} className='inline-flex items-center gap-3 px-8
sm:px-12 py-3 rounded-full bg-zinc-900
hover:bg-black shadow-lg text-white m-auto hover:scale-105 transition-all duration-300'>
                Generate Images
                <img src={assets.star_group} alt="AI Sparkle Icon" className='w-6 h-6' loading="lazy" />
            </button>
        </Motion.div>
    )
}

export default GenerateBtn
