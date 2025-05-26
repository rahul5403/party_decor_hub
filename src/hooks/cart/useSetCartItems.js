import axios from "axios";

const useSetCartItems = () => {
  const accessToken = localStorage.getItem("accessToken");

  const addItemToCart = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/cart/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return addItemToCart;
};

export default useSetCartItems;