import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const shippingCost = 19;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCost = subtotal + shippingCost;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to handle the form submission, e.g., sending the data to a server
    // Navigate to a confirmation page or show a success message
    navigate("/order-confirmation");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-center mb-10 text-gray-800">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section - Form */}
        <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-semibold mb-6 text-center">Shipping Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your address"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Your city"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Your country"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Your postal code"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                required
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Return to Cart
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-md transition duration-200"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </div>

        {/* Right Section - Cart Summary */}
        <div className="w-full lg:w-2/5 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-semibold mb-6 text-center">Order Summary</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100">
                <img
                  src={item.thumbnail || "https://placehold.co/50x50"}
                  alt={item.name || item.product_name}
                  className="w-16 h-16 object-cover rounded-sm"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.name || item.product_name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-green-600 font-semibold">₹{item.price.toFixed(2)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="ml-2 text-gray-400 text-sm line-through">
                        ₹{item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₹{shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-semibold border-t border-gray-200">
              <span>Total</span>
              <span>₹{totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-50 p-4 rounded-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm text-gray-600">All transactions are secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;