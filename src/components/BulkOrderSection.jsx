
import React from "react";
import "../assets/styles/BulkOrderSection.css";
import bulk_image from "../assets/images/bulk_b.jpg";
// import { WhatsApp } from "@mui/icons-material";

import WhatsApp_icon from "../assets/images/whatsapp_icon.png";

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
        src={WhatsApp_icon}
        alt="WhatsApp Chat"
        className="whatsapp-icon"
      />
          Place Bulk Order</button>
      </div>
      <div className="bulk-order-image">
        <img
          src={bulk_image} 
          alt="Eco Soul Products"
        />
      </div>
    </div>
  );
};

export default BulkOrderSection;
