import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import "../assets/styles/SignUp2.css";
import axios from "axios";

const SignUp2 = ({ onClose, onLoginClick }) => { // Accept onLoginClick prop
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const userData = { username, email, password };
    try {
      const response = await axios.post(
        "https://partydecorhub.com/api/signup",
        userData
      );
      console.log("Signup successful:", response.data);
      toast.success("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      console.error("Signup failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google Token:", credentialResponse.credential);
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="overlay-s">
        <div className="signup-popup">
          <div className="signup-left">
            <h2>Luxury & Comfort Redefined</h2>
            <p>
              Discover elegantly designed spaces, top-tier amenities, and an
              unforgettable stay at Party Decor Hub. Your perfect getaway starts
              here.
            </p>
          </div>

          <div className="signup-right">
            <button className="close-btn" onClick={onClose}>×</button> {/* Close button */}
            <h2 className="wlcm">Welcome to Party Decor Hub</h2>
            <div className="form-container">
              <form onSubmit={handleSignup}>
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

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

                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button type="submit" className="signup-btn" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>

                <div className="divider">or</div>
                <div className="google-login-container">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                  />
                </div>

                <p className="signup-link">
                  Already have an account?{" "}
                  <span
                    className="login-link"
                    onClick={onLoginClick} // Trigger Login modal
                  >
                    Login here
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

export default SignUp2;