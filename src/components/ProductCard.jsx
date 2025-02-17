import React from "react";
import "../assets/styles/HomeProductSection.css";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate()

    return (
        <div className="decoration-card" key={product.id} onClick={() => navigate(`/product/${product?.id || product?._id || 2}`)}>
            <img src={product.image} alt={product.title} className="decoration-image" />
            <h3 className="decoration-card-title">{product.title}</h3>
            <p className="decoration-description">{product.description}</p>
            <button className="bulk-order-button">View</button>
        </div>
    );
};

export default ProductCard;
