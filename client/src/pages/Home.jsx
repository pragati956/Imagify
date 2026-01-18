import React from "react";
import { assets } from "../assets/assets";
import Header from '../components/Header'
import Steps from "../components/Steps";
import Description from "../components/Description";
import Testimonials from "../components/Testimonials";
import GenerateBtn from "../components/GenerateBtn";

const Home = () => {
  return (
    <div className="py-6">
      <div className="flex items-center gap-2">
        <p className="text-xl font-semibold">
          <Header/>
          <Steps/>
          <Description/>
          <Testimonials />
          <GenerateBtn />
        </p>
        <img src={assets.star_icon} alt="star" className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Home;
