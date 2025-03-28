import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/cartSlice";

const useRemoveItem = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const removeItem = async (item) => {
    if (!item) return;

    const data = {
      product_id: item.product_id,
      quantity: item.quantity,
    };

    const updatedCart = cartItems.filter(
      (cartItem) => cartItem.product_id !== item.product_id
    );
    dispatch(mergeCart(updatedCart));

    if(accessToken){
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
    }
  };

  return removeItem;
};

export default useRemoveItem;
