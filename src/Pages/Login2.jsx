import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import "../assets/styles/Login2.css";

const Login2 = ({ onClose, onSignupClick }) => { // Accept onSignupClick prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://partydecorhub.com/api/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );
      dispatch(login(response.data));

      toast.success("Login successful! Redirecting...");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid email or password");
      console.error("Login failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google Token:", credentialResponse.credential);
    toast.success("Google Login Successful!");
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
    toast.error("Google Login Failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="overlay-s">
        <div className="login-popup">
          <div className="login-left">
            <h2>Luxury & Comfort Redefined</h2>
            <p>
              Discover elegantly designed spaces, top-tier amenities, and an
              unforgettable stay at Party Decor Hub. Your perfect getaway starts
              here.
            </p>
          </div>

          <div className="login-right">
            <button className="close-btn" onClick={onClose}>×</button> {/* Close button */}
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

                <div className="divider">or</div>

                <div className="google-login-container">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                  />
                </div>

                <p className="signup-link">
                  New to Party Decor Hub?{" "}
                  <span
                    className="signup-link-text"
                    onClick={onSignupClick} // Trigger Sign Up modal
                  >
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