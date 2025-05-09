import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mastercard from "../assets/images/mastercard_logo.png";
import visa from "../assets/images/visa_logo.png";
import paytm from "../assets/images/paytm_logo.png";
import phonepe from "../assets/images/phonepe_logo.png";
import razorpay from "../assets/images/razorpay_logo.png";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [formData, setFormData] = useState({
    fullName: "", 
    email: "", 
    phone: "", 
    address: "", 
    city: "", 
    country: "India", 
    postalCode: "",
  });
  
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileError, setProfileError] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [checkingShipping, setCheckingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [shippingMessage, setShippingMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Calculate shipping cost based on selected delivery method
  const getShippingCost = () => {
    if (!deliveryMethod || shippingOptions.length === 0) return 0;
    
    const selectedOption = shippingOptions.find(option => option.name === deliveryMethod);
    return selectedOption ? selectedOption.price : 0;
  };
  
  const shippingCost = getShippingCost();
  const totalCost = subtotal + shippingCost;

  // Check if pincode is filled
  const isPincodeAvailable = () => {
    return formData.postalCode && formData.postalCode.trim() !== "";
  };

  // Fetch shipping options based on pincode and cart total
  const fetchShippingOptions = async () => {
    if (!isPincodeAvailable()) {
      setShippingError("Please enter a pincode first");
      setShippingMessage("");
      return;
    }

    setCheckingShipping(true);
    setShippingError('');
    setShippingMessage('');
    
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setShippingError("Please login to check delivery options");
      setCheckingShipping(false);
      return;
    }
    
    try {
      const response = await axios.get(
        `https://partydecorhub.com/api/shipping-options?pincode=${formData.postalCode}&cart_total=${subtotal}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      if (response.data && response.data.shipping_options) {
        setShippingOptions(response.data.shipping_options);
        
        // Set default delivery method to the first option
        if (response.data.shipping_options.length > 0 && !deliveryMethod) {
          setDeliveryMethod(response.data.shipping_options[0].name);
        }
        
        // Set custom message based on available options
        if (response.data.shipping_options.length > 1) {
          setShippingMessage("🎉 Great news! Express delivery is available for your location. Get your order faster!");
        } else if (response.data.shipping_options.length === 1) {
          const option = response.data.shipping_options[0];
          if (option.name.toLowerCase() === "standard") {
            setShippingMessage("Standard delivery is available for your location.");
          } else if (option.name.toLowerCase() === "express") {
            setShippingMessage("Express delivery is available for your location!");
          }
        } else {
          setShippingError("No shipping options available for this location");
        }
      } else {
        setShippingError("No shipping options available for this location");
      }
    } catch (err) {
      setShippingError(err.response?.data?.message || "Failed to fetch shipping options");
      console.error("Error fetching shipping options:", err);
    } finally {
      setCheckingShipping(false);
    }
  };

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setProfileError("Please login to continue");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // First check if user is logged in
        const authCheckResponse = await axios.get(
          "https://partydecorhub.com/api/check-auth",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        
        if (!authCheckResponse.data.is_logged_in) {
          setProfileError("Please login to continue");
          setLoading(false);
          return;
        }
        
        // If logged in, fetch profile data
        const profileResponse = await axios.get(
          "https://partydecorhub.com/api/profile",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        
        const userProfile = profileResponse.data;
        
        // Handle different API response structures
        let formattedAddress = '';
        if (userProfile.address) {
          if (typeof userProfile.address === 'string') {
            formattedAddress = userProfile.address;
          } else if (typeof userProfile.address === 'object') {
            // Combine address fields if they exist
            const addressParts = [];
            if (userProfile.address.line1) addressParts.push(userProfile.address.line1);
            if (userProfile.address.line2) addressParts.push(userProfile.address.line2);
            if (userProfile.address.city) addressParts.push(userProfile.address.city);
            if (userProfile.address.state) addressParts.push(userProfile.address.state);
            formattedAddress = addressParts.join(', ');
          }
        }

        const getFullName = () => {
          if (!userProfile) return "";
          return userProfile.first_name && userProfile.last_name 
            ? `${userProfile.first_name} ${userProfile.last_name}` 
            : userProfile.first_name || "";
        };
        
        // Map user profile data to form fields
        setFormData({
          fullName: userProfile.name || userProfile.full_name || getFullName(),
          email: userProfile.email || '',
          phone: userProfile.phone || userProfile.mobile || '',
          address: formattedAddress || '',
          city: userProfile.address?.city || userProfile.city || '',
          country: userProfile.address?.country || userProfile.country || 'India',
          postalCode: userProfile.address?.pincode || userProfile.pincode || userProfile.zip_code || '',
        });
        
        setProfileError('');
      } catch (err) {
        setProfileError(err.response?.data?.message || 'Failed to fetch user profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // Check if form is complete
  useEffect(() => {
    const isComplete = Object.values(formData).every(value => value.trim() !== "");
    setIsFormComplete(isComplete);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeliveryChange = (method) => {
    setDeliveryMethod(method);
  };

  // New function to submit order to API
  const submitOrder = async () => {
    setIsSubmitting(true);
    setCheckoutError('');
    
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setCheckoutError("Please login to continue");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Find the shipping method ID based on the selected delivery method name
      const selectedShippingOption = shippingOptions.find(option => option.name === deliveryMethod);
      const shippingMethodId = selectedShippingOption ? selectedShippingOption.id : 0;
      
      // Split the address into lines if needed
      const addressLines = formData.address.split(',');
      const line1 = addressLines[0] || '';
      const line2 = addressLines.length > 1 ? addressLines.slice(1).join(', ') : '';
      
      // Prepare the API request payload
      const checkoutPayload = {
        shipping_method_id: shippingMethodId,
        delivery_pincode: formData.postalCode,
        delivery_address_line1: line1,
        delivery_address_line2: line2,
        delivery_city: formData.city,
        delivery_state: "", // This needs to be added to your form if required
        contact_phone: formData.phone,
        contact_email: formData.email,
        delivery_instructions: "" // This could be added to your form if needed
      };
      
      // Make the API call to create the order
      const response = await axios.post(
        "https://partydecorhub.com/api/cart/checkout",
        checkoutPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      // Handle successful response
      if (response.data) {
        // Redirect to order confirmation page and pass order details if needed
        navigate("/order-confirmation", { 
          state: { 
            orderDetails: response.data,
            orderTotal: totalCost
          } 
        });
      } else {
        throw new Error("No data received from checkout API");
      }
    } catch (err) {
      // Handle errors
      const errorMessage = err.response?.data?.message || err.message || "Failed to process your order";
      setCheckoutError(errorMessage);
      console.error("Checkout error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!isFormComplete) {
      setCheckoutError("Please complete all required fields");
      return;
    }
    
    if (!deliveryMethod) {
      setCheckoutError("Please select a delivery method");
      return;
    }
    
    // Submit the order
    submitOrder();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto  px-2 py-2 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-green-500 border-t-transparent" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-2 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 mb-6 relative inline-block">
        Checkout
        <span className="block w-16 h-1 bg-green-500 mx-auto mt-2 rounded-full"></span>
      </h1>

      {/* Show profile error message */}
      {profileError && (
        <div className="max-w-6xl mx-auto mb-2 items-center">
          <div className="bg-red-50 border-l-4 border-red-500 rounded items-center p-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex items-center">
                <div className="text-sm text-red-700">{profileError}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show checkout error message */}
      {checkoutError && (
        <div className="max-w-6xl mx-auto mb-2 items-center">
          <div className="bg-red-50 border-l-4 border-red-500 rounded items-center p-2">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex items-center">
                <div className="text-sm text-red-700">{checkoutError}</div>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="flex gap-2 items-center">
              <div className="flex-1 transition-all duration-300 transform hover:translate-y-[-2px]">
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
              <button 
                type="button" 
                onClick={fetchShippingOptions}
                disabled={!isPincodeAvailable() || checkingShipping}
                className={`px-3 py-2 text-ss font-medium mt-1 rounded-md transition-all duration-200 flex items-center gap-1
                  ${isPincodeAvailable() && !checkingShipping 
                    ? "bg-green-600 hover:bg-green-700 text-white transform hover:scale-102" 
                    : "bg-gray-300 cursor-not-allowed text-gray-500"}`}
              >
                {checkingShipping ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Check Delivery
                  </>
                )}
              </button>
            </div>
          </div>
          
          {shippingError && (
            <div className="text-xs text-red-500 mt-1">{shippingError}</div>
          )}
          
          {shippingMessage && (
            <div className="text-xs text-green-600 font-medium mt-2 bg-green-50 p-2 rounded-md border border-green-200 flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {shippingMessage}
            </div>
          )}
          
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="text-sm text-green-600 hover:text-green-800 mt-4 bg-red-50 hover:bg-green-100 px-3 py-1 rounded-full transition-all duration-200 flex items-center gap-1"
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
                    <h3 className="text-sm font-medium text-gray-800">
                      {item.name || item.product_name}
                    </h3>
                    <div className="mt-1 space-y-1 text-xs text-gray-500 text-left">
                      <p className="m-0">Qty: {item.quantity}</p>
                      {/* Fix for the item.color.join issue - check if color is an array before using join */}
                      {item.color && Array.isArray(item.color) && item.color.length > 0 && (
                        <p>Color: {item.color.join(', ')}</p>
                      )}
                      {/* If color is a string, just display it directly */}
                      {item.color && typeof item.color === 'string' && item.color.trim() !== '' && (
                        <p>Color: {item.color}</p>
                      )}
                      {item.size && <p>Size: {item.size}</p>}
                    </div>
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
            {shippingOptions.length > 0 ? (
              <div className="flex space-x-2">
                {shippingOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`flex flex-col flex-1 p-2 border rounded-md cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                      deliveryMethod === option.name ? "border-green-500 bg-green-50 shadow-sm" : "border-gray-200 hover:border-green-200"
                    }`}
                    onClick={() => handleDeliveryChange(option.name)}
                  >
                    <div className="flex items-center mb-1">
                      <div className={`w-3 h-3 rounded-full border mr-2 flex items-center justify-center ${
                        deliveryMethod === option.name ? "border-green-500 bg-green-500" : "border-gray-300"
                      }`}>
                        {deliveryMethod === option.name && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs font-medium">{option.name}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{option.estimated_days}</span>
                      <span className={option.price === 0 ? "text-green-600 font-medium" : ""}>
                        {option.price === 0 ? "Free" : `₹${option.price}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                {isPincodeAvailable() 
                  ? "Please check delivery options for your pincode" 
                  : "Enter your pincode to view delivery options"}
              </div>
            )}
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
                {shippingCost === 0 ? (deliveryMethod ? 'Free' : '-') : `₹${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
              <span>Total</span>
              <span className="text-lg text-green-600">₹{totalCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Secure Note + Pay */}
          <div className="bg-green-50 p-2.5 rounded-lg text-xs text-gray-600 flex items-center justify-between mb-2 border border-gray-100 transition-all duration-300 hover:bg-gray-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              All transactions are secure and encrypted.
            </div>
            <div className="flex items-center gap-3 bg-transparent">
              <img src={mastercard} alt="Mastercard" className="h-7 object-contain bg-transparent" />
              <img src={visa} alt="Visa" className="h-7 object-contain bg-transparent" />
              <img src={paytm} alt="Paytm" className="h-7 object-contain bg-transparent" />
              <img src={phonepe} alt="PhonePe" className="h-7 object-contain bg-transparent" />
              <img src={razorpay} alt="Razorpay" className="h-7 object-contain bg-transparent" />
            </div>
          </div>

          <div className="bg-indigo-50 p-2.5 rounded-lg text-xs text-gray-600 flex items-center gap-2 mb-2 border border-gray-100 transition-all duration-300 hover:bg-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            disabled={isSubmitting || !isFormComplete || !deliveryMethod}
            className={`w-full relative overflow-hidden py-2.5 rounded-md text-sm font-semibold transition-all duration-300 
              ${isFormComplete && deliveryMethod && !isSubmitting
                ? "bg-green-600 hover:bg-green-700 text-white transform hover:scale-102" 
                : "bg-gray-300 cursor-not-allowed text-gray-500"}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>
                <span className="relative z-10">Pay Now</span>
                {isFormComplete && deliveryMethod && (
                  <span className="absolute inset-0 rounded-md overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </span>
                )}
              </>
            )}
          </button>
          
          {!isFormComplete && (
            <p className="text-xs text-center mt-2 text-red-500">Please complete shipping information first</p>
          )}
          
          {isFormComplete && !deliveryMethod && (
            <p className="text-xs text-center mt-2 text-red-500">Please select a delivery method</p>
          )}

          {/* Added Policy Links */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-2">By proceeding with the purchase, you agree to our policies</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
              <a 
                href="/refund-policy" 
                target="_blank"
                className="text-green-600 hover:text-green-800 hover:underline transition-all duration-200 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Refund Policy
              </a>
              <a 
                href="/shipping-policy" 
                target="_blank"
                className="text-green-600 hover:text-green-800 hover:underline transition-all duration-200 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
                </svg>
                Shipping Policy
              </a>
              <a 
                href="/privacy-policy" 
                target="_blank"
                className="text-green-600 hover:text-green-800 hover:underline transition-all duration-200 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Privacy Policy
              </a>
            </div>
          </div>
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