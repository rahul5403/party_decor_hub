import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/styles/ProductDetails.css";
import SimilarProductSection from "../components/SimilarProductSection";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const BASE_IMAGE_URL = "https://partydecorhub.com";

const ProductDetails = () => {
  const { product_id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://partydecorhub.com/api/products/${product_id}`);
        const productData = response.data;

        const updatedProduct = {
          ...productData,
          images: productData.images.map((img) => BASE_IMAGE_URL + img.image),
        };

        setProduct(updatedProduct);
        setSelectedColor(updatedProduct.available_colors?.[0] || "");
        setSelectedSize(updatedProduct.available_sizes?.[0] || "");

        // Fetch similar products based on category
        const allProductsResponse = await axios.get("https://partydecorhub.com/api/products");
        const filteredSimilarProducts = allProductsResponse.data
          .filter(
            (item) => item.category === updatedProduct.category && item.id !== updatedProduct.id
          )
          .map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.category,
            image: BASE_IMAGE_URL + item.thumbnail,
            images: [BASE_IMAGE_URL + item.thumbnail],
          }));

        setSimilarProducts(filteredSimilarProducts);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product_id]);

  useEffect(() => {
    let interval;
    if (isAutoPlay && product?.images?.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, product]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : prev));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity, selectedColor, selectedSize }));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAddReview = () => {
    if (newReview.trim()) {
      setReviews([...reviews, newReview]);
      setNewReview("");
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (!product) return <h2>Product not found</h2>;

  return (
    <div className="product-details-section">
      <Helmet>
        <title>{product.name} - Party Decor Hub</title>
        <meta name="description" content={`Buy ${product.name} at an affordable price.`} />
      </Helmet>
      <div className="product-details-container">
        <div className="product-image">
          <img src={product.images[currentImageIndex]} alt={product.name} className="slider-image" />
          {product.images.length > 1 && (
            <div className="slider-dots">
              {product.images.map((_, index) => (
                <div
                  key={index}
                  className={`custom-dot ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                ></div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-reviews">
            <span className="stars">★★★★☆</span>
            <span className="review-count">{reviews.length} Reviews</span>
          </div>
          <div className="product-price">
            {/* Display discounted price if available */}
            {product.discounted_price ? (
              <>
                <span className="discounted-price">₹{product.discounted_price}</span>
                <span className="original-price">₹{product.price}</span>
              </>
            ) : (
              <span>₹{product.price}</span>
            )}
          </div>
          <p className="product-description">{product.description}</p>
          <div className="product-options">
            <div className="option-dropdown">
              <label>Color:</label>
              <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                {product.available_colors?.map((color, index) => (
                  <option key={index} value={color}>{color}</option>
                ))}
              </select>
            </div>
            <div className="option-dropdown">
              <label>Size:</label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                {product.available_sizes?.map((size, index) => (
                  <option key={index} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="quantity-selector">
            <button onClick={() => handleQuantityChange("decrement")}>-</button>
            <input type="text" value={quantity} readOnly />
            <button onClick={() => handleQuantityChange("increment")}>+</button>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
          <div className="features">
            <div className="feature-box">✔ Quality Products</div>
            <div className="feature-box">⭐ 4.9/5 Google Ratings</div>
            <div className="feature-box">📞 24/7 Customer Support</div>
            <div className="feature-box">💳 Secure Payment</div>
          </div>
        </div>
      </div>

      {["Description", "Reviews"].map((section, index) => (
        <div key={index} className="details-section">
          <div className="section-header" onClick={() => toggleSection(index)}>
            <h2 className="section-title">{section}</h2>
            <span className="toggle-icon">{expandedSection === index ? "-" : "+"}</span>
          </div>
          {expandedSection === index && (
            <ul className="details-list">
              {section === "Reviews" ? (
                reviews.length > 0 ? reviews.map((review, i) => <li key={i}>{review}</li>) : <li>No reviews yet.</li>
              ) : (
                <li>{product.description}</li>
              )}
              {section === "Reviews" && (
                <li className="add-review">
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Write your review here..."
                  />
                  <button onClick={handleAddReview}>Submit Review</button>
                </li>
              )}
            </ul>
          )}
        </div>
      ))}

      <SimilarProductSection products={similarProducts} section={"You might also like"} />
    </div>
  );
};

export default ProductDetails;