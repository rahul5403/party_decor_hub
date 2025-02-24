import React from "react";
import Slider from "react-slick";
import "../assets/styles/HomeProductSection.css"
import ProductCard from "./ProductCard";

const HomeProductSection = ({ products, section }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    // <div className="decoration-section">
    //   <h2 className="decoration-title">{section}</h2>
    //   <Slider {...settings}>
    //     {products.map((product) => (
    //       <ProductCard key={product.id} product={product} />
    //     ))}
    //   </Slider>
    // </div>

    <div className="decoration-section">
    <h2 className="decoration-title">{section}</h2>
    <div className="decoration-scroll">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);
};

export default HomeProductSection;
