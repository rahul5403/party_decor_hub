import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useSignUp = () => {
  const [loading, setLoading] = useState(false);

  const signUp = async ({ username, email, password, confirmPassword }) => {
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return { success: false };
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return { success: false };
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return { success: false };
    }

    setLoading(true);

    try {
      await axios.post("https://partydecorhub.com/api/signup", {
        username,
        email,
        password,
      });

      toast.success("Signup successful! Redirecting to login...");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading };
};

export default useSignUp;