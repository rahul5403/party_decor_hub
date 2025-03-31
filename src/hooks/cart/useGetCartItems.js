import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { mergeCart } from "../../redux/cartSlice";

const useGetCartItems = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const getItems = async () => {
      try {
        const res = await axios.get("https://partydecorhub.com/api/cart", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const fullItems = res.data.items.map(item => ({
          ...item,
          thumbnail: `https://partydecorhub.com${item.thumbnail}`,
        }));
        dispatch(mergeCart(fullItems)); 
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    getItems();
  }, [dispatch]);

  return null; 
};

export default useGetCartItems;