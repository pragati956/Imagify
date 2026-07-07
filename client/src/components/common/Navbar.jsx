import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Moon, Sun } from "lucide-react"; // <-- Add this import

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, setShowLogin, logout, credit, theme, setTheme } = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={assets.logo}
            alt="Imagify Logo"
            className="w-28 sm:w-32 lg:w-40 cursor-pointer hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {/* Right Section */}
        {user ? (
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
              type="button"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Credits */}
            <button
              onClick={() => navigate("/buy")}
              className="flex items-center gap-2 bg-blue-200 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition duration-300"
            >
              <img
                src={assets.credit_star}
                alt="Credit Balance"
                className="w-5"
              />

              <p className="hidden sm:block">
                Credits: {credit || 0}
              </p>

              <p className="sm:hidden">{credit || 0}</p>
            </button>

            {/* Username */}
            <p className="hidden sm:block max-w-[120px] truncate">
              Hi, {user?.name || "User"}
            </p>
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <img
                src={assets.profile_icon}
                alt="Profile"
                loading="lazy"
                className="w-10 rounded-full cursor-pointer hover:scale-105 transition-all duration-300 drop-shadow"
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className="absolute right-0 top-12 z-50">
                  <ul className="w-44 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                    <li
                      onClick={() => {
                        navigate("/creations");
                        setOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-700"
                    >
                      My Creations
                    </li>

                    <li
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
              type="button"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              type="button"
              onClick={() => navigate("/buy")}
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Pricing
            </button>

            <button
              onClick={() => setShowLogin(true)}
              className="bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full hover:scale-105 transition-all duration-300 shadow-md active:scale-95"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;