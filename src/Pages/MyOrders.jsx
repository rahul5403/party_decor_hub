import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 5;
  
  const navigate = useNavigate();
  const API_BASE_URL = "https://partydecorhub.com/api";
  const API_BASE_URL_IMAGE = "https://partydecorhub.com";

  useEffect(() => {
    const fetchOrders = async () => {
        const Token = localStorage.getItem("accessToken");
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/user/orders?limit=${ordersPerPage}&offset=${(currentPage - 1) * ordersPerPage}`,
          {
            headers: { Authorization: `Bearer ${Token}` },
          }
        );
        setOrders(response.data.orders);
        setTotalPages(Math.ceil(response.data.total_orders / ordersPerPage));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ORDER_DELIVERED":
        return "bg-green-100 text-green-700 border-green-200";
      case "ORDER_SHIPPED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "ORDER_PROCESSING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "ORDER_CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ORDER_DELIVERED":
        return (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case "ORDER_SHIPPED":
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "ORDER_PROCESSING":
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "ORDER_CANCELLED":
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-sm font-medium text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-red-100">
          <div className="mb-4 text-red-500">
            <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-base text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 min-h-[80vh] bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-5 mb-5 border-l-4 border-green-500">
        <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
        <p className="text-sm text-gray-500">Track your orders and view your purchase history</p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No Orders Found</h2>
          <p className="text-sm text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:border-green-200 transition-all duration-200"
            >
              <div className="p-4">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex h-9 w-9 rounded-full bg-gray-100 items-center justify-center">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800">#{order.order_id}</p>
                        <span className="text-xs text-gray-500">•</span>
                        <p className="text-xs text-gray-500">{formatDate(order.order_date)}</p>
                      </div>
                      <p className="text-sm font-medium text-green-600">₹{order.total_price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status_display}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="flex items-start gap-4">
                  <div className="flex-1 overflow-x-auto hide-scrollbar">
                    <div className="flex items-center gap-2">
                      {order.items.slice(0, 4).map((item) => (
                        <div
                          key={`${order.order_id}-${item.product_id}`}
                          className="flex-shrink-0"
                        >
                          <div className="relative">
                            <img
                              src={`${API_BASE_URL_IMAGE}${item.image_url}`}
                              alt={item.product_name}
                              className="w-14 h-14 object-cover rounded-md border border-gray-200"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-14 h-14 rounded-md bg-gray-100 flex items-center justify-center">
                          <p className="text-xs text-gray-600 font-medium">+{order.items.length - 4}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => handleOrderClick(order.order_id)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-all duration-200 flex items-center gap-1"
                    >
                      Details
                    </button>
                    
                    {order.tracking_number && (
                      <button
                        onClick={() => navigate(`/track-order/${order.order_id}`)}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 transition-all duration-200 flex items-center gap-1"
                      >
                        Track
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {orders.length > 0 && totalPages > 1 && (
        <div className="mt-5 flex justify-center">
          <div className="inline-flex items-center rounded-md shadow-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-1.5 rounded-l-md border border-gray-300 text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-50 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium ${
                  currentPage === page
                    ? "z-10 bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } -ml-px`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-1.5 rounded-r-md border border-gray-300 text-sm font-medium -ml-px ${
                currentPage === totalPages
                  ? "bg-gray-50 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Continue Shopping Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-all duration-200 inline-flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continue Shopping
        </button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MyOrders;