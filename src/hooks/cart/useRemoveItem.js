import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart, updateQuantity } from "../../redux/cartSlice";

const useRemoveItem = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const removeItem = async (item, decrementOnly = false) => {
    if (!item) return;

    // Determine the quantity to remove
    const quantityToRemove = decrementOnly && item.quantity > 1 ? 1 : item.quantity;
    
    // Prepare API request data
    const data = {
      product_id: item.product_id,
      quantity: quantityToRemove,
    };

    // Update local state based on removal type
    if (decrementOnly && item.quantity > 1) {
      // Just decrement quantity
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
    } else {
      // Remove the entire item
      const updatedCart = cartItems.filter(
        (cartItem) => cartItem.product_id !== item.product_id
      );
      dispatch(mergeCart(updatedCart));
    }

    // Make a single API call if user is logged in
    if (accessToken) {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/cart/remove`,
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
  };

  return removeItem;
};

export default useRemoveItem;