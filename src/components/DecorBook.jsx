import React, { useState } from "react";
import "../assets/styles/DecorBook.css";
import { Helmet } from "react-helmet-async";
import { decorationData } from "../data/data";
import decorimage from "../assets/images/decoration_c.jpg";

const DecorBook = () => {
    const [pincode, setPincode] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const product = decorationData[0];

    return (
        <div className="decoration-booking-section">
            <Helmet>
                <title>Book Decoration - Party Decor Hub</title>
                <meta name="description" content={`Book ${product.name} for your special occasion at an affordable price.`} />
            </Helmet>
            <div className="booking-container">
                <div className="image-gallery">
                    <img src={decorimage} alt="Decoration" className="main-image" />
                </div>
                <div className="booking-details">
                    <h1 className="booking-title">{product.name}</h1>
                    <div className="price-section">
                        {/* <span className="discounted-price">₹{product.price}</span> */}
                        <span className="discounted-price">₹4999</span>

                        {/* <span className="original-price">₹{product.originalPrice}</span> */}
                        <span className="original-price">₹8000</span>
                        {/* <span className="discount">-{product.discount}%</span> */}
                        <span className="discount">-37.5%</span>
                    </div>
                    <label className="input-label">Check Pin Code Availability *</label>
                    <input 
                        type="text" 
                        placeholder="Enter pin code to enable date and time" 
                        value={pincode} 
                        onChange={(e) => setPincode(e.target.value)}
                        className="input-field"
                    />
                    <label className="input-label">Select Date *</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
                    <label className="input-label">Select Time *</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field" />
                    <button className="book-now-btn">Book Now</button>
                    <div className="features">
                        <div className="feature-box">✔ Quality Products</div>
                        <div className="feature-box">⭐ 4.9/5 Google Ratings</div>
                        <div className="feature-box">📞 24/7 Customer Support</div>
                        <div className="feature-box">💳 Secure Payment</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DecorBook;

