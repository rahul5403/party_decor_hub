import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const initiatePayment = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8000/phonepe/initiate-payment", {
        amount: 500, // Amount in INR
        user_id: "user123",
      });

      if (response.data.success) {
        window.location.href = response.data.data.redirectUrl; // Redirect user to PhonePe
      } else {
        setMessage("Payment initiation failed.");
      }
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.detail || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Pay with PhonePe</h2>
      <button onClick={initiatePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay ₹500"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Payment;
