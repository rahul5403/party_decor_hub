import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      const Token = localStorage.getItem("accessToken");
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/user/orders?limit=${ordersPerPage}&offset=${
            (currentPage - 1) * ordersPerPage
          }`,
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
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ORDER_DELIVERED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "ORDER_SHIPPED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ORDER_PROCESSING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "ORDER_CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const iconClass = "w-4 h-4";
    switch (status) {
      case "ORDER_DELIVERED":
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "ORDER_SHIPPED":
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
          </svg>
        );
      case "ORDER_PROCESSING":
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "ORDER_CANCELLED":
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-2 text-sm font-medium text-gray-600">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border max-w-sm w-full">
          <div className="mb-4 text-red-500">
            <svg
              className="w-10 h-10 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-sm text-gray-500 mt-1">
                Track and manage your purchase history
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Your order history will appear here once you make a purchase
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr
                        key={order.order_id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleOrderClick(order.order_id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-900">
                            #ORD-{order.order_id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(order.order_date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-2">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div
                                  key={`${order.order_id}-${item.product_id}-${index}`}
                                  className="relative"
                                >
                                  <img
                                    src={`${API_BASE_URL}${item.image_url}`}
                                    alt={item.product_name}
                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                  />
                                  {item.quantity > 1 && (
                                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                      {item.quantity}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {order.items.length === 1
                                ? order.items[0].product_name
                                : order.items.length === 2
                                ? `${order.items[0].product_name} and 1 other`
                                : order.items.length > 3
                                ? `${order.items[0].product_name} and ${
                                    order.items.length - 1
                                  } others`
                                : `${order.items.length} items`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-semibold text-gray-900">
                            ₹{order.total_price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status_display}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderClick(order.order_id);
                              }}
                              className="text-emerald-600 hover:text-emerald-900 font-medium"
                            >
                              View Details
                            </button>
                            {order.tracking_number && (
                              <>
                                <span className="text-gray-300">|</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/track-order/${order.order_id}`);
                                  }}
                                  className="text-blue-600 hover:text-blue-900 font-medium"
                                >
                                  Track
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Desktop Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * ordersPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * ordersPerPage,
                          orders.length + (currentPage - 1) * ordersPerPage
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {totalPages * ordersPerPage}
                      </span>{" "}
                      orders
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === 1
                            ? "bg-white text-gray-300 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                      >
                        Previous
                      </button>

                      <div className="hidden sm:flex items-center space-x-1">
                        {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                          let page;
                          if (totalPages <= 7) {
                            page = i + 1;
                          } else if (currentPage <= 4) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 3) {
                            page = totalPages - 6 + i;
                          } else {
                            page = currentPage - 3 + i;
                          }

                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                currentPage === page
                                  ? "z-10 bg-emerald-600 text-white"
                                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === totalPages
                            ? "bg-white text-gray-300 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="bg-white rounded-lg shadow-sm border p-4"
                  onClick={() => handleOrderClick(order.order_id)}
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-mono text-gray-600">
                      #ORD-{order.order_id}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(order.order_date)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status_display}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 4).map((item, index) => (
                          <div
                            key={`${order.order_id}-${item.product_id}-${index}`}
                            className="relative"
                          >
                            <img
                              src={`${API_BASE_URL}${item.image_url}`}
                              alt={item.product_name}
                              className="w-8 h-8 rounded-full border-2 border-white object-cover"
                            />
                            {item.quantity > 1 && (
                              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium text-[10px]">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600 font-medium">
                              +{order.items.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.items.length === 1
                        ? order.items[0].product_name
                        : `${order.items.length} items`}
                    </p>
                  </div>

                  {/* Total and Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-lg font-bold text-emerald-600">
                      ₹{order.total_price.toFixed(2)}
                    </span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order.order_id);
                        }}
                        className="text-sm text-emerald-600 font-medium"
                      >
                        View Details
                      </button>
                      {order.tracking_number && (
                        <>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/track-order/${order.order_id}`);
                            }}
                            className="text-sm text-blue-600 font-medium"
                          >
                            Track
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile Pagination */}
              {totalPages > 1 && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-300"
                          : "bg-white text-gray-700 border border-gray-300"
                      }`}
                    >
                      Previous
                    </button>
                    
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-300"
                          : "bg-white text-gray-700 border border-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;