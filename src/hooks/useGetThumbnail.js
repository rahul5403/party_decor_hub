import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { storeThumbnail } from "../redux/cartSlice";

const useGetThumbnail = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  console.log(cartItems);

  useEffect(() => {
    const getThumbnail = async () => {
      try {
        const requests = cartItems.map(async (item) => {
          const res = await axios.get(
            `https://partydecorhub.com/api/products/${item.product_id}`

          );
          console.log(res.data.thumbnail);

          dispatch(
            storeThumbnail({
              product_id: item.product_id,
              thumbnail: res.data.thumbnail,
            })
          );
        });

        await Promise.all(requests); // Ensure all API calls complete before moving forward
      } catch (error) {
        console.error(error);
      }
    };

    if (cartItems.length > 0) {
      getThumbnail();
    }
  }, [cartItems, dispatch]);
};

export default useGetThumbnail;