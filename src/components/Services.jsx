import React from "react";
import "../assets/styles/Services.css";
import image1 from "../assets/images/image1.jpg"
import image2 from "../assets/images/image2.jpg"
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate()

  return (
    <div className="service-blocks">
    {/* Left Section */}
    <div className="service service-left" onClick={() =>  navigate("/party")}>
      <div className="service-content">
        <h2>Party</h2>
        <p>Details about the service on the left side. This block spans the full height on the left.</p>
      </div>
    </div>

    {/* Top Right Section */}
    <div className="service service-right-top" onClick={() =>  navigate("/decoration")}>
      <div className="service-content">
        <h2>Decor</h2>
        <p>Details about the top-right service.</p>
      </div>
    </div>

    {/* Bottom Right Section */}
    <div className="service service-right-bottom" onClick={() =>  navigate("/disposable")}>
      <div className="service-content">
        <h2>Disposal Items</h2>
        <p>Details about the bottom-right service.</p>
      </div>
    </div>
  </div>
  );
};

export default Services;
