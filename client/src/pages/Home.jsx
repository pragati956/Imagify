import React from "react";
import Header from "../components/home/Header";
import Steps from "../components/home/Steps";
import Description from "../components/home/Description";
import Testimonials from "../components/home/Testimonials";
import Faq from "../components/home/Faq"; // <-- Import Faq here

const Home = () => {
  return (
    <div className="py-6">
      <Header />
      <Steps />
      <Description />
      <Faq /> {/* <-- Add Faq Component here */}
    </div>
  );
};

export default Home;