import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import toast from "react-hot-toast";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import "../assets/styles/Login2.css";
import logo from "../assets/images/logo.png";
import useSetCartItems from "../hooks/useSetCartItems";

const Login2 = ({ onClose, onSignupClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Send login request

      const response = await axios.post(
        `https://partydecorhub.com/api/login?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`
      );

      console.log("Login Response:", response.data);

      const { access, refresh } = response.data;

      // Store tokens
      localStorage.setItem("accessToken", access);
      document.cookie = `refreshToken=${refresh}; path=/; secure; HttpOnly`;

      // Step 2: Verify authentication and fetch user details
      const storedAccessToken = localStorage.getItem("accessToken");

      if (!storedAccessToken) {
        console.error("Access token not found in localStorage");
        return;
      }

      const authCheckResponse = await axios.get(
        "https://partydecorhub.com/api/check-auth",
        {
          headers: { Authorization: `Bearer ${storedAccessToken.trim()}` }, // Trim space
        }
      );

      for (let i = 0; i < cartItems.length; i++) {
        try {
          const item = cartItems[i];
          const response = await axios.post(
            `https://partydecorhub.com/api/cart/add`,
            {
              product_id: item.product_id,
              quantity: item.quantity,
            },
            {
              headers: {
                Authorization: `Bearer ${storedAccessToken.trim()}`,
              },
            }
          );
          console.log(`Cart item ${item.product_id} added successfully`, response.data);
        } catch (error) {
          console.error(`Failed to add item ${cartItems[i].product_id} to cart`, error.response?.data || error.message);
          toast.error(`Error adding item ${cartItems[i].product_id} to cart`);
        }
      }
      

      console.log("Auth Check Response:", authCheckResponse.data);
      dispatch(login(authCheckResponse.data));
      toast.success("Login successful!");

      onClose();
      navigate("/home");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("User not found. Please check your email.");
        } else if (error.response.status === 401) {
          toast.error("Incorrect password. Please try again.");
        } else {
          toast.error(
            error.response.data?.error ||
              "Something went wrong. Please try again."
          );
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
      console.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google Token:", credentialResponse.credential);
    toast.success("Google Login Successful!");
    onClose();
  };

  const handleGoogleFailure = (error) => {
    toast.error("Google Login Failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="overlay-s">
        <div className="login-popup">
          <div className="login-left">
            <img className="logo-img-l" src={logo} alt="Party Decor Hub" />
            <h2>Party Decor Hub</h2>
            <p>Bringing Your Celebration to Life, One Décor at a Time!</p>
          </div>

          <div className="login-right">
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
            <h2 className="wlcm">Welcome to Party Decor Hub</h2>
            <div className="form-container">
              <form onSubmit={handleLogin}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Logging in..." : "Sign in"}
                </button>

                {/* <div className="divider">or</div>

                <div className="google-login-container">
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
                </div> */}

                <p className="signup-link">
                  New to Party Decor Hub?{" "}
                  <span className="signup-link-text" onClick={onSignupClick}>
                    Create Account
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login2;
