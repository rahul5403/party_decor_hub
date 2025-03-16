import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/styles/ProductDetails.css";
import SimilarProductSection from "../components/SimilarProductSection";
import axios from "axios";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import useSetCartItems from "../hooks/useSetCartItems";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

const BASE_IMAGE_URL = "https://partydecorhub.com";

const ProductDetails = () => {
  const { product_id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const addItemToCart = useSetCartItems();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://partydecorhub.com/api/products/${product_id}`
        );
        const productData = response.data;

        const updatedProduct = {
          ...productData,
          thumbnail: BASE_IMAGE_URL + productData.thumbnail,
          images: productData.images.map((img) => ({
            original: BASE_IMAGE_URL + img.image,
            thumbnail: BASE_IMAGE_URL + img.image,
          })),
        };
        
        console.log(updatedProduct);


        setProduct(updatedProduct);
        setSelectedColor(updatedProduct.available_colors?.[0] || "");
        setSelectedSize(updatedProduct.available_sizes?.[0] || "");

        const allProductsResponse = await axios.get(
          "https://partydecorhub.com/api/products"
        );
        const filteredSimilarProducts = allProductsResponse.data
          .filter(
            (item) =>
              item.category === updatedProduct.category &&
              item.id !== updatedProduct.id
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

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : prev
    );
  };

  const handleAddToCart = () => {
    const item = [{
      id: product_id, 
      product_id,
      quantity,
      color: selectedColor,
      size: selectedSize,
      price: product.price,
      name: product.name,
      thumbnail: product.thumbnail,
      images: product.images
    }];


    if (!accessToken) {
      dispatch(addToCart(item[0])); 
    } else {
      addItemToCart(item); 
    }
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
      <div className="product-details-container">
        <div className="image-gallery">
          <ImageGallery
            items={product.images}
            showPlayButton={false}
            showFullscreenButton={true}
            showThumbnails={true}
            autoPlay={false}
          />
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-reviews">
            <span className="stars">★★★★☆</span>
            <span className="review-count">{reviews.length} Reviews</span>
          </div>
          <div className="product-price">
            {product.discounted_price ? (
              <>
                <span className="discounted-price">
                  ₹{product.discounted_price}
                </span>
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
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                {product.available_colors?.map((color, index) => (
                  <option key={index} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="option-dropdown">
              <label>Size:</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {product.available_sizes?.map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="quantity-selector">
            <button onClick={() => handleQuantityChange("decrement")}>-</button>
            <input type="text" value={quantity} readOnly />
            <button onClick={() => handleQuantityChange("increment")}>+</button>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
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
            <span className="toggle-icon">
              {expandedSection === index ? "-" : "+"}
            </span>
          </div>
          {expandedSection === index && (
            <ul className="details-list">
              {section === "Reviews" ? (
                reviews.length > 0 ? (
                  reviews.map((review, i) => <li key={i}>{review}</li>)
                ) : (
                  <li>No reviews yet.</li>
                )
              ) : (
                <li>{product.description}</li>
              )}
            </ul>
          )}
        </div>
      ))}

      <SimilarProductSection
        products={similarProducts}
        section={"You might also like"}
      />
    </div>
  );
};

export default ProductDetails;