import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/cartSlice";

const useRemoveItem = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const removeItem = async (item) => {
    if (!item) return;

    console.log(item);
    const data = {
      product_id: item.product_id,
      quantity: item.quantity,
    };

    // Remove item from local Redux store
    const updatedCart = cartItems.filter(
      (cartItem) => cartItem.product_id !== item.product_id
    );
    dispatch(mergeCart(updatedCart));

    try {
      const res = await axios.post(
        "https://partydecorhub.com/api/cart/remove",
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return removeItem;
};

export default useRemoveItem;
