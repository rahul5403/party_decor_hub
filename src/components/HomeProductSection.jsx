import React, { useEffect, useRef } from "react";
import "../assets/styles/HomeProductSection.css";
import ProductCard from "./ProductCard";
import LazyLoadHorizontalItem from "../components/LazyLoadComponent";

const HomeProductSection = ({ products, section, isLoading, onScrollEnd }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 50;
        
        if (isAtEnd) {
          onScrollEnd?.();
        }
      }
    };

    const currentRef = scrollRef.current;
    currentRef?.addEventListener('scroll', handleScroll);

    return () => {
      currentRef?.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollEnd]);

  return (
    <div className="decoration-section">
      <h2 className="decoration-title">{section}</h2>
      <div className="decoration-scroll" ref={scrollRef}>
        {isLoading ? (
          [...Array(5)].map((_, index) => (
            <div key={index} className="product-card-skeleton">
              <div className="skeleton-image" />
              <div className="skeleton-text" />
              <div className="skeleton-text" />
            </div>
          ))
        ) : (
          products.map((product) => (
            <LazyLoadHorizontalItem key={product.id}>
              <ProductCard product={product} section={section} />
            </LazyLoadHorizontalItem>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeProductSection;