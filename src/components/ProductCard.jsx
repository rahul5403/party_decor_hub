import React from "react";
import "../assets/styles/HomeProductSection.css";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, section }) => {
    const navigate = useNavigate();

    const getButtonText = (section) => {
        switch (section) {
            case "Decoration Items":
                return "Add to Cart";
            case "Decoration Services":
                return "Enquiry Now";
            case "Disposable Items":
                return "Add to Cart";
            default:
                return "Add to Cartt";
        }
    };

    return (
        <div className="decoration-card" key={product.id} onClick={() => navigate(`/product/${product?.id || product?._id || 2}`)}>
            <img src={product.image} alt={product.title} className="decoration-image" />
            <h3 className="decoration-card-title">{product.title}</h3>
            <p className="decoration-description">{product.description}</p>
            <button className="bulk-order-button vw">{getButtonText(section)}</button>
        </div>
    );
};

export default ProductCard;