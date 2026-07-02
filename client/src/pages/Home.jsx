import React from "react";
import Header from "../components/home/Header";
import Steps from "../components/home/Steps";
import Description from "../components/home/Description";
import Testimonials from "../components/home/Testimonials";
import GenerateBtn from "../components/home/GenerateBtn";

const Home = () => {
  return (
    <div className="py-6">
      <Header />
      <Steps />
      <Description />
      <Testimonials />
      <GenerateBtn />
    </div>
  );
};

export default Home;