import React from "react";
import "../assets/styles/About.css";
import AboutImage from "../assets/images/About.jpg"

function About({ data, addToCart }) {
    return (
        <div className="about-section">
            <h1 className="about-title">About Us</h1>
            <div className="about-inner-section">
            <div className="left-section">
                <p className="about-description">
                    Welcome to Party DecorHub, your premier destination for all your party decor and disposable needs. We specializes in a wide array of categories and occasions, ensuring we meet the diverse needs of our customers. From birthdays and anniversaries to baby showers and bachelorette parties, we cover it all. Recognizing India's rich tapestry of festivities and celebrations, our commitment extends to encompassing a comprehensive range of seasonal categories, including Diwali, Holi, Eid, Christmas, New Year. Your go-to source with a curated selection that adds a touch of joy and vibrancy to every special moment.<br />
                    <br />
                    we are dedicated to providing high-quality, innovative party decor solutions that elevate your events and make every moment memorable. Our primary goal is to create unforgettable experiences, where every detail is thoughtfully crafted to bring joy and excitement to your celebrations.<br />
                    <br />
                    Our mission is to become the ultimate one-stop-shop for every occasion and celebration.
                </p>
            </div>
            <div className="right-section">
                <img src={AboutImage} className="about-img"/>
            </div>
            </div>
        </div>
    );
}

export default About;
