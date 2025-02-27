import React from "react";
import "../assets/styles/WhatsAppButton.css"; 
import { useLocation } from "react-router-dom";

const WhatsAppButton = () => {
  const location = useLocation();
  const specialPages = ["/party", "/decoration", "/disposable"];
  const isSpecialPage = specialPages.includes(location.pathname);

  const openWhatsApp = () => {
    const phNumber = "9891411070"; 
    const message = "Hello! I'd like to know more about your services. Can you share more details?"; 
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <button className={`whatsapp-button ${isSpecialPage ? "special-page" : ""}`} onClick={openWhatsApp}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp Chat"
      />
      Chat with Us
    </button>
  );
};

export default WhatsAppButton;
