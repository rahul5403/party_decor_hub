import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/Profile.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      try {
        const authCheckResponse = await axios.get(
          "https://partydecorhub.com/api/check-auth",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (authCheckResponse.data.is_logged_in) {
          const profileResponse = await axios.get(
            "https://partydecorhub.com/api/profile",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          const userProfile = profileResponse.data;
          const defaultAddress = {
            line1: "",
            line2: "",
            city: "",
            state: "",
            pincode: "",
          };

          setProfile({
            ...userProfile,
            address: userProfile.address || defaultAddress,
          });

          setFormData({
            ...userProfile,
            address: userProfile.address || defaultAddress,
          });
        } else {
          setError("User is not logged in");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("No access token found");
      return;
    }

    try {
      await axios.put("https://partydecorhub.com/api/profile", formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setProfile(formData);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const getInitials = (name) => {
    return name ? name.slice(0, 2).toUpperCase() : "";
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="profile-container">
      <h1 className="heading-profile-page">Profile Page</h1>
      {!editMode ? (
        <div className="profile-details">
          <div className="profile-picture">{getInitials(profile.username)}</div>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Phone:</strong> {profile.phone || "N/A"}
          </p>
          <div className="address-row">
            <p className="address-label">
              <strong>Address:</strong></p>
            
            <span className="address-content">
              {Object.values(profile.address).some((value) => value) // ✅ Koi bhi field filled hai?
                ? [
                    profile.address.line1,
                    profile.address.line2,
                    profile.address.city,
                    profile.address.state,
                    profile.address.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") 
                : "N/A"}{" "}
            </span>
            
          </div>

          <button
            className="edit-button-profile-page"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </label>
          <label className="address-pp">Address:</label>
          <div className="address-row address-form">
            <label>
              Line 1:
              <input
                type="text"
                name="address.line1"
                value={formData.address.line1}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Line 2:
              <input
                type="text"
                name="address.line2"
                value={formData.address.line2}
                onChange={handleInputChange}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Pincode:
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <button className="save-btn-profile-page" type="submit">
            Save Changes
          </button>
          <button
            className="cancel-btn-profile-page"
            type="button"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
