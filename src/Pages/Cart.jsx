import React, { useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import useGetCartItems from "../hooks/cart/useGetCartItems.js";
import useRemoveItem from "../hooks/cart/useRemoveItem.js";
import useUpdateQuantity from "../hooks/cart/useUpdateCartItems.js";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const removeItem = useRemoveItem();
  const updateQuantity = useUpdateQuantity();


  // Fetch cart items once on component mount
  useGetCartItems();

  // Memoize calculations
  const { subTotal, total, totalItems } = useMemo(() => {
    const subTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    // const tax = 2;
    const total = subTotal;
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    return { subTotal, total, totalItems };
  }, [cartItems]);

  const onCheckout = useCallback(() => {
    navigate("/checkout");
  }, [navigate]);

  const handleQuantityChange = useCallback(
    async (itemId, newQuantity) => {
      if (newQuantity > 0) {
        const result = await updateQuantity(itemId, newQuantity);
        
        // Check if we need to handle a decrement
        if (result && result.shouldDecrement) {
          await removeItem(result.decrementData);
        }
      } else {
        // Remove the entire item if quantity is 0 or negative
        const itemToRemove = cartItems.find(item => item.id === itemId);
        if (itemToRemove) {
          await removeItem(itemToRemove);
        }
      }
    },
    [cartItems, removeItem, updateQuantity]
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty!</h2>
          <p className="text-gray-600 mb-4">Browse products and add items to your cart.</p>
          <Link to="/home">
            <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
              Go Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 mb-6 relative inline-block">
          Your Cart
          <span className="block w-16 h-1 bg-green-500 mx-auto mt-2 rounded-full"></span>
        </h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-200 text-green-800">
                  <th className="py-3 px-4 text-left font-medium">Image</th>
                  <th className="py-3 px-4 text-left font-medium">Name</th>
                  <th className="py-3 px-4 text-left font-medium">Price</th>
                  <th className="py-3 px-4 text-center font-medium">Quantity</th>
                  <th className="py-3 px-4 text-center font-medium">Total</th>
                  <th className="py-3 px-4 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <tr key={item.product_id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-3 px-4">
                      <img
                        className="h-16 w-16 object-cover rounded border border-gray-200"
                        src={item.thumbnail}
                        alt={item.name}
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800 text-left">
                      {item.name || item.product_name}
                      <div className="text-sm text-gray-500 font-normal p-1">
                        {item.color && Array.isArray(item.color) && item.color.length > 0 && 
                          `Color: ${item.color.join(', ')}`}
                        {item.color && !Array.isArray(item.color) && 
                          `Color: ${item.color}`}
                        {item.size && ` | Size: ${item.size}`}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">₹{item.price}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 text-red-500 hover:text-gray-700 rounded-full transition-colors duration-200"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <span className="text-lg font-bold">-</span>
                        </button>
                        <span className="w-10 m-0 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 m-0 flex items-center justify-center border border-gray-300 text-green-500 hover:text-green-700 rounded-full transition-colors duration-200"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <span className="text-lg font-bold">+</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-gray-800">
                      ₹{item.price * item.quantity}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 text-red-500 hover:text-red-700 rounded-full transition-colors duration-200"
                        onClick={() => removeItem(item)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t bg-white px-4 py-3 sm:px-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-6 text-sm sm:text-base text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Items:</span>
                  <span className="font-medium text-green-600">{totalItems}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-semibold text-green-700">₹{total}</span>
                </div>
              </div>
              <button
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md transition"
                onClick={onCheckout}
              >
                Checkout
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;