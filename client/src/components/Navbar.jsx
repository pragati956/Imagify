import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { user,setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Container */}
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <img
            src={assets.logo}
            alt="logo"
            className="w-28 sm:w-32 lg:w-40 cursor-pointer"
          />
        </Link>

        {/* Right section */}
        {user ? (
          <div className="flex items-center gap-3 sm:gap-5">

            {/* Credits button */}
            <button
              onClick={() => navigate("/buy")}
              className="flex items-center gap-2 bg-blue-200 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition duration-300"
            >
              <img src={assets.credit_star} alt="credit" className="w-5" />
              <p className="text-xs sm:text-sm font-medium text-gray-800">
                Credits left : 50
              </p>
            </button>

            {/* Username */}
            <p className="text-gray-800 hidden sm:block">
              Hi, Pragati
            </p>

            {/* Profile dropdown */}
            <div className="relative group">
              <img
                src={assets.profile_icon}
                className="w-10 cursor-pointer drop-shadow"
                alt="profile"
              />

              <div className="absolute right-0 top-10 hidden group-hover:block z-20">
                <ul className="bg-white border rounded-md text-sm shadow-md">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 sm:gap-6">
            <p
              onClick={() => navigate("/buy")}
              className="cursor-pointer text-gray-700 hover:text-black"
            >
              Pricing
            </p>

            <button
              onClick={() =>setShowLogin(true)} 
              className="bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full hover:opacity-90"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
