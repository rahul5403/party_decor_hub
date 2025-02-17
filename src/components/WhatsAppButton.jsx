import React from "react";
import "../assets/styles/WhatsAppButton.css"; // Import the CSS file

const WhatsAppButton = () => {
  const openWhatsApp = () => {
    const phNumber = "9891411070"; // Replace with your WhatsApp number
    const message = "Hello! I'd like to know more about your services. Can you share more details?"; // Customize your message
    const encodedMessage = encodeURIComponent(message);

    window.open(`https://wa.me/${phNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <button className="whatsapp-button" onClick={openWhatsApp}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp Chat"
      />
      Chat with Us
    </button>
  );
};

export default WhatsAppButton;
