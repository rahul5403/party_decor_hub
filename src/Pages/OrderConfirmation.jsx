import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import confetti from "canvas-confetti";
import { mergeCart } from "../redux/cartSlice";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get order details from location state
  const { orderDetails, orderTotal, paymentDetails } = location.state || {};

  // If no order details, redirect to home
  useEffect(() => {
    if (!orderDetails) {
      navigate("/");
      return;
    }

    // Clear the cart after successful order
    dispatch(mergeCart([]));

    // Launch confetti effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Launch confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    // Clean up the interval
    return () => clearInterval(interval);
  }, [orderDetails, navigate, dispatch]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // If no order details, show loading
  if (!orderDetails) {
    return (
      <div className="max-w-6xl mx-auto px-2 py-2 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-green-500 border-t-transparent"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 py-2 min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-t-4 border-green-500 transform transition-all hover:shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase! Your order has been confirmed and is
            being processed.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <button
              onClick={() => navigate(`/track-order/${orderDetails.order_id}`)}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition-all duration-200 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Track Order
            </button>
            <button
              onClick={() => navigate("/my-orders")}
              className="px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium hover:bg-green-200 transition-all duration-200 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              My Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-200 transition-all duration-200 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Order Details and Shipping Info - Split View */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Order Details */}
        <div className="w-full md:w-[60%] bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold text-green-700">
              Order Details
            </h2>
            <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
              {orderDetails.order_status || "Confirmed"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Order Number</span>
              <span className="font-medium">#{orderDetails.order_id}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Date</span>
              <span className="font-medium">
                {formatDate(orderDetails.created_at)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Payment Method</span>
              <span className="font-medium">
                {orderDetails.payment_details?.method || "Razorpay"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Payment Status</span>
              <span className="font-medium text-green-600">
                {orderDetails.payment_status || "Completed"}
              </span>
            </div>
          </div>

          <h3 className="font-medium text-gray-700 mb-3">Order Items</h3>
          <div className="max-h-64 overflow-y-auto space-y-4 mb-4 pr-1 custom-scrollbar">
            {orderDetails.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b pb-3 last:border-b-0 transition-all duration-300 hover:bg-green-50 rounded-md p-2"
              >
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-16 h-16 rounded-md object-cover shadow-sm transition-transform duration-300 hover:scale-105"
                />
                <div className="flex justify-between w-full">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">
                      {item.name}
                    </h3>
                    <div className="mt-1 space-y-1 text-xs text-gray-500 text-left">
                      <p className="m-0">Qty: {item.quantity}</p>
                      {item.color &&
                        Array.isArray(item.color) &&
                        item.color.length > 0 && (
                          <p>Color: {item.color.join(", ")}</p>
                        )}
                      {item.color &&
                        typeof item.color === "string" &&
                        item.color.trim() !== "" && <p>Color: {item.color}</p>}
                      {item.size && <p>Size: {item.size}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{orderDetails.order_summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>
                {orderDetails.order_summary.shipping === 0
                  ? "Free"
                  : `₹${orderDetails.order_summary.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total</span>
              <span className="text-green-600">
                ₹{orderDetails.order_summary.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          {paymentDetails && (
            <div className="mt-6 pt-4 border-t border-dashed">
              <h3 className="font-medium text-gray-700 mb-3">
                Payment Information
              </h3>
              <div className="bg-gray-50 p-3 rounded-md text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono">
                    {paymentDetails.razorpay_payment_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono">
                    {paymentDetails.razorpay_order_id}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Shipping Info & Tracking - IMPROVED COMPACT DESIGN */}
        <div className="w-full md:w-[40%] space-y-4">
          {/* Shipping Information - MORE COMPACT & ALIGNED */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 py-2 px-4">
              <h4 className="text-md font-semibold text-white flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                Shipping Details
              </h4>
            </div>

            {/* Content - More compact */}
            <div className="p-4">
              {/* Shipping Method - Compact inline design */}
              <div className="flex items-center px-3 py-2 bg-green-50 rounded-md mb-3 border border-green-100">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-medium text-green-700">
                      {orderDetails.shipping_method.name}
                    </h3>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs">
                      {orderDetails.shipping_method.estimated_days}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Details - More compact grid layout */}
              <div className="grid grid-cols-1 gap-3 border-t pt-3">
                {/* Delivery Address */}
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
  <h3 className="text-xs font-medium text-gray-700 mb-1">Delivery Address</h3>
  <div className="text-xs text-gray-600 leading-tight">
    <p className="font-medium">
      {orderDetails.shipping_details.name}
    </p>
    <p>
      {orderDetails.shipping_details.address_line1}
      {orderDetails.shipping_details.address_line2 && (
        <>,&nbsp;{orderDetails.shipping_details.address_line2}</>
      )}
      ,&nbsp;{orderDetails.shipping_details.city},&nbsp;
      {orderDetails.shipping_details.postal_code},&nbsp;
      {orderDetails.shipping_details.country}
    </p>
  </div>
</div>


                </div>

                {/* Contact Info - Horizontal layout */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        Email
                      </p>
                      <p className="text-xs font-medium truncate">
                        {orderDetails.shipping_details.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-2 flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-xs font-medium">
                        {orderDetails.shipping_details.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Track Order Card - More compact */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-2 px-4 relative">
              <div className="absolute top-0 right-0 opacity-20">
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.92 2.38A15.72 15.72 0 0017.5 2a8.26 8.26 0 00-6 2.06Q9.89 5.67 8.31 7.27c-1.21-.13-4.08-.2-6 1.69a1 1 0 00.46 1.63l3.31 1.07a2.77 2.77 0 011.63 1.63l1.07 3.31a1 1 0 00.69.65 1 1 0 00.94-.18c1.95-2 1.89-4.82 1.77-6l3.51-3.51A8.26 8.26 0 0022 6a15.72 15.72 0 00-.38-3.62 1 1 0 00-.7-.7z" />
                  <path d="M12.63 14.43l2.43 5a1 1 0 00.79.58 1.15 1.15 0 00.33 0 1 1 0 00.73-.44l1-1.49 1.21 1.21a1 1 0 001.42 0 1 1 0 000-1.42l-1.21-1.21 1.49-1a1 1 0 00.46-1.06 1 1 0 00-.58-.79l-5-2.43a1 1 0 00-1.14.27 1 1 0 00-.23 1.03z" />
                  <path d="M9 18H4a1 1 0 00-1 1 3 3 0 003 3 1 1 0 001-1v-2.42a2 2 0 00.59-1.42A2.16 2.16 0 009 18z" />
                </svg>
              </div>
              <h4 className="text-md font-semibold text-white flex items-center relative z-10">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Track Your Order
              </h4>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-600 mb-2">
                Your order is currently being processed. Follow its journey to
                your doorstep!
              </p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mb-2">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: "25%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-3">
                <span className="text-[10px]">Placed</span>
                <span className="text-[10px] font-medium text-blue-600">
                  Processing
                </span>
                <span className="text-[10px]">Shipped</span>
                <span className="text-[10px]">Delivered</span>
              </div>
              <button
                onClick={() =>
                  navigate(`/track-order/${orderDetails.order_id}`, {
                    state: { orderDetails, paymentDetails },
                  })
                }
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                View Detailed Tracking
              </button>
            </div>
          </div>

          {/* Customer Support - More compact */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 py-2 px-4">
              <h4 className="text-md font-semibold text-white flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Need Help?
              </h4>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-600 mb-2">
                If you have any questions about your order, please contact our
                customer support.
              </p>
              <div className="flex flex-col space-y-2">
                <a
                  href="mailto:support@partydecorhub.com"
                  className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  support@partydecorhub.com
                </a>
                <a
                  href="tel:+917011676961"
                  className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  +91 7011676961
                </a>
              </div>
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
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
