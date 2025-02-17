import React from "react";
import Slider from "react-slick";
import "../assets/styles/HeroSection.css";

const HeroSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: dots => (
      <ul style={{ margin: "0" }}> {dots} </ul>
    ),
    customPaging: i => (
      <div className="custom-dot"></div>
    ),
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div className="carousel-slide">
          <img src="" />
          <div className="carousel-text">
            <h1>Cheers to <span>2025</span></h1>
            <p>Grab Ecosoul Products up to 70% Off!</p>
            <button className="shop-now">Shop Now</button>
          </div>
        </div>
        <div className="carousel-slide">
          <img src="path-to-image2.jpg"  />
          <div className="carousel-text">
            <h1>Sustainable Living</h1>
            <p>Eco-friendly products for your daily needs.</p>
            <button className="shop-now">Explore Now</button>
          </div>
        </div>
        <div className="carousel-slide">
          <img src="path-to-image3.jpg" />
          <div className="carousel-text">
            <h1>Go Green</h1>
            <p>Make a difference with sustainable choices.</p>
            <button className="shop-now">Start Saving</button>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default HeroSection;
