import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Checkout.css";

const BASE_IMAGE_URL = "https://partydecorhub.com";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const shippingCost = 19;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCost = subtotal + shippingCost;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to handle the form submission, e.g., sending the data to a server
    console.log("Form Data Submitted:", formData);
    // Navigate to a confirmation page or show a success message
    navigate("/order-confirmation");
  };

  return (
    <div className="checkout-container">
      {/* Left Section - Form */}
      <div className="checkout-form-section">
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone"
            required
          />

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your address"
            required
          />

          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Your city"
            required
          />

          <div className="checkout-row">
            <div>
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Your country"
                required
              />
            </div>
            <div>
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Your postal code"
                required
              />
            </div>
          </div>

          <button type="submit" className="checkout-button">
            Continue
          </button>
        </form>
      </div>

      {/* Right Section - Cart Summary */}
      <div className="checkout-cart-summary">
        <h2>Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="checkout-cart-item">
            <img
              src={
                item.image
                  ? `${BASE_IMAGE_URL}${item.image}`
                  : item.thumbnail
                  ? `${BASE_IMAGE_URL}${item.thumbnail}`
                  : "https://placehold.co/50x50"
              }
              alt={item.name || item.product_name}
            />
            <div>
              <p>{item.name || item.product_name}</p>
              <p>
                <span className="checkout-discount-price">
                  ₹{item.price.toFixed(2)}
                </span>{" "}
                <span className="checkout-original-price">
                  ₹{item.originalPrice?.toFixed(2) || item.price.toFixed(2)}
                </span>
              </p>
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}

        <div className="checkout-summary">
          <hr />
          <p>
            Subtotal: <span className="fw-bold">₹{subtotal.toFixed(2)}</span>
          </p>
          <p>
            Shipping: <span className="fw-bold">₹{shippingCost.toFixed(2)}</span>
          </p>
          <hr />
          <p>
            Total: <span className="fw-bold">₹{totalCost.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;