
import React from "react";
import "../assets/styles/BulkOrderSection.css";
import bulk_image from "../assets/images/bulk_b.jpg";

const BulkOrderSection = () => {
  const openWatsApp =() =>{
    const phNumber = "9891411070"
    const message ="Hi! I'm interested in placing a bulk order. Can you provide more details?"
    const encodedMessage = encodeURIComponent(message)

    window.open(`https://wa.me/${phNumber}?text=${encodedMessage}`, "_blank");
  }

  return (
    <div className="bulk-order-section">
      <div className="bulk-order-content">
        <h2 className="bulk-order-heading">Massive Buys, Massive Savings</h2>
        <p className="bulk-order-subtext">Place a Bulk Order & Save Big</p>
        <button className="bulk-order-button" onClick={openWatsApp}>
        <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp Chat"
        className="whatsapp-icon"
      />
          Place Bulk Order</button>
      </div>
      <div className="bulk-order-image">
        <img
          src="https://partydecorhub.com/media/products-image/ballons1.jpg" 
          alt="Eco Soul Products"
        />
      </div>
    </div>
  );
};

export default BulkOrderSection;
