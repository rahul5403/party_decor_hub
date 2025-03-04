import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "../assets/styles/HeroSection.css";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get("https://partydecorhub.com/api/carousel");
        const formattedSlides = response.data.map((slide) => ({
          ...slide,
          image: `https://partydecorhub.com/media/${slide.image}`,
        }));
        console.log("Formatted Slides:", formattedSlides); // Debugging
        setSlides(formattedSlides);
      } catch (error) {
        console.error("Error fetching carousel data:", error);
      }
    };

    fetchSlides();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: (dots) => <ul className="custom-dots">{dots}</ul>,
    customPaging: () => <div className="custom-dot"></div>,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div
            key={slide.id}
            onClick={() => navigate(`/${slide.text.toLowerCase().replace(/\s+/g, "-")}`)}
            className="carousel-slide"
          >
            <img
              src={slide.image}
              alt={slide.text}
              className="carousel-image"
            />
            <div className="overlay"></div>
            <div className="carousel-text">
              <h1>{slide.text}</h1>
              <p>{slide.subtext}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;