import React from "react";
import ProductCard from "./ProductCard";

const ProductSection = ({ products, section }) => {
  return (
    <div className="product-section">
      <h2>{section}</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} section={section} />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
