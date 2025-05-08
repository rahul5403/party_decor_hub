// useUpdateQuantity.js
import { useDispatch, useSelector } from "react-redux";
import { updateQuantity } from "../../redux/cartSlice";
import useSetCartItems from "./useSetCartItems";
import useRemoveItem from "./useRemoveItem";

const useUpdateQuantity = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const addItemToCart = useSetCartItems();
  const removeItemFunc = useRemoveItem();
  
  const updateItemQuantity = async (itemId, newQuantity) => {
    // Find the item in cart
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    if (!item) {
      console.error("Item not found in cart with ID:", itemId);
      return;
    }

    const currentQuantity = item.quantity;
    const difference = newQuantity - currentQuantity;
    
    if (difference === 0) return; // No change needed

    // Update local Redux state using updateQuantity action
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));

    // Only make API calls if user is logged in
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      if (difference > 0) {
        // Increment - wrap data in an array
        const incrementData = [{
          product_id: item.product_id,
          quantity: Math.abs(difference),
          color: item.color || null,
          size: item.size || null
        }];
        
        await addItemToCart(incrementData);
      } else {
        // Decrement - use existing removeItem hook
        const tempItem = {
          ...item,
          product_id: item.product_id,
          quantity: Math.abs(difference)
        };
        
        await removeItemFunc(tempItem);
      }
    } catch (error) {
      console.error("API error during quantity update:", error);
      // Revert local state if API call fails
      dispatch(updateQuantity({ id: itemId, quantity: currentQuantity }));
    }
  };

  return updateItemQuantity;
};

export default useUpdateQuantity;