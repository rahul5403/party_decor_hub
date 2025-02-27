import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/styles/DecorBook.css";
import { decorationData, similarProductData } from "../data/data";
import decorimage from "../assets/images/decoration_c.jpg";
import SimilarProductSection from "./SimilarProductSection";
import PincodeModal from "../components/PincodeModal";

const DecorBook = () => {
    const { productId } = useParams();
    const product = decorationData.find(item => item.id === Number(productId)) || decorationData[0];

    const [pincode, setPincode] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [expandedSection, setExpandedSection] = useState(null);
    const [showPincodeModal, setShowPincodeModal] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // Ensure product.images is always an array
    const images = product.images || [decorimage];

    // Autoplay functionality
    useEffect(() => {
        let interval;
        if (isAutoPlay && images.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 3000); // Autoplay speed: 3000ms
        }
        return () => clearInterval(interval);
    }, [isAutoPlay, images.length]);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handlePincodeSubmit = (pincode) => {
        setPincode(pincode);
        setShowPincodeModal(false);
    };

    const handleBooking = () => {
        if (!pincode || !date || !time) {
            alert("Please fill all required fields.");
            return;
        }
        alert(`Booking confirmed for ${product.name} on ${date} at ${time}.`);
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    return (
        <div className="decoration-booking-section">

            {showPincodeModal && (
                <PincodeModal 
                    onClose={() => setShowPincodeModal(false)}
                    onSubmit={handlePincodeSubmit}
                />
            )}

            <div className="booking-container">
                <div className="image-gallery">
                    <img
                        src={images[currentImageIndex]}
                        alt={product.name}
                        className="main-image"
                    />
                    {images.length > 1 && (
                        <div className="slider-dots">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={`custom-dot ${index === currentImageIndex ? "active" : ""}`}
                                    onClick={() => goToImage(index)}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="booking-details">
                    <h1 className="booking-title">{product.name}</h1>
                    <div className="price-section">
                        <span className="discounted-price">₹{product.discountedPrice || 4999}</span>
                        <span className="original-price">₹{product.originalPrice || 8000}</span>
                        <span className="discount">-{product.discount || "37.5"}%</span>
                    </div>

                    <label className="input-label">Check Pin Code Availability *</label>
                    <input type="text" placeholder="Enter pin code" value={pincode} readOnly className="input-field" onClick={() => setShowPincodeModal(true)} />

                    <label className="input-label">Select Date *</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />

                    <label className="input-label">Select Time *</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field" />

                    <button className="book-now-btn" onClick={handleBooking}>Book Now</button>

                    <div className="features">
                        <div className="feature-box">✔ Quality Products</div>
                        <div className="feature-box">⭐ 4.9/5 Google Ratings</div>
                        <div className="feature-box">📞 24/7 Customer Support</div>
                        <div className="feature-box">💳 Secure Payment</div>
                    </div>
                </div>
            </div>

            {[
                { title: "Inclusions", content: ["100 Metallic Balloons (50 Pink & 50 Red)", "10 Heart Shaped Balloons", "'Just Married' Occasion Foil Banner", "1 Fairy Light", "1 Kg Rose Petals", "20 Tea Light Candles", "Ribbons to hang balloons", "Inclusive of all taxes & conveyance charges"] },
                { title: "Description", content: ["Make their first wedding night more beautiful with balloons and floral decoration."] },
                { title: "Must Know", content: ["Please ensure the room is ready for decoration before our team arrives."] },
                { title: "Cancellation & Refund Policy", content: ["Cancellations made 24 hours before the event will receive a full refund."] }
            ].map((section, index) => (
                <div key={index} className="details-section">
                    <div className="section-header" onClick={() => toggleSection(index)}>
                        <h2 className="section-title">{section.title}</h2>
                        <span className="toggle-icon">{expandedSection === index ? "-" : "+"}</span>
                    </div>
                    {expandedSection === index && (
                        <ul className="details-list">
                            {section.content.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            <div className="similar-products">
                <SimilarProductSection products={similarProductData} section={"You might also like"} />
            </div>
        </div>
    );
};

export default DecorBook;