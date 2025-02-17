import React, { useState } from "react";
import "../assets/styles/ProductDetails.css";
import SimilarProductSection from "../components/SimilarProductSection";
import { data, similarProductData } from "../data/data";
import {useDispatch} from "react-redux"
import { addToCart } from "../redux/cartSlice";
import { decorationData } from "../data/data";
import { Helmet } from "react-helmet";


const ProductDetails = () => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const product = decorationData[0];

    const [activeTab, setActiveTab] = useState("description");

    const handleQuantityChange = (type) => {
        if (type === "increment") {
            setQuantity(quantity + 1);
        } else if (type === "decrement" && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const renderTabContent = () => {
        if (activeTab === "description") {
            return (
                <div className="tab-content">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum. Sed ut
                        perspiciatis unde omnis iste natus error sit voluptatem accusantium
                        doloremque laudantium, totam rem aperiam.
                    </p>
                </div>
            );
        } else if (activeTab === "reviews") {
            return (
                <div className="tab-content">
                    <p>No reviews yet. Be the first to write a review!</p>
                </div>
            );
        }
    };

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity }));
    };


    return (
        <div className="product-details-section">
                        <Helmet>
                <title>{product.name} | Decor Hub</title>
                <meta name="description" content={`Buy ${product.name} at an affordable price on Decor Hub.`} />
            </Helmet>
            <div className="product-details-container">
                <div className="product-image">
                    <img
                        src="https://placehold.co/400x400"
                        alt="Product"
                    />
                </div>
                <div className="product-info">
                    <h1 className="product-title">Product Detail</h1>
                    <div className="product-reviews">
                        <span className="stars">★★★★☆</span>
                        <span className="review-count">3 Reviews</span>
                    </div>
                    <div className="product-price">
                        ₹39.00 <span className="original-price">₹29.00</span>
                    </div>
                    <p className="product-description">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat.
                    </p>
                    <div className="product-options">
                        <div className="option">
                            <label htmlFor="size">Size</label>
                            <select id="size" name="size">
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                            </select>
                        </div>
                        <div className="option">
                            <label htmlFor="color">Color</label>
                            <select id="color" name="color">
                                <option value="Blue">Blue</option>
                                <option value="Red">Red</option>
                                <option value="Black">Black</option>
                            </select>
                        </div>
                    </div>
                    <div className="quantity-selector">
                        <button onClick={() => handleQuantityChange("decrement")}>-</button>
                        <input
                            type="text"
                            value={quantity}
                            readOnly
                        />
                        <button onClick={() => handleQuantityChange("increment")}>+</button>
                    </div>
                    <button className="add-to-cart-btn"  onClick={handleAddToCart}>Add to Cart</button>
                </div>
            </div>
            {/* Tab Section */}
            <div className="product-tabs">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === "description" ? "active" : ""}`}
                        onClick={() => setActiveTab("description")}
                    >
                        Description
                    </button>
                    <button
                        className={`tab ${activeTab === "reviews" ? "active" : ""}`}
                        onClick={() => setActiveTab("reviews")}
                    >
                        Reviews (0)
                    </button>
                </div>
                {renderTabContent()}
            </div>
            <SimilarProductSection  products={similarProductData} section={"You might also like"}/>
        </div>
    );
};

export default ProductDetails;
