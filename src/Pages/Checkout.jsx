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
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 mb-8 relative inline-block">
  Checkout
  <span className="block w-16 h-1 bg-green-500 mx-auto mt-2 rounded-full"></span>
</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-[45%] bg-white border rounded-lg p-6 space-y-4 shadow-sm">
          <h4 className="text-lg font-semibold mb-2">Shipping Information</h4>
          <div className="grid grid-cols-1 gap-4">
            <input name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="input input-bordered input-sm w-full" />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="input input-bordered input-sm w-full" />
            <input name="phone" type="text" placeholder="Phone" value={formData.phone} onChange={handleChange} required className="input input-bordered input-sm w-full" />
            <input name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} required className="input input-bordered input-sm w-full" />
            <div className="grid grid-cols-2 gap-4">
              <input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} required className="input input-bordered input-sm w-full" />
              <input name="country" type="text" placeholder="Country" value={formData.country} onChange={handleChange} required className="input input-bordered input-sm w-full" />
            </div>
            <input name="postalCode" type="text" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} required className="input input-bordered input-sm w-full" />
          </div>
          <button type="button" onClick={() => navigate(-1)} className="text-sm text-green-600 hover:underline mt-2">← Return to Cart</button>
        </form>

        {/* Order Summary */}
        <div className="w-full md:w-[55%] bg-white border rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
          <div className="max-h-72 overflow-y-auto space-y-4 mb-4 pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-3">
                <img src={item.thumbnail} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                <div className="flex justify-between w-full">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{item.name || item.product_name}</h3>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">₹{item.price.toFixed(2)}</p>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <p className="text-xs text-gray-400 line-through">₹{item.originalPrice.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>₹{totalCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Secure Note + Pay */}
          <div className="bg-gray-100 p-3 rounded text-xs text-gray-600 flex items-center gap-2 mb-4">
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
