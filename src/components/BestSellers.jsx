import React from "react";
import "../assets/styles/BestSeller.css";

const products = [
  {
    id: 1,
    image: "https://placehold.co/150x200", // Replace with actual image URL
    title: "12 Inch Round Disposable Areca Palm Leaf Plates",
    oldPrice: "Rs. 999.00",
    newPrice: "Rs. 549.00",
    rating: 4,
  },
  {
    id: 2,
    image: "https://placehold.co/150x200", // Replace with actual image URL
    title: "10 Inch Round Disposable Bagasse Plates",
    oldPrice: "Rs. 599.00",
    newPrice: "Rs. 299.00",
    rating: 5,
  },
  {
    id: 3,
    image: "https://placehold.co/150x200", // Replace with actual image URL
    title: "10 Inch Square Disposable Areca Palm Leaf Plates",
    oldPrice: "Rs. 899.00",
    newPrice: "Rs. 499.00",
    rating: 4,
  },
  {
    id: 4,
    image: "https://placehold.co/150x200", // Replace with actual image URL
    title: "6 Inch Square Disposable Bagasse Plates",
    oldPrice: "Rs. 499.00",
    newPrice: "Rs. 299.00",
    rating: 3,
  },
];

const BestSeller = () => {
  return (
    <div className="best-seller">
      <h2 className="best-seller-title">Best Seller</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.title} className="product-image" />
            <h3 className="product-title">{product.title}</h3>
            <div className="product-rating">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <span key={index} className={index < product.rating ? "star filled" : "star"}>
                    ★
                  </span>
                ))}
            </div>
            <div className="product-prices">
              <span className="old-price">{product.oldPrice}</span>
              <span className="new-price">{product.newPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
