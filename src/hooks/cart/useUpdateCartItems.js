import { useDispatch } from "react-redux";
import { updateQuantity as updateQuantityAction } from "../../redux/cartSlice";

const useUpdateQuantity = () => {
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

  const updateQuantity = async (id, quantity) => {
    // Update local state via Redux
    dispatch(updateQuantityAction({ id, quantity }));

    // If user is not logged in, we're done
    if (!accessToken) return;

    // For API calls, we don't need to do anything here as the 
    // increment/decrement is now handled directly in Cart.jsx
    // through useSetCartItems and useRemoveItem hooks
  };

  return updateQuantity;
};

export default useUpdateQuantity;