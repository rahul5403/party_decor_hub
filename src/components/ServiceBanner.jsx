import React from "react";
import Slider from "react-slick";
import "../assets/styles/HeroSection.css";

const ServiceBanner = () => {
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
                    <img src="https://placehold.co/600x300" />

                </div>
                <div className="carousel-slide">
                    <img src="https://placehold.co/600x300" />

                </div>
                <div className="carousel-slide">
                    <img src="https://placehold.co/600x300" />
                </div>
            </Slider>
        </div>
    );
};

export default ServiceBanner;
