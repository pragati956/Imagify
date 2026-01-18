import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='flex flex-col justify-center items-center text-center my-20'>
            <div className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500 '>
                <p> 'Best' Text to image generator</p>
                <img src={assets.star_icon} alt="" />
            </div>
           <h1 className="mt-8 text-4xl sm:text-7xl font-extrabold leading-tight max-w-3xl">
          Turn text to{" "}
          <span className="text-blue-600">image</span>,<br />
          in seconds.
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-xl text-neutral-700 text-base sm:text-lg leading-relaxed">
          Unleash your creativity with AI. Turn your imagination into visual art
          in seconds — just type, and watch the magic happen.
        </p>
            <button className='sm:text-lg text-white bg-black w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full'>Generate Images <img className="h-6" src={assets.star_group} alt="star" /></button>
            <div className='flex flex-wrap justify-center mt-16 gap-3'>
                {Array(6).fill('').map((item, index) => (
                    <img className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10' src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1} alt="" key={index} width={70} />
                ))}
            </div>
            <p className='mt-2'>Generated images from imagify</p>
        </div>
    )
}

export default Header;