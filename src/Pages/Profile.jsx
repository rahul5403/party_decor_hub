import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import "../assets/styles/Profile.css";
import immmg from "../assets/images/Party.jpeg";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile Data:", formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={immmg} alt="Profile" className="profile-image" />
          <h1 className="profile-name">{user?.username || "John Doe"}</h1>
          <Button onClick={handleEditClick}>{isEditing ? "Cancel" : "Edit Profile"}</Button>
        </div>
        <div className="profile-details">
          {isEditing ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} />
              </Form.Group>
              <Button type="submit">Save Changes</Button>
            </Form>
          ) : (
            <>
              <p><strong>Email:</strong> {user?.email || "john.doe@example.com"}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;