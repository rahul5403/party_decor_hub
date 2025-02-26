import React from "react";
import "../assets/styles/About.css";
import AboutImage from "../assets/images/About.jpg";

function About({ data, addToCart }) {
  return (
    <div className="about-section">
      <h1 className="about-title">About Us</h1>
      <div className="about-inner-section">
        <div className="left-section">
          <p className="about-description">
            Welcome to Party Decorhub, your one-stop destination for all things
            celebration! We specialize in providing top-quality decoration
            items, decoration services, and disposable items that will make your
            events truly unforgettable. Whether you're planning a birthday,
            wedding, corporate event, or any special occasion, Party Decorhub is
            here to transform your vision into reality.
            <br />
            <br />
            We offer a wide range of elegant and stylish decoration items that
            suit every theme and preference. Our professional decoration
            services ensure that every corner of your event is beautifully
            arranged, while our disposable items make clean-up effortless
            without compromising on quality or style.
            <br />
            <br />
            At Party Decorhub, we are committed to delivering exceptional
            products and services with a personal touch. Your happiness is our
            priority, and we strive to make every event a memorable one.
            <br />
            <br />
            Let us bring your celebration to life with the perfect decor!
          </p>
        </div>
        <div className="right-section">
          <img src={AboutImage} className="about-img" />
        </div>
      </div>
    </div>
  );
}

export default About;
