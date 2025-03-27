import { useState, useEffect } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { BsCartFill } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { toast } from "react-toastify";
import axios from "axios";
import logoh from "../assets/images/logo.png";
import { mergeCart } from "../redux/cartSlice";
import useGetCartItems from "../hooks/useGetCartItems";
import { motion } from "framer-motion";

const NavBar = ({ onLoginClick }) => {
  const cartCount = useSelector((state) => state.cart.cartCount);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dispatch = useDispatch();
  useGetCartItems();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUserLoggedIn(false);
        return;
      }
      try {
        const response = await axios.get(
          "https://partydecorhub.com/api/check-auth",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserLoggedIn(response.data.is_logged_in);
      } catch (error) {
        setUserLoggedIn(false);
      }
    };
    checkAuth();
  }, [localStorage.getItem("accessToken")]);

  const handleLogout = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      if (token) {
        await axios.post(
          "https://partydecorhub.com/api/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      localStorage.removeItem("accessToken");
      setUserLoggedIn(false);
      dispatch(logout());
      dispatch(mergeCart([]));
      toast.success("Logout successful!");
    } catch (error) {
      toast.error("Logout failed, please try again.");
    }
  };

  return (
    <nav
      className="bg-cover bg-center p-2 relative z-50"
      style={{ backgroundImage: "url('../images/bg-with-doodle.png')" }}
    >
      {/* Desktop View */}
      <div className="hidden md:flex justify-between items-center max-w-7xl mx-auto py-2">
        <div>
          <Link to="/">
            <img src={logoh} alt="Logo" className="h-12 w-auto" />
          </Link>
        </div>

        <div className="w-full flex justify-center">
        <ul className="flex space-x-10 font-semibold text-green-900 text-lg items-center">
            <li>
              <Link
                to="/home"
                className="no-underline text-green-900 relative transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-green-900 before:transition-all before:duration-300 hover:before:w-full hover:text-green-700"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/party"
                className="no-underline text-green-900 relative transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-green-900 before:transition-all before:duration-300 hover:before:w-full hover:text-green-700"
              >
                Decoration Items
              </Link>
            </li>
            <li>
              <Link
                to="/decoration"
                className="no-underline text-green-900 relative transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-green-900 before:transition-all before:duration-300 hover:before:w-full hover:text-green-700"
              >
                Decoration Services
              </Link>
            </li>
            <li>
              <Link
                to="/desposable"
                className="no-underline text-green-900 relative transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-green-900 before:transition-all before:duration-300 hover:before:w-full hover:text-green-700"
              >
                Disposable Items
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="no-underline text-green-900 relative transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-green-900 before:transition-all before:duration-300 hover:before:w-full hover:text-green-700"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-full px-4 py-1 outline-none"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-900" />
          </div>
          <Link to="/cart">
            <div className="relative">
              <BsCartFill className="text-green-900 text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
          {userLoggedIn ? (
            <FiUser
              className="text-green-900 text-3xl cursor-pointe"
              onClick={handleLogout}
            />
          ) : (
            <FiUser
              className="text-green-900 text-3xl cursor-pointer"
              onClick={onLoginClick}
            />
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex justify-between items-center p-2">
        <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <HiX className="text-2xl text-green-900" />
          ) : (
            <HiMenu className="text-2xl text-green-900" />
          )}
        </button>
        <Link to="/">
          <img src={logoh} alt="Logo" className="h-12 w-auto" />
        </Link>

        <div className="flex items-center space-x-4">
          {/* Search Icon for Mobile */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden"
          >
            <FiSearch className="text-green-900 text-2xl" />
          </button>

          <Link to="/cart">
            <div className="relative">
              <BsCartFill className="text-green-900 text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
          {userLoggedIn ? (
            <FiUser
              className="text-green-900 text-2xl cursor-pointer"
              onClick={handleLogout}
            />
          ) : (
            <FiUser
              className="text-green-900 text-2xl cursor-pointer"
              onClick={onLoginClick}
            />
          )}
        </div>
      </div>

      {/* Mobile Search Input */}
      {isSearchOpen && (
        <div className="md:hidden flex justify-center mt-2">
          <div className="relative w-3/4">
            <input
              type="text"
              placeholder="Search..."
              className="border border-green-900 rounded-full px-4 py-1 outline-none w-full"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-900" />
          </div>
        </div>
      )}




{isOpen && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="md:hidden absolute top-16 left-0 w-full bg-[#f9f8ef] shadow-md py-4 px-6"
    style={{
      backgroundImage: "url('../images/bg-with-doodle.png')",
    }}
  >
    <ul className="space-y-4 text-center text-green-900 font-semibold">
            <li>
              <Link
                to="/home"
                className="no-underline text-green-900 relative transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-green-900 before:transition-all before:duration-300 hover:before:w-full hover:text-green-700"
                onClick={() => setIsOpen(false)}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/party"
                className="no-underline text-green-900 relative transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-green-900 before:transition-all before:duration-300 hover:before:w-full hover:text-green-700"
                onClick={() => setIsOpen(false)}
              >
                DECORATION ITEMS
              </Link>
            </li>
            <li>
              <Link
                to="/decoration"
                className="no-underline text-green-900 relative transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-green-900 before:transition-all before:duration-300 hover:before:w-full hover:text-green-700"
                onClick={() => setIsOpen(false)}
              >
                DECORATION SERVICES
              </Link>
            </li>
            <li>
              <Link
                to="/disposable"
                className="no-underline text-green-900 relative transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-green-900 before:transition-all before:duration-300 hover:before:w-full hover:text-green-700"
                onClick={() => setIsOpen(false)}
              >
                DISPOSABLE ITEMS
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="no-underline text-green-900 relative transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-green-900 before:transition-all before:duration-300 hover:before:w-full hover:text-green-700"
                onClick={() => setIsOpen(false)}
              >
                ABOUT US
              </Link>
            </li>
          </ul>
  </motion.div>
)}
    </nav>
  );
};

export default NavBar;