import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import "../assets/styles/Profile.css";
import immmg from "../assets/images/Party.jpeg";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    address_line1: user?.address_line1 || "",
    address_line2: user?.address_line2 || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
  });

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the user's profile
    console.log("Updated Profile Data:", formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={immmg} alt="Profile" className="profile-image" />
          <h1 className="profile-name">{user?.username ||formData.username || "John Doe"}</h1>
          <Button onClick={handleEditClick} className="edit-button">
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
        <div className="profile-details">
          {isEditing ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formAddressLine1">
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formAddressLine2">
                <Form.Label>Address Line 2</Form.Label>
                <Form.Control
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formPincode">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button type="submit" className="save-button">
                Save Changes
              </Button>
            </Form>
          ) : (
            <>
              <p><strong>Email:</strong> {user?.email || "john.doe@example.com"}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Address:</strong> {formData.address_line1}, {formData.address_line2}</p>
              <p><strong>City:</strong> {formData.city}</p>
              <p><strong>State:</strong> {formData.state}</p>
              <p><strong>Pincode:</strong> {formData.pincode}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;