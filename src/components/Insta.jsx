import React from "react";
import "../assets/styles/Insta.css"; 
import { useLocation } from "react-router-dom";
import Instagram_icon from "../assets/images/instagram_icon.png";

const InstagramButton = () => {
  const location = useLocation();
  const specialPages = ["/party", "/decoration", "/disposable"];
  const isSpecialPage = specialPages.includes(location.pathname);

  const openInstagram = () => {
    const instagramUsername = "yourcompanyusername"; // Replace with actual Instagram username
    window.open(`https://www.instagram.com/partydecorhub?utm_source=qr&igsh=cGpreXh0bzM3Z3Nt`, "_blank");
  };

  return (
    <button className={`instagram-button ${isSpecialPage ? "special-page" : ""}`} onClick={openInstagram}>
      <img
        src={Instagram_icon}
        alt="Instagram Profile"
      />
      Follow Us
    </button>
  );
};

export default InstagramButton;