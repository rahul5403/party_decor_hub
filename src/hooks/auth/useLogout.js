import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { logout } from "../../redux/authSlice";
import { mergeCart } from "../../redux/cartSlice";
const useLogout = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      if (token) {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      dispatch(logout());
      dispatch(mergeCart([]));
      toast.success("Logout successful!");
      return true;
    } catch (error) {
      toast.error("Logout failed, please try again.");
      return false;
    }
  };

  return handleLogout;
};

export default useLogout;

