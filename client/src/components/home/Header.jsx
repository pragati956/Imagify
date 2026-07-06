import React from 'react'
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { motion as Motion } from "motion/react"

const Header = () => {
    const { user, setShowLogin } = useContext(AppContext)
    const navigate = useNavigate()
    const onClickHandler = () => {
        if (user) {
            navigate('/result')
        }
        else {
            setShowLogin(true)
        }

    }
    return (
<Motion.div
  className="
    max-w-[870px]
    mx-auto
    flex
    flex-col
    justify-center
    items-center
    text-center
    py-16
    px-6"
    initial={{
opacity:0,
y:60
}}            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <Motion.div className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500 '
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}>
<p>Best AI Text-to-Image Generator</p>
<img
  src={assets.star_icon}
  loading="lazy"
  alt="AI badge icon"
/>            </Motion.div>
            <Motion.h1 className="mt-8 text-4xl
md:text-6xl
lg:text-7xl font-extrabold leading-tight max-w-3xl">
                Turn text to{" "}
              <Motion.span
                className="text-blue-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 2 }}
              >
                image
              </Motion.span>,<br />
                in seconds.
            </Motion.h1>

            {/* Description */}
            <Motion.p className="mt-6 max-w-xl text-neutral-700 text-base sm:text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}>
                Unleash your creativity with AI. Turn your imagination into visual art
                in seconds — just type, and watch the magic happen.
            </Motion.p>
            <Motion.button onClick={onClickHandler} className='sm:text-lg text-white bg-zinc-900
hover:bg-black
shadow-lg
active:scale-95
transition-all
duration-300 w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full'
type="button"
aria-label="Generate AI Images"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ default: { duration: 0.5 }, opacity: { delay: 0.8, duration: 1 } }}>
                Generate Images <img className="h-6" src={assets.star_group} loading="lazy" alt="Generate icon" />
            </Motion.button>
            <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className='flex flex-wrap justify-center mt-16 gap-4'>
                {Array(6).fill('').map((item, index) => (
                    <Motion.img
                    loading="lazy"
                        whileHover={{ scale: 1.05 }} className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10' src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1} alt={`AI generated artwork ${index + 1}`} key={index} width={70} />
                ))}
            </Motion.div>
            <Motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className='mt-2'>Generated images from imagify</Motion.p>
        </Motion.div>
    )
}

export default Header;