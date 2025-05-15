import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const TrackOrder = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for tracking data
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order tracking data
  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        
        // Updated API endpoint for tracking data
        const response = await axios.get(
          `https://partydecorhub.com/api/orders/${orderId}/tracking`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
          }
        );
        
        setTrackingData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tracking data:", err);
        setError("Failed to load tracking information. Please try again.");
        setLoading(false);
      }
    };

    if (orderId) {
      fetchTrackingData();
    } else {
      setError("Order ID is missing");
      setLoading(false);
    }
  }, [orderId]);

  // Calculate tracking progress percentage based on status
  const calculateProgress = (status) => {
    const statusMap = {
      "ORDER_CREATED": 25,
      "ORDER_PROCESSING": 50,
      "ORDER_SHIPPED": 75,
      "ORDER_DELIVERED": 100
    };
    
    return statusMap[status] || 25;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  
  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString("en-US", options);
  };

  // Get latest status from history
  const getLatestStatus = (history) => {
    if (!history || history.length === 0) return null;
    return history[0];
  };

  // Render loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-500 border-t-transparent"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-5 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-7 h-7 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Tracking Information Unavailable
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Destructure tracking data for easier access
  const {
    order_id,
    current_status,
    current_status_display,
    estimated_delivery_date,
    tracking_number,
    history
  } = trackingData || {};

  // Get latest status info
  const latestStatus = getLatestStatus(history);
  
  // Calculate progress percentage
  const progressPercentage = calculateProgress(current_status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Order Tracking</h1>
        <button
          onClick={() => navigate("/")}
          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Track Order Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-5">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-lg font-bold text-white">
                Order #{order_id}
              </h2>
              {latestStatus && (
                <p className="text-blue-100 text-xs">
                  {latestStatus.timestamp && `Last updated: ${formatDate(latestStatus.timestamp)}`}
                </p>
              )}
            </div>
            <span className="inline-block mt-2 md:mt-0 bg-white text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
              {current_status_display}
            </span>
          </div>
        </div>

        {/* Tracking Progress Bar */}
        <div className="p-5">
          <div className="mb-5">
            <div className="relative pt-6">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* Tracking Steps */}
              <div className="flex justify-between">
                <div className="text-center relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      progressPercentage >= 25
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    style={{ marginTop: "-2rem" }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
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
                  <p
                    className={`text-xs font-medium ${
                      progressPercentage >= 25
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    Created
                  </p>
                </div>

                <div className="text-center relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      progressPercentage >= 50
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    style={{ marginTop: "-2rem" }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {progressPercentage >= 50 ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        />
                      )}
                    </svg>
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      progressPercentage >= 50
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    Processing
                  </p>
                </div>

                <div className="text-center relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      progressPercentage >= 75
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    style={{ marginTop: "-2rem" }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {progressPercentage >= 75 ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 4v7m0 0v7m0-7h-7m7 0H5"
                        />
                      )}
                    </svg>
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      progressPercentage >= 75
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    Shipped
                  </p>
                </div>

                <div className="text-center relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      progressPercentage >= 100
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    style={{ marginTop: "-2rem" }}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {progressPercentage >= 100 ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      )}
                    </svg>
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      progressPercentage >= 100
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    Delivered
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-5">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-4 w-4 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Status Update
                </h3>
                <div className="mt-1 text-xs text-blue-700">
                  <p>
                    {current_status === "ORDER_CREATED" && "Your order has been received and is being prepared."}
                    {current_status === "ORDER_PROCESSING" && "Your order is currently being processed at our warehouse."}
                    {current_status === "ORDER_SHIPPED" && "Your order has been shipped and is on its way to you."}
                    {current_status === "ORDER_DELIVERED" && "Your order has been delivered successfully."}
                    {current_status === "PAYMENT_PENDING" && "Your payment is being processed."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order and Delivery Details - 2 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                <svg
                  className="w-3.5 h-3.5 mr-1.5 text-blue-500"
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
                Order Details
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-medium">#{order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Status</span>
                  <span className="font-medium">{current_status_display}</span>
                </div>
                {latestStatus && latestStatus.timestamp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">{formatDate(latestStatus.timestamp)}</span>
                  </div>
                )}
                {latestStatus && latestStatus.timestamp && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{formatTime(latestStatus.timestamp)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                <svg
                  className="w-3.5 h-3.5 mr-1.5 text-blue-500"
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
                Shipping Information
              </h3>
              <div className="space-y-1.5 text-xs">
                {tracking_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking Number</span>
                    <span className="font-medium">{tracking_number}</span>
                  </div>
                )}
                {estimated_delivery_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Delivery</span>
                    <span className="font-medium">{formatDate(estimated_delivery_date)}</span>
                  </div>
                )}
                {!tracking_number && !estimated_delivery_date && (
                  <p className="text-gray-500 italic">
                    Shipping details will be available once your order is processed.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tracking History */}
          {history && history.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                <svg
                  className="w-3.5 h-3.5 mr-1.5 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Tracking History
              </h3>
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div 
                    key={index} 
                    className={`relative pl-5 pb-3 ${
                      index !== history.length - 1 ? "border-l-2 border-blue-100" : ""
                    }`}
                  >
                    <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500"></div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.status_display}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-gray-600 mt-0.5">
                            {item.notes}
                          </p>
                        )}
                      </div>
                      {item.timestamp && (
                        <p className="text-xs text-gray-500 mt-1 md:mt-0">
                          {formatDate(item.timestamp)} at {formatTime(item.timestamp)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            <button
              onClick={() => navigate("/my-orders")}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-1.5"
            >
              <svg
                className="w-3.5 h-3.5"
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
              View All Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 transition-colors duration-200 flex items-center gap-1.5"
            >
              <svg
                className="w-3.5 h-3.5"
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
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-gray-600 text-white rounded-md text-xs font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center gap-1.5"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Need Help Section - More compact */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 py-2 px-4">
          <h4 className="text-sm font-semibold text-white flex items-center">
            <svg
              className="w-3.5 h-3.5 mr-1.5"
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
          <p className="text-xs text-gray-600 mb-3">
            If you have any questions about your order or need assistance with tracking,
            our customer support team is here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href="mailto:support@partydecorhub.com"
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-indigo-600"
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
              <div>
                <span className="block text-xs font-medium text-gray-900">
                  Email Support
                </span>
                <span className="block text-xs text-gray-500">
                  partydecorhub.com@gmail.com
                </span>
              </div>
            </a>
            <a
              href="tel:+917011676961"
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-900">
                  Phone Support
                </span>
                <span className="block text-xs text-gray-500">
                  +91 7011676961
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;