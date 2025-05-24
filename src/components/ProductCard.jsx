import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useSetCartItems from "../hooks/cart/useSetCartItems.js";
import useRemoveItem from "../hooks/cart/useRemoveItem.js";
import { addToCart, mergeCart } from "../redux/cartSlice";
import axios from "axios";

const ProductCard = ({ product, section }) => {
  const navigate = useNavigate();
  const addItemToCart = useSetCartItems();
  const removeItem = useRemoveItem();
  const dispatch = useDispatch();
  
  // Use auth state from Redux instead of localStorage
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cartItems);
  
  // State to track if item is in cart and its quantity
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(0);

  // Check if product is already in cart and update state
  useEffect(() => {
    const existingItem = cartItems.find(item => item.product_id === String(product.id));
    if (existingItem) {
      setIsInCart(true);
      setQuantity(existingItem.quantity);
    } else {
      setIsInCart(false);
      setQuantity(0);
    }
  }, [cartItems, product.id]);

  const getButtonText = (section) => {
    switch (section) {
      case "Decoration Items":
      case "Disposable Items":
        return "Add to Cart";
      case "Decoration Services":
        return "Enquiry Now";
      default:
        return "Add to Cart";
    }
  };

  const buttonText = getButtonText(section);
  const isAddToCartButton = buttonText === "Add to Cart";

  const handleNavigation = () => {
    if (section === "Decoration Services") {
      navigate(`/services/${product.id}`, { state: { product } });
    } else {
      navigate(`/products/${product.id}`, { state: { product } });
    }
  };

  const createCartItem = (product, qty = 1) => {
    return {
      id: String(product.id),
      product_id: String(product.id),
      quantity: qty,
      color: Array.isArray(product.colors) && product.colors.length > 0
        ? product.colors[0]
        : null,
      size: Array.isArray(product.sizes) && product.sizes.length > 0
        ? product.sizes[0]
        : null,
      price: product.price,
      name: product.title || product.name,
      thumbnail: product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : ''),
      images: product.images || [product.image],
    };
  };

  const handleAddToCart = (product) => {
    const item = createCartItem(product);

    // Check auth state from Redux instead of localStorage
    if (!isAuthenticated) {
      dispatch(addToCart(item));
    } else {
      addItemToCart([item]);
      dispatch(addToCart(item));
    }
    
    setIsInCart(true);
    setQuantity(1);
  };

  // Function to handle increment
  const handleIncrement = useCallback(async () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    
    const item = createCartItem(product, newQuantity);
    
    // Update Redux store
    const updatedItems = cartItems.map(cartItem => {
      if (cartItem.product_id === String(product.id)) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });
    
    if (updatedItems.length === cartItems.length) {
      dispatch(mergeCart(updatedItems));
    } else {
      dispatch(addToCart(item));
    }
    
    // Then call API if logged in
    if (isAuthenticated) {
      try {
        await addItemToCart([{
          product_id: String(product.id),
          quantity: 1,
          size: item.size,
          color: item.color
        }]);
      } catch (error) {
        console.error("Error incrementing item:", error);
        // Revert on error
        setQuantity(quantity);
      }
    }
  }, [quantity, product, cartItems, isAuthenticated, dispatch, addItemToCart]);

  // Function to handle decrement
  const handleDecrement = useCallback(async () => {
    if (quantity <= 1) {
      // If quantity is 1, remove the item
      setIsInCart(false);
      setQuantity(0);
      
      const itemToRemove = createCartItem(product);
      await removeItem(itemToRemove);
      return;
    }
    
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    
    // First update local state
    const updatedItems = cartItems.map(cartItem => {
      if (cartItem.product_id === String(product.id)) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });
    
    dispatch(mergeCart(updatedItems));
    
    // Then call API if logged in
    if (isAuthenticated) {
      const accessToken = localStorage.getItem("accessToken");
      try {
        await axios.post(
          "https://partydecorhub.com/api/cart/remove",
          {
            product_id: String(product.id),
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Error decrementing item:", error);
        // Revert on error
        setQuantity(quantity);
      }
    }
  }, [quantity, product, cartItems, isAuthenticated, dispatch, removeItem]);

  const handleButtonClick = (e) => {
    e.stopPropagation();
    
    if (isAddToCartButton && !isInCart) {
      handleAddToCart(product);
    } else if (!isAddToCartButton) {
      handleNavigation();
    }
  };

  return (
    <div 
className="flex flex-col items-center w-full max-w-[190px] sm:max-w-[250px] h-[300px] sm:h-[420px] bg-white shadow-md rounded-lg p-2 sm:p-4 transition-transform hover:scale-105"    >
      {/* Image Covering 75% of Card */}
      <div className="w-full h-[85%] aspect-[4/3] overflow-hidden rounded-lg">
        <img
          src={product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '')}
          alt={product.title || product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Title with Fixed Height */}
      <h3 className="mt-1 mb-0 text-sm font-semibold text-center w-full h-[35px] overflow-hidden text-ellipsis whitespace-nowrap">
        {product.title || product.name}
      </h3>

      {/* Price Section */}
      <p className="text-gray-600 m-0.5 text-sm w-full text-center">
        {product.discounted_price ? (
          <>
            ₹{product.discounted_price}
            {product.price && (
              <span className="line-through text-gray-400 ml-2">
                ₹{product.price}
              </span>
            )}
          </>
        ) : product.price ? (
          `₹${product.price}`
        ) : (
          "Price not available"
        )}
      </p>

      {/* Button Section */}
      {isAddToCartButton && isInCart ? (
        <div 
          className="flex items-center justify-center w-[80%] mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-300 text-red-500 hover:text-gray-700 rounded-full transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleDecrement();
            }}
          >
            <span className="text-lg font-bold">-</span>
          </button>
          <span className="w-10 mx-2 text-center font-medium">
            {quantity}
          </span>
          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-300 text-green-500 hover:text-green-700 rounded-full transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleIncrement();
            }}
          >
            <span className="text-lg font-bold">+</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleButtonClick}
          className="bg-green-900 text-white text-sm py-2 px-4 rounded-md mt-2 h-10 w-[80%] transition-all duration-200 transform hover:scale-[1.02]"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default ProductCard;