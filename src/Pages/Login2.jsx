import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "../assets/styles/Login2.css";

const Login2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in:", { email, password });
    // navigate("/home");
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google Token:", credentialResponse.credential);
    // Send this token to your backend for verification
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId="74027685761-uao4u2m2ibpo6j5t2ate76ebf6e1knur.apps.googleusercontent.com">
      <div className="parent">
        <div className="login-container">
          {/* Left Section - Image & Text */}
          <div className="login-left">
            <h2>Luxury & Comfort Redefined</h2>
            <p>
              Discover elegantly designed spaces, top-tier amenities, and an unforgettable stay at Decor Hub. Your perfect getaway starts here.
            </p>
          </div>

          {/* Right Section - Login Form */}
          <div className="login-right">
            <div>
              <h3 className="wlcm">Welcome to Decor Hub</h3>
            </div>

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

                <div className="forgot-password">Forgot password?</div>

                <button type="submit" className="login-btn">Sign in</button>

                <div className="divider">or</div>

                <div className="google-login-container">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                  />
                </div>

                <p className="signup-link">
                  New to Decor Hub? <a href="/signup">Create Account</a>
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
