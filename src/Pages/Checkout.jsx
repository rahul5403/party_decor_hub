import React, { useState } from "react";
import "../assets/styles/Checkout.css"

const Checkout = () => {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        fullName: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
    });

    const cartItems = [
        {
            id: 1,
            name: "Vintage Backpack",
            price: 54.99,
            originalPrice: 94.99,
            image: "https://placehold.co/50x50",
            quantity: 1,
        },
        {
            id: 2,
            name: "Levi Shoes",
            price: 74.99,
            originalPrice: 124.99,
            image: "https://placehold.co/50x50",
            quantity: 1,
        },
    ];

    const shippingCost = 19;
    const totalCost =
        cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) +
        shippingCost;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="checkout-container">
            {/* Left Section - Form */}
            <div className="checkout-form-section">
                <h2>Checkout</h2>
                <form>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />

                    <label>Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone" />

                    <label>Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your name" />

                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Your address" />

                    <label>City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Your city" />

                    <div className="checkout-row">
                        <div>
                            <label>Country</label>
                            <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Your country" />
                        </div>
                        <div>
                            <label>Postal Code</label>
                            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Your postal code" />
                        </div>
                    </div>

                    <button type="submit" className="checkout-button">Continue</button>
                </form>
            </div>

            {/* Right Section - Cart Summary */}
            <div className="checkout-cart-summary">
                {cartItems.map((item) => (
                    <div key={item.id} className="checkout-cart-item">
                        <img src={item.image} alt={item.name} />
                        <div>
                            <p>{item.name}</p>
                            <p>
                                <span className="checkout-discount-price">${item.price.toFixed(2)}</span>{" "}
                                <span className="checkout-original-price">${item.originalPrice.toFixed(2)}</span>
                            </p>
                            <input type="number" value={item.quantity} min="1" className="checkout-quantity-input" />
                        </div>
                    </div>
                ))}

                <div className="checkout-summary">
                    <hr></hr>
                    <p>Shipping: <span className="fw-bold">${shippingCost}</span></p>
                    <hr></hr>
                    <p>Total: <span className="fw-bold">${totalCost.toFixed(2)}</span></p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;