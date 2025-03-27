import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import logo from "../assets/images/logo.png";
import background from "../assets/images/header_bg.png";

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
      const response = await axios.post(
        `https://partydecorhub.com/api/login`,
        { email, password }
      );
      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      document.cookie = `refreshToken=${refresh}; path=/; secure; HttpOnly`;

      const authCheckResponse = await axios.get(
        "https://partydecorhub.com/api/check-auth",
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      const formattedCartItems = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      }));

      await axios.post(
        `https://partydecorhub.com/api/cart/add`,
        formattedCartItems,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch(login(authCheckResponse.data));
      toast.success("Login successful!");
      onClose();
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-[#FAF3E0] rounded-xl overflow-hidden max-w-md md:max-w-3xl w-full mx-4 md:mx-8 lg:mx-auto shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div
              className="w-full md:w-2/5 flex flex-col items-center justify-center text-center p-8 text-white"
              style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <img className="w-20 h-20 mb-4" src={logo} alt="Party Decor Hub" />
              <h2 className="text-2xl font-bold">Party Decor Hub</h2>
              <p className="text-sm max-w-xs">Bringing Your Celebration to Life, One Décor at a Time!</p>
            </div>

            <div className="w-full md:w-3/5 p-6 relative">
              <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl" onClick={onClose}>
                ×
              </button>
              <h2 className="text-lg font-semibold text-center text-gray-800">Welcome Back</h2>
              <form onSubmit={handleLogin} className="mt-4">
              <label className="block text-sm font-medium text-gray-700 text-left">Email</label>
              <input
                  type="email"
                  className="w-full p-2 border rounded"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

<label className="block text-sm font-medium text-gray-700 text-left">Password</label>
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

                <p className="text-sm text-center mt-2">
                  New to Party Decor Hub? {" "}
                  <span className="text-blue-500 cursor-pointer" onClick={onSignupClick}>
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
