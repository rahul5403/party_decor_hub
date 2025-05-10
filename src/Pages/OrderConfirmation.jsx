import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { mergeCart } from "../redux/cartSlice"; // Import your clear cart action
import axios from "axios";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Extract order details from location state
  const { orderDetails, orderTotal, paymentDetails } = location.state || {};
  const [orderStatus, setOrderStatus] = useState({
    loading: false,
    error: null,
    data: null
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format estimated delivery date (assuming delivery date is in orderDetails or can be calculated)
  const getEstimatedDeliveryDate = () => {
    if (orderDetails?.estimated_delivery_date) {
      return formatDate(orderDetails.estimated_delivery_date);
    }
    
    // If no delivery date in the order details, calculate based on order date and shipping method
    const shippingDays = orderDetails?.shipping_method?.toLowerCase().includes('express') ? 3 : 7;
    const orderDate = orderDetails?.created_at ? new Date(orderDetails.created_at) : new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + shippingDays);
    
    return formatDate(deliveryDate);
  };
  
  // If there are no order details, redirect to home
  useEffect(() => {
    const checkOrderStatus = async () => {
      if (!orderDetails) {
        navigate("/");
        return;
      }
      
      // Get access token for API calls
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setOrderStatus({
          loading: false,
          error: "Authentication token not found",
          data: null
        });
        return;
      }
      
      // Check order status if we don't have complete details
      if (!orderDetails.status || orderDetails.status === 'pending') {
        try {
          setOrderStatus({ loading: true, error: null, data: null });
          
          // Make API call to check order status
          const response = await axios.get(
            `https://partydecorhub.com/api/orders/${orderDetails.order_id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          );
          
          if (response.data) {
            setOrderStatus({ loading: false, error: null, data: response.data });
          } else {
            setOrderStatus({
              loading: false,
              error: "Failed to retrieve order details",
              data: null
            });
          }
        } catch (error) {
          console.error("Error checking order status:", error);
          setOrderStatus({
            loading: false,
            error: "Failed to check order status. Please contact customer support.",
            data: null
          });
        }
      }
    };
    
    checkOrderStatus();
    
    // Clear the cart after successful order
    dispatch(mergeCart());
    
  }, [orderDetails, navigate, dispatch]);
  
  // If no order details, show loading
  if (!orderDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-green-500 border-t-transparent" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  // Show loading while checking order status
  if (orderStatus.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-green-500 border-t-transparent" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Checking order status...</p>
        </div>
      </div>
    );
  }
  
  // Show error if order status check failed
  if (orderStatus.error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Status Issue</h1>
          <p className="text-gray-600 mb-4">{orderStatus.error}</p>
          <div className="bg-gray-50 p-4 rounded-md text-left mb-4">
            <h3 className="text-sm font-medium mb-2">Order Information</h3>
            <p className="text-sm text-gray-600">Order ID: {orderDetails.order_id}</p>
            {paymentDetails?.data?.razorpay_payment_id && (
              <p className="text-sm text-gray-600">Payment ID: {paymentDetails.data.razorpay_payment_id}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/contact-support', { 
                state: { 
                  issue: 'order_status', 
                  orderId: orderDetails.order_id,
                  paymentId: paymentDetails?.data?.razorpay_payment_id
                } 
              })} 
              className="flex-1 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors duration-300"
            >
              Contact Support
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="flex-1 py-2.5 px-4 border border-gray-300 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors duration-300"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Use the most up-to-date order details
  const finalOrderDetails = orderStatus.data || orderDetails;
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
      {/* Order Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase. Your order has been received.</p>
      </div>
      
      {/* Order Details Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-4">
          <div>
            <h2 className="text-lg font-medium text-gray-800">Order #{finalOrderDetails.order_id}</h2>
            <p className="text-sm text-gray-500">
              {finalOrderDetails.created_at ? formatDate(finalOrderDetails.created_at) : new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Confirmed
            </span>
          </div>
        </div>
        
        {/* Payment Details */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="text-sm font-medium">Razorpay {paymentDetails?.data?.razorpay_payment_id ? '(✓ Paid)' : ''}</p>
            </div>
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs text-gray-500">Transaction ID</p>
              <p className="text-sm font-medium">
                {paymentDetails?.data?.razorpay_payment_id || 'Processing...'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Shipping Details */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs text-gray-500">Shipping Method</p>
              <p className="text-sm font-medium">{finalOrderDetails.shipping_method || 'Standard Delivery'}</p>
            </div>
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-xs text-gray-500">Estimated Delivery</p>
              <p className="text-sm font-medium">{getEstimatedDeliveryDate()}</p>
            </div>
            <div className="bg-gray-50 rounded-md p-3 md:col-span-2">
              <p className="text-xs text-gray-500">Delivery Address</p>
              <p className="text-sm">
                {finalOrderDetails.shipping_address || 
                 `${finalOrderDetails.delivery_address_line1 || ''} 
                  ${finalOrderDetails.delivery_address_line2 ? ', ' + finalOrderDetails.delivery_address_line2 : ''}, 
                  ${finalOrderDetails.delivery_city || ''}, 
                  ${finalOrderDetails.delivery_pincode || ''}`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Order Summary</h3>
          <div className="border-t border-b py-4 space-y-3">
            {finalOrderDetails.items && finalOrderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name || item.product_name} × {item.quantity}
                  {item.color && 
                    <span className="text-gray-500 text-xs"> ({typeof item.color === 'string' ? item.color : item.color.join(', ')})</span>
                  }
                </span>
                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{finalOrderDetails.subtotal?.toFixed(2) || (orderTotal - finalOrderDetails.shipping_price)?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>{finalOrderDetails.shipping_price === 0 ? 'Free' : `₹${finalOrderDetails.shipping_price?.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span className="text-green-600">₹{orderTotal?.toFixed(2) || finalOrderDetails.total_price?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* What's Next Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">What's Next?</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <span className="text-green-600 font-medium">1</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Order Processing</h4>
              <p className="text-sm text-gray-500">We're preparing your order for shipping. You'll receive an email confirmation soon.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <span className="text-green-600 font-medium">2</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Shipment Updates</h4>
              <p className="text-sm text-gray-500">We'll send you tracking information once your order ships.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <span className="text-green-600 font-medium">3</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Delivery</h4>
              <p className="text-sm text-gray-500">Your order will be delivered to your door. Expected by {getEstimatedDeliveryDate()}.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button 
          onClick={() => navigate('/my-orders')} 
          className="flex-1 py-2.5 px-4 border border-green-600 rounded-md text-green-600 hover:bg-green-50 text-sm font-medium transition-colors duration-300"
        >
          View All Orders
        </button>
        <button 
          onClick={() => navigate('/')} 
          className="flex-1 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors duration-300"
        >
          Continue Shopping
        </button>
      </div>
      
      {/* Need Help Section */}
      <div className="bg-gray-50 rounded-lg p-4 mt-8 border border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-700">Need Help?</h3>
            <p className="text-xs text-gray-500 mt-1">
              If you have any questions about your order, please contact our customer service team at{' '}
              <a href="mailto:support@partydecorhub.com" className="text-green-600 hover:underline">
                support@partydecorhub.com
              </a>
              {' '}or call us at{' '}
              <a href="tel:+91XXXXXXXXXX" className="text-green-600 hover:underline">
                +91 XXXXXXXXXX
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Custom styles for animations and transitions */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;