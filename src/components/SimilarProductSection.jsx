import React from "react";
import Slider from "react-slick";
// import "../assets/styles/HomeProductSection.css"
import ProductCard from "./ProductCard";
import "../assets/styles/SimilarProductSection.css";

const SimilarProductSection = ({ products, section }) => {
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
    <div className="decoration-section-similar">
      <h2 className="decoration-title-similar">{section}</h2>
      <Slider {...settings}>
      {products.map((product) => (
      <ProductCard key={product.product_id || product.id} product={product} />
    ))}
      </Slider>
    </div>
  );
};

export default SimilarProductSection;
