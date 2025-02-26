import React from "react";
import "../assets/styles/Services.css";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate()

  return (
    <div className="service-blocks">
    {/* Left Section */}
    <div className="service service-left" onClick={() =>  navigate("/party")}>
      <div className="service-content">
        <h2>Decoration Items</h2>
        <p>Elegant and stylish decoration items to enhance your space with charm and beauty.</p>
      </div>
    </div>

    {/* Top Right Section */}
    <div className="service service-right-top" onClick={() =>  navigate("/decoration")}>
      <div className="service-content">
        <h2>Decoration Services</h2>
        <p>Transform your space with our expert decoration services, creating a personalized and stunning atmosphere.</p>
      </div>
    </div>

    {/* Bottom Right Section */}
    <div className="service service-right-bottom" onClick={() =>  navigate("/disposable")}>
      <div className="service-content">
        <h2>Disposal Items</h2>
        <p>Convenient and eco-friendly disposable items for easy cleanup and sustainable everyday use.</p>
      </div>
    </div>
  </div>
  );
};

export default Services;
