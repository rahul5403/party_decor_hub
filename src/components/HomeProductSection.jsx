import React from "react";
import "../assets/styles/HomeProductSection.css";
import ProductCard from "./ProductCard";

const HomeProductSection = ({ products, section }) => {
  return (
    <div className="decoration-section">
      <h2 className="decoration-title">{section}</h2>
      <div className="decoration-scroll">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} section={section} />
        ))}
      </div>
    </div>
  );
};

export default HomeProductSection;
