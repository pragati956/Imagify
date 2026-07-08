import React from 'react'
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-4 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-5">
        
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {/* Wrapping the logo in a dark mode pill so black text is visible */}
          <div className="dark:bg-white dark:px-3 dark:py-1.5 dark:rounded-xl transition-all">
              <img
                src={assets.logo}
                alt="Imagify Logo"
                className="w-32 sm:w-36 hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
          </div>
        </Link>

        {/* Updated borders and text for dark mode */}
        <p className="flex-1 sm:border-l border-gray-300 dark:border-gray-700 sm:pl-6 text-center sm:text-left text-sm text-gray-500 dark:text-gray-400 transition-colors">
          © {new Date().getFullYear()} Imagify. All rights reserved.
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          {/* Sandipan */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">
              Sandipan Ray
            </span>
            <a
              href="https://github.com/notoveryet-51"
              aria-label="Sandipan Ray GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:scale-110 transition-all duration-200"
            >
              <FaGithub size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/sandipan-ray14/"
              aria-label="Sandipan Ray LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:scale-110 transition-all duration-200"
            >
              <FaLinkedin size={22} />
            </a>
          </div>

          {/* Pragati */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">
              Pragati Singh
            </span>
            <a
              href="https://github.com/pragati956"
              aria-label="Pragati Singh GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:scale-110 transition-all duration-200"
            >
              <FaGithub size={22} />
            </a>
            <a
              href="https://www.linkedin.com/in/pragati-singh0208/"
              aria-label="Pragati Singh LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:scale-110 transition-all duration-200"
            >
              <FaLinkedin size={22} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer;