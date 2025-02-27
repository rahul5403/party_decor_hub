import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import axios from "axios";
import "../assets/styles/Login2.css";

const Login2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://partydecorhub.com/api/login",
        { email, password }
      );
      console.log("Login successful:", response.data);
      toast.success("Login successful! Redirecting...");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Login failed:", error.response?.data || error.message);
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
      <div className="parent">
        <div className="login-container">
          <div className="login-left">
            <h2>Luxury & Comfort Redefined</h2>
            <p>
              Discover elegantly designed spaces, top-tier amenities, and an unforgettable stay at Party Decor Hub. Your perfect getaway starts here.
            </p>
          </div>

          <div className="login-right">
            <button className="back-btn-lg" onClick={() => navigate(-1)}>← Back</button>
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
                  New to Party Decor Hub? <a href="/signup">Create Account</a>
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
