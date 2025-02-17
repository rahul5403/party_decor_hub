import React from "react";
import "../assets/styles/Features.css";

const Features = () => {
  const features = [
    { icon: "🛒", title: "10% Off On First Order" },
    { icon: "🔄", title: "Easy Returns" },
    { icon: "🔒", title: "Secure Payment" },
    { icon: "🚚", title: "Free Shipping" },
    { icon: "💰", title: "Buy More Save More" },
  ];

  return (
    <div className="features">
      {features.map((feature, index) => (
        <div key={index} className="feature">
          <span className="icon">{feature.icon}</span>
          <p>{feature.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;
