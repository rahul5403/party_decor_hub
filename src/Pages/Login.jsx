
import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useLogin } from "../hooks/auth/useLogin.js";
import logo from "../assets/images/logo.png";
import background from "../assets/images/header_bg.png";
import axios from "axios";
import { login } from "../redux/authSlice.js";
import { useDispatch } from "react-redux";

const Login = ({ onClose, onSignupClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, handleLogin } = useLogin();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email, password, onClose);
  };

const handleGoogleSuccess = async (credentialResponse) => {
  const id_token = credentialResponse.credential;
  try {
    console.log("Google ID Token:", id_token); // Debugging line
    
    // First, authenticate with Google
    const res = await axios.post(
      "https://partydecorhub.com/api/google-auth",
      { token: id_token },
      { withCredentials: true } // So refresh cookie is stored
    );
    
    const accessToken = res.data.access;
    // Store accessToken in localStorage
    localStorage.setItem("accessToken", accessToken);
    
    // Now call the check-auth API to get user data
    const checkAuthRes = await axios.get(
      "https://partydecorhub.com/api/check-auth",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    
    // Get user data from the response
    const userData = checkAuthRes.data;
    
    // Dispatch login action with user data
    dispatch(login(userData));
    
    onClose(); // Close the modal on success
  } catch (err) {
    console.error("Google Login Error", err);
    alert("Google login failed.");
  }
};

const handleGoogleFailure = () => {
  alert("Google login was unsuccessful. Try again.");
};

  return (
    <GoogleOAuthProvider clientId="74027685761-uao4u2m2ibpo6j5t2ate76ebf6e1knur.apps.googleusercontent.com">
      <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-[#FAF3E0] rounded-xl overflow-hidden max-w-md md:max-w-3xl w-full mx-4 md:mx-8 lg:mx-auto shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div
              className="w-full md:w-2/5 flex flex-col items-center justify-center text-center p-8 text-white"
              style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <img
                className="w-20 h-20 mb-4"
                src={logo}
                alt="Party Decor Hub"
              />
              <h2 className="text-2xl font-bold">Party Decor Hub</h2>
              <p className="text-sm max-w-xs">
                Bringing Your Celebration to Life, One Décor at a Time!
              </p>
            </div>

            <div className="w-full md:w-3/5 p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
                onClick={onClose}
              >
                ×
              </button>
              <h2 className="text-lg font-semibold text-center text-gray-800">
                Welcome Back
              </h2>
              <form onSubmit={handleSubmit} className="mt-4">
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label className="block text-sm font-medium text-gray-700 text-left mt-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full p-2 border rounded"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="mt-4 w-full bg-green-900 text-white py-2 rounded hover:bg-green-800"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Sign In"}
                </button>

                <div className="mb-0 ">or</div>
              </form>
                
              {/* 🔐 Google Login Button */}
             
              <div className="mt-2 text-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  width="100%"
                />
              </div>

              <p className="text-sm text-center mt-2">
                New to Party Decor Hub?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={onSignupClick}
                >
                  Create Account
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
