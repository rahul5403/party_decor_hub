import React from "react";
import "../assets/styles/HomeProductSection.css";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, section }) => {
    const navigate = useNavigate();

    const getButtonText = (section) => {
        switch (section) {
            case "Decoration Items":
            case "Disposable Items":
                return "Add to Cart";
            case "Decoration Services":
                return "Enquiry Now";
            default:
                return "Add to Cart";
        }
    };

    const handleNavigation = () => {
        if (section === "Decoration Services") {
            navigate(`/decor/${product?.id || product?._id || 2}`);
        } else {
            navigate(`/product/${product?.id || product?._id || 2}`);
        }
    };

    return (
        <div className="decoration-card" key={product.id} onClick={handleNavigation}>
            <img src={product.image} alt={product.title} className="decoration-image" />
            <h3 className="decoration-card-title">{product.title}</h3>
            <p className="decoration-description">{product.description}</p>
            <button className="bulk-order-button vw">{getButtonText(section)}</button>
        </div>
    );
};

export default ProductCard;
