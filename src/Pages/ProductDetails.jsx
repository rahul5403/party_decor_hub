// import React, { useState, useEffect } from "react";
// import "../assets/styles/ProductDetails.css";
// import SimilarProductSection from "../components/SimilarProductSection";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../redux/cartSlice";
// import { decorationData, similarProductData } from "../data/data";
// import { Helmet } from "react-helmet-async";

// const ProductDetails = () => {
//   const dispatch = useDispatch();
//   const [quantity, setQuantity] = useState(1);
//   const product = decorationData[0] || {}; 
//   const [expandedSection, setExpandedSection] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState("");
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isAutoPlay, setIsAutoPlay] = useState(true);

//   const images = product.images || [];

//   useEffect(() => {
//     let interval;
//     if (isAutoPlay && images.length > 1) {
//       interval = setInterval(() => {
//         setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//       }, 3000);
//     }
//     return () => clearInterval(interval);
//   }, [isAutoPlay, images.length]);

//   const handleQuantityChange = (type) => {
//     setQuantity((prev) => (type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : prev));
//   };

//   const handleAddToCart = () => {
//     dispatch(addToCart({ ...product, quantity }));
//   };

//   const toggleSection = (section) => {
//     setExpandedSection(expandedSection === section ? null : section);
//   };

//   const handleAddReview = () => {
//     if (newReview.trim()) {
//       setReviews([...reviews, newReview]);
//       setNewReview("");
//     }
//   };

//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//   };

//   const goToImage = (index) => {
//     setCurrentImageIndex(index);
//   };

//   return (
//     <div className="product-details-section">
//       <Helmet>
//         <title>Party Decor Hub</title>
//         <meta name="description" content={`Buy ${product.name} at an affordable price on Party Decor Hub.`} />
//       </Helmet>
//       <div className="product-details-container">
//         <div className="product-image">
//           <img
//             src={images[currentImageIndex]}
//             alt={`Product ${currentImageIndex + 1}`}
//             className="slider-image"
//           />
//           {images.length > 1 && (
//             <div className="slider-dots">
//               {images.map((_, index) => (
//                 <div
//                   key={index}
//                   className={`custom-dot ${index === currentImageIndex ? "active" : ""}`}
//                   onClick={() => goToImage(index)}
//                 ></div>
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="product-info">
//           <h1 className="product-title">{product.name}</h1>
//           <div className="product-reviews">
//             <span className="stars">★★★★☆</span>
//             <span className="review-count">3 Reviews</span>
//           </div>
//           <div className="product-price">
//             ₹39.00 <span className="original-price">₹29.00</span>
//           </div>
//           <p className="product-description">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//           </p>
//           <div className="product-options">
//             <div className="option-box">Party</div>
//             <div className="option-box">Tag</div>
//           </div>
//           <div className="quantity-selector">
//             <button onClick={() => handleQuantityChange("decrement")}>-</button>
//             <input type="text" value={quantity} readOnly />
//             <button onClick={() => handleQuantityChange("increment")}>+</button>
//           </div>
//           <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
//         </div>
//       </div>

//       {[
//         { 
//           title: "Description", 
//           content: [
//             "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Suscipit exercitationem earum nemo quo corporis, perspiciatis ipsam dolores, dicta ut mollitia magni nesciunt odio velit libero porro. Laborum quas corrupti maxime ut ab eligendi veritatis magni! Maiores iure atque incidunt ad. Deserunt hic blanditiis nulla aliquid voluptatum, veritatis doloremque officiis incidunt corporis error. Laboriosam repellendus nihil doloremque, laudantium adipisci nam animi, id provident officia reiciendis libero asperiores dicta excepturi tempora eveniet tenetur consequatur? Deserunt voluptate officia molestias."
//           ] 
//         },
//         { 
//           title: "Reviews", 
//           content: reviews.length > 0 ? reviews : ["No reviews yet. Be the first to write a review!"]
//         }
//       ].map((section, index) => (
//         <div key={index} className="details-section">
//           <div className="section-header" onClick={() => toggleSection(index)}>
//             <h2 className="section-title">{section.title}</h2>
//             <span className="toggle-icon">{expandedSection === index ? "-" : "+"}</span>
//           </div>
//           {expandedSection === index && (
//             <ul className="details-list">
//               {section.content.map((item, i) => (
//                 <li key={i}>{item}</li>
//               ))}
//               {index === 1 && (
//                 <li className="add-review">
//                   <textarea
//                     value={newReview}
//                     onChange={(e) => setNewReview(e.target.value)}
//                     placeholder="Write your review here..."
//                   />
//                   <button onClick={handleAddReview}>Submit Review</button>
//                 </li>
//               )}
//             </ul>
//           )}
//         </div>
//       ))}

//       <SimilarProductSection products={similarProductData} section={"You might also like"} />
//     </div>
//   );
// };

// export default ProductDetails;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/styles/ProductDetails.css";
import SimilarProductSection from "../components/SimilarProductSection";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { decorationData, similarProductData } from "../data/data";
const BASE_IMAGE_URL = "https://partydecorhub.com";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://partydecorhub.com/api/products/${productId}`);
        const productData = response.data;

        const updatedProduct = {
          ...productData,
          images: productData.images.map(img => BASE_IMAGE_URL + img.image)
        };

        setProduct(updatedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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
    dispatch(addToCart({ ...product, quantity }));
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
          <div className="product-price">₹{product.price} <span className="original-price">₹{product.price + 10}</span></div>
          <p className="product-description">{product.description}</p>
          <div className="product-options">
            <div className="option-box">Color: {product.color}</div>
            <div className="option-box">Size: {product.size}</div>
          </div>
          <div className="quantity-selector">
            <button onClick={() => handleQuantityChange("decrement")}>-</button>
            <input type="text" value={quantity} readOnly />
            <button onClick={() => handleQuantityChange("increment")}>+</button>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
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

  <SimilarProductSection products={similarProductData} section={"You might also like"} />   
    </div>
  );
};

export default ProductDetails;
