import { useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { mergeCart } from "../../redux/cartSlice";

const useGetCartItems = () => {
  const dispatch = useDispatch();

  const getItems = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const fullItems = res.data.items.map(item => ({
        ...item,
        thumbnail: `${process.env.REACT_APP_BASE_URL}${item.thumbnail}`,
      }));
      dispatch(mergeCart(fullItems));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  return getItems; // Now it's accessible to be called manually
};

export default useGetCartItems;
