import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [formData, setFormData] = useState({
    fullName: "", 
    email: "", 
    phone: "", 
    address: "", 
    city: "", 
    country: "", 
    postalCode: "",
  });
  
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [isFormComplete, setIsFormComplete] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Calculate shipping cost based on delivery method and subtotal
  const getShippingCost = () => {
    if (deliveryMethod === "express") {
      return 100; // Express delivery is always ₹100
    } else {
      // Standard delivery is free for orders above ₹500, otherwise ₹70
      return subtotal > 500 ? 0 : 70;
    }
  };
  
  const shippingCost = getShippingCost();
  const totalCost = subtotal + shippingCost;

  // Check if form is complete
  useEffect(() => {
    const isComplete = Object.values(formData).every(value => value.trim() !== "");
    setIsFormComplete(isComplete);
  }, [formData]);

  // Update shipping cost when delivery method or subtotal changes
  useEffect(() => {
    // This will re-calculate the shipping cost when delivery method changes
  }, [deliveryMethod, subtotal]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeliveryChange = (method) => {
    setDeliveryMethod(method);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/order-confirmation");
  };

  return (
    <div className="max-w-6xl mx-auto px-2 py-2 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 mb-6 relative inline-block">
        Checkout
        <span className="block w-16 h-1 bg-green-500 mx-auto mt-2 rounded-full"></span>
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-[45%] bg-white border rounded-lg p-6 space-y-4 shadow-md transition-all duration-300 hover:shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-green-700 border-b border-green-200 pb-2">Shipping Information</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
              <input 
                name="fullName" 
                type="text" 
                placeholder="Full Name" 
                value={formData.fullName} 
                onChange={handleChange} 
                required 
                className="input input-bordered w-full py-2 px-3 text-sm rounded-md border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200" 
              />
            </div>
            <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="input input-bordered w-full py-2 px-3 text-sm rounded-md border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200" 
              />
            </div>
            <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
              <input 
                name="phone" 
                type="text" 
                placeholder="Phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                className="input input-bordered w-full py-2 px-3 text-sm rounded-md border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200" 
              />
            </div>
            <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
              <input 
                name="address" 
                type="text" 
                placeholder="Address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
                className="input input-bordered w-full py-2 px-3 text-sm rounded-md border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
                <input 
                  name="city" 
                  type="text" 
                  placeholder="City" 
                  value={formData.city} 
                  onChange={handleChange} 
                  required 
                  className="input input-bordered w-full py-2 px-3 text-sm rounded-md border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200" 
                />
              </div>
              <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
                <input 
                  name="country" 
                  type="text" 
                  placeholder="Country" 
                  value={formData.country} 
                  onChange={handleChange} 
                  required 
                  className="input input-bordered w-full py-2 px-3 text-sm rounded-md border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200" 
                />
              </div>
            </div>
            <div className="transition-all duration-300 transform hover:translate-y-[-2px]">
              <input 
                name="postalCode" 
                type="text" 
                placeholder="Postal Code" 
                value={formData.postalCode} 
                onChange={handleChange} 
                required 
                className="input input-bordered w-full py-2 px-3 text-sm rounded-md border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200" 
              />
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="text-sm text-green-600 hover:text-green-800 mt-2 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-full transition-all duration-200 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Cart
          </button>
        </form>

        {/* Order Summary */}
        <div className="w-full md:w-[55%] bg-white border rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg">
          <h4 className="text-lg font-semibold mb-4 text-green-700 border-b border-green-200 pb-2">Order Summary</h4>
          <div className="max-h-64 overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 border-b pb-3 transition-all duration-300 hover:bg-green-50 rounded-md p-2"
              >
                <img 
                  src={item.thumbnail} 
                  alt={item.name} 
                  className="w-16 h-16 rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-105" 
                />
                <div className="flex justify-between w-full">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{item.name || item.product_name}</h3>
                    <p className="text-xs text-gray-500 mt-1 text-left">Qty: {item.quantity}</p>
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

          {/* Delivery Options */}
          <div className="mb-4">
            <h5 className="text-sm font-medium mb-2 text-gray-700">Delivery Method</h5>
            <div className="flex space-x-2">
              <div 
                className={`flex flex-col flex-1 p-2 border rounded-md cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                  deliveryMethod === "standard" ? "border-green-500 bg-green-50 shadow-sm" : "border-gray-200 hover:border-green-200"
                }`}
                onClick={() => handleDeliveryChange("standard")}
              >
                <div className="flex items-center mb-1">
                  <div className={`w-3 h-3 rounded-full border mr-2 flex items-center justify-center ${
                    deliveryMethod === "standard" ? "border-green-500 bg-green-500" : "border-gray-300"
                  }`}>
                    {deliveryMethod === "standard" && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs font-medium">Standard</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">3-5 days</span>
                  <span className={subtotal > 500 ? "text-green-600 font-medium" : ""}>
                    {subtotal > 500 ? "Free" : "₹70"}
                  </span>
                </div>
              </div>

              <div 
                className={`flex flex-col flex-1 p-2 border rounded-md cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                  deliveryMethod === "express" ? "border-green-500 bg-green-50 shadow-sm" : "border-gray-200 hover:border-green-200"
                }`}
                onClick={() => handleDeliveryChange("express")}
              >
                <div className="flex items-center mb-1">
                  <div className={`w-3 h-3 rounded-full border mr-2 flex items-center justify-center ${
                    deliveryMethod === "express" ? "border-green-500 bg-green-500" : "border-gray-300"
                  }`}>
                    {deliveryMethod === "express" && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs font-medium">Express</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">within 24 hours</span>
                  <span>₹100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <div className="flex justify-between items-center py-1 transition-all duration-200 hover:bg-gray-50 px-2 rounded">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-1 transition-all duration-200 hover:bg-gray-50 px-2 rounded">
              <span>Shipping</span>
              <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
              <span>Total</span>
              <span className="text-lg text-green-600">₹{totalCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Secure Note + Pay */}
          <div className="bg-green-50 p-2.5 rounded-lg text-xs text-gray-600 flex items-center gap-2 mb-2 border border-gray-100 transition-all duration-300 hover:bg-gray-100">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            All transactions are secure and encrypted.
          </div>

          <div className="bg-indigo-50 p-2.5 rounded-lg text-xs text-gray-600 flex items-center gap-2 mb-2 border border-gray-100 transition-all duration-300 hover:bg-gray-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
            Express delivery available exclusively in Delhi NCR.
          </div>

          <div className="bg-red-50 p-2.5 rounded-lg text-xs text-gray-600 flex items-center gap-2 mb-2 border border-gray-100 transition-all duration-300 hover:bg-gray-100">
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
  All displayed prices include GST and applicable service charges.
          </div>
          
          <button 
            onClick={handleSubmit} 
            className={`w-full relative overflow-hidden py-2.5 rounded-md text-sm font-semibold transition-all duration-300 
              ${isFormComplete 
                ? "bg-green-600 hover:bg-green-700 text-white transform hover:scale-102" 
                : "bg-gray-300 cursor-not-allowed text-gray-500"}`}
          >
            <span className="relative z-10">Pay Now</span>
            {isFormComplete && (
              <span className="absolute inset-0 rounded-md overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </span>
            )}
          </button>
          
          {!isFormComplete && (
            <p className="text-xs text-center mt-2 text-red-500">Please complete shipping information first</p>
          )}
        </div>
      </div>
      
      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1e1c1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4ade80;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.4;
          }
        }
        .scale-102 {
          scale: 1.02;
        }
      `}</style>
    </div>
  );
};

export default Checkout;