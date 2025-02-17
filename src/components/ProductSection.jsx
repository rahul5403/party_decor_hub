import React from "react";
import ProductCard from "./ProductCard";

const ProductSection = ({products, section}) => {

    return (
        <div className="product-section">
            <div className="sort-bar">
                <h2>{section}</h2>
                <select>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                </select>
            </div>
            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductSection;
