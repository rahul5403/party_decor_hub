import React, { useState } from "react";
import "../assets/styles/ProductDetails.css";
import SimilarProductSection from "../components/SimilarProductSection";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { decorationData, similarProductData } from "../data/data";
import { Helmet } from "react-helmet-async";
import igg from "../assets/images/party_c_re.jpg";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const product = decorationData[0];
  const [activeTab, setActiveTab] = useState("description");

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : prev));
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  return (
    <div className="product-details-section">
      <Helmet>
        <title>Party Decor Hub</title>
        <meta name="description" content={`Buy ${product.name} at an affordable price on Party Decor Hub.`} />
      </Helmet>
      <div className="product-details-container">
        <div className="product-image">
          <img src={igg} alt="Product" />
        </div>
        <div className="product-info">
          {/* <h1 className="product-title">{product.name}</h1> */}
          <h1 className="product-title">Ballons</h1>

          <div className="product-reviews">
            <span className="stars">★★★★☆</span>
            <span className="review-count">3 Reviews</span>
          </div>
          <div className="product-price">
            ₹39.00 <span className="original-price">₹29.00</span>
          </div>
          <p className="product-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="product-options">
            <div className="option-box">Party</div>
            <div className="option-box">Tag</div>
          </div>
          <div className="quantity-selector">
            <button onClick={() => handleQuantityChange("decrement")}>-</button>
            <input type="text" value={quantity} readOnly />
            <button onClick={() => handleQuantityChange("increment")}>+</button>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
      <div className="product-tabs">
        <div className="tabs">
          <button className={`tab ${activeTab === "description" ? "active" : ""}`} onClick={() => setActiveTab("description")}>
            Description
          </button>
          <button className={`tab ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>
            Reviews (0)
          </button>
        </div>
        <div className="tab-content">
          {activeTab === "description" ? (
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Suscipit exercitationem earum nemo quo corporis, perspiciatis ipsam dolores, dicta ut mollitia magni nesciunt odio velit libero porro. Laborum quas corrupti maxime ut ab eligendi veritatis magni! Maiores iure atque incidunt ad. Deserunt hic blanditiis nulla aliquid voluptatum, veritatis doloremque officiis incidunt corporis error. Laboriosam repellendus nihil doloremque, laudantium adipisci nam animi, id provident officia reiciendis libero asperiores dicta excepturi tempora eveniet tenetur consequatur? Deserunt voluptate officia molestias autem, ipsam odio nihil exercitationem suscipit sapiente ad esse. Consequatur unde odit ullam quia id quam, hic expedita ipsa provident repellendus quidem in distinctio optio iure magnam earum at voluptatem consequuntur soluta vitae, ipsum accusamus qui mollitia a? Officiis optio rem ullam odit molestias animi quam quaerat fugit reiciendis totam sit illum quisquam sint voluptate esse iusto expedita dolor reprehenderit recusandae, nulla doloremque. Incidunt cum reiciendis repudiandae officia non quasi cumque facilis aliquid expedita.</p>
          ) : (
            <p>No reviews yet. Be the first to write a review!</p>
          )}
        </div>
      </div>
      <SimilarProductSection products={similarProductData} section={"You might also like"} />
    </div>
  );
};

export default ProductDetails;