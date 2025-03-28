import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { login } from "../redux/authSlice";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleLogin = async (email, password, onClose) => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://partydecorhub.com/api/login`,
        null,
        {
          params: { email, password },
        }
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

  return { loading, handleLogin };
};