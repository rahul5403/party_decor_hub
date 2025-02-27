import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../assets/styles/Profile.css";
import immmg from "../assets/images/Party.jpeg";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  //   const orders = useSelector((state) => state.orders.orderList);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={immmg} // User ki image ka URL
            alt="Profile"
            className="profile-image"
          />
          <h1 className="profile-name">John Doe</h1>
          <p className="profile-bio">Interior Designer | Home Decor Enthusiast</p>
        </div>
        <div className="profile-details">
          <p><strong>Email:</strong> john.doe@example.com</p>
          <p><strong>Location:</strong> Mumbai, India</p>
          <p><strong>Skills:</strong> Space Planning, Color Coordination, Furniture Selection</p>
          <p><strong>Phone no:</strong>7897898788</p>
        </div>

      </div>
    </div>
  );
};

export default Profile;
