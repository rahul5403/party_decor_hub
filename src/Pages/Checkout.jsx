import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", country: "", postalCode: "",
  });

  const shippingCost = 19;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCost = subtotal + shippingCost;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/order-confirmation");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-center text-gray-800 mb-6">Checkout</h1>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 bg-white border rounded-lg p-4 space-y-3">
          <h4 className="text-md font-semibold mb-1">Shipping Information</h4>
          <div className="grid grid-cols-1 gap-3">
            <input name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="input input-sm" />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="input input-sm" />
            <input name="phone" type="text" placeholder="Phone" value={formData.phone} onChange={handleChange} required className="input input-sm" />
            <input name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} required className="input input-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} required className="input input-sm" />
              <input name="country" type="text" placeholder="Country" value={formData.country} onChange={handleChange} required className="input input-sm" />
            </div>
            <input name="postalCode" type="text" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} required className="input input-sm" />
          </div>
          <button type="button" onClick={() => navigate(-1)} className="text-xs text-green-600 hover:underline mt-1">← Return to Cart</button>
        </form>

        {/* Order Summary */}
        <div className="w-full md:w-1/2 bg-white border rounded-lg p-4">
          <h4 className="text-md font-semibold mb-3">Order Summary</h4>
          <div className="max-h-60 overflow-y-auto space-y-2 mb-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 pb-2 border-b">
                <img src={item.thumbnail} alt={item.name} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 truncate">{item.name || item.product_name}</h3>
                  <div className="flex items-center text-xs mt-0.5">
                    <span className="text-green-600 font-semibold">₹{item.price.toFixed(2)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="ml-1.5 text-gray-400 line-through">₹{item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 text-sm text-gray-700 mb-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-sm border-t pt-1.5 mt-1.5">
              <span>Total</span>
              <span>₹{totalCost.toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-gray-100 p-2 rounded text-xs text-gray-600 flex items-center gap-1.5 mb-3">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            All transactions are secure and encrypted.
          </div>
          <button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold transition duration-200">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;