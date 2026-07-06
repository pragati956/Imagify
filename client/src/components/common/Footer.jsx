import React from 'react'
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

import { assets } from "../../assets/assets";
const Footer = () => {
  return (
    <footer className="border-t border-gray-200 mt-4">
      <div className="
max-w-7xl
mx-auto
px-6
lg:px-8
py-6
flex
flex-col
sm:flex-row
items-center
justify-center sm:justify-between
gap-5
">
    <Link
  to="/"
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
>
  <img
    src={assets.logo}
    alt="Imagify Logo"
    className="
      w-32
      sm:w-36
      hover:scale-105
      transition-transform
      duration-300
      cursor-pointer
    "
  />
</Link>
        <p className="
flex-1
sm:border-l
border-gray-300
sm:pl-6
text-center
sm:text-left
text-sm
text-gray-500
">© {new Date().getFullYear()} Imagify. All rights reserved.</p>
       <div className="flex flex-col sm:flex-row gap-5">

  {/* Pragati */}
  <div className="flex items-center gap-2">
    <span className="text-sm font-semibold text-gray-700">
      Sandipan Ray
    </span>

    <a
      href="https://github.com/notoveryet-51"
      aria-label="Sandipan Ray GitHub"
      target="_blank"
      rel="noopener noreferrer"
      className="
text-gray-600
hover:text-black
hover:scale-110
transition-all
duration-200
"
    >
      <FaGithub size={22} />
    </a>

    <a
      href="https://www.linkedin.com/in/sandipan-ray14/"
      aria-label="Sandipan Ray LinkedIn"
      target="_blank"
      rel="noopener noreferrer"
className="
text-blue-600
hover:text-blue-700
hover:scale-110
transition-all
duration-200
"    >
      <FaLinkedin size={22} />
    </a>
  </div>

  {/* Pragati */}
  <div className="flex items-center gap-2">
    <span className="text-sm font-semibold text-gray-700">
      Pragati Singh
    </span>

    <a
      href="https://github.com/pragati956"
      aria-label="Pragati Singh GitHub"
      target="_blank"
      rel="noopener noreferrer"
     className="
text-gray-600
hover:text-black
hover:scale-110
transition-all
duration-200
"
    >
      <FaGithub size={22} />
    </a>

    <a
      href="https://www.linkedin.com/in/pragati-singh0208/"
      aria-label="Pragati Singh LinkedIn"
      target="_blank"
      rel="noopener noreferrer"
      className="
text-blue-600
hover:text-blue-700
hover:scale-110
transition-all
duration-200
"    >
      <FaLinkedin size={22} />
    </a>
  </div>

</div>
      </div>
    </footer>
  )
}

export default Footer
