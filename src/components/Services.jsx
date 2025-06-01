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
      </div>
    </div>

    {/* Top Right Section */}
    <div className="service service-right-top" onClick={() =>  navigate("/decoration")}>
      <div className="service-content">
        <h2>Decoration Services</h2>
      </div>
    </div>

    {/* Bottom Right Section */}
    <div className="service service-right-bottom" onClick={() =>  navigate("/disposable")}>
      <div className="service-content">
        <h2>Disposal Items</h2>
      </div>
    </div>
  </div>
  );
};

export default Services;
