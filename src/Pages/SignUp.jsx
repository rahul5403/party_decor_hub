import React, { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import useSignUp from "../hooks/Auth/useSignUp"; 
import logo from "../assets/images/logo.png";
import background from "../assets/images/header_bg.png";

const SignUp = ({ onClose, onLoginClick }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signUp, loading } = useSignUp();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { success } = await signUp({ username, email, password, confirmPassword });
    if (success) {
      setTimeout(() => {
        onClose();
        onLoginClick();
      }, 1000);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-[#FAF3E0] rounded-xl overflow-hidden max-w-md md:max-w-3xl w-full mx-4 md:mx-8 lg:mx-auto shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 flex flex-col items-center justify-center text-center p-8 text-white"
              style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}>
              <img className="w-20 h-20 mb-4" src={logo} alt="Party Decor Hub" />
              <h2 className="text-2xl font-bold">Party Decor Hub</h2>
              <p className="text-sm max-w-xs">Bringing Your Celebration to Life, One Décor at a Time!</p>
            </div>

            <div className="w-full md:w-3/5 p-6 relative">
              <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl" onClick={onClose}>×</button>
              <h2 className="text-lg font-semibold text-center text-gray-800">Welcome to Party Decor Hub</h2>
              <form onSubmit={handleSignup} className="mt-4">
                <label className="block text-sm font-medium text-gray-700 text-left">Username</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />

                <label className="block mt-2 text-sm font-medium text-gray-700 text-left">Email</label>
                <input type="email" className="w-full p-2 border rounded" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label className="block mt-2 text-sm font-medium text-gray-700 text-left">Password</label>
                <input type="password" className="w-full p-2 border rounded" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <label className="block mt-2 text-sm font-medium text-gray-700 text-left">Confirm Password</label>
                <input type="password" className="w-full p-2 border rounded" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                <button type="submit" className="mt-4 w-full bg-green-900 text-white py-2 rounded hover:bg-green-800" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>

                <p className="text-sm text-center mt-2">
                  Already have an account? <span className="text-blue-500 cursor-pointer" onClick={onLoginClick}>Login here</span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUp;