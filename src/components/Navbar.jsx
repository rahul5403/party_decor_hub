import { useState, useEffect, useCallback } from "react";
import { FiUser, FiSearch } from "react-icons/fi";
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
import SearchBar from "./SearchBar";

const NavLink = ({ to, children, onClick, mobile }) => (
  <li>
    <Link
      to={to}
      className={`no-underline text-green-900 relative transition-all duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-green-900 before:transition-all before:duration-300 hover:before:w-full hover:text-green-700 ${
        mobile ? "text-lg" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  </li>
);

const NavBar = ({ onLoginClick }) => {
  const cartCount = useSelector((state) => state.cart.cartCount);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dispatch = useDispatch();
  useGetCartItems();

  const checkAuth = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = useCallback(async () => {
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
  }, [dispatch]);

  const navLinks = [
    { to: "/home", text: "Home" },
    { to: "/party", text: "Decoration Items" },
    { to: "/decoration", text: "Decoration Services" },
    { to: "/disposable", text: "Disposable Items" },
    { to: "/about", text: "About Us" },
  ];

  return (
    <nav
      className="bg-cover bg-center p-1 relative z-20"
      style={{ backgroundImage: "url('../images/bg-with-doodle.png')" }}
    >
      {/* Desktop View */}
      <div className="hidden md:flex justify-between items-center max-w-7xl mx-auto py-1">
        <div>
          <Link to="/">
            <img src={logoh} alt="Logo" className="h-12 w-auto" />
          </Link>
        </div>

        <div className="w-[80%] flex justify-center">
          <ul className="flex space-x-10 font-semibold text-green-900 text-lg items-center m-0">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.text}
              </NavLink>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-4">
          <SearchBar />
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
          <FiUser
            className="text-green-900 text-3xl cursor-pointer"
            onClick={userLoggedIn ? handleLogout : onLoginClick}
          />
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
          <FiUser
            className="text-green-900 text-2xl cursor-pointer"
            onClick={userLoggedIn ? handleLogout : onLoginClick}
          />
        </div>
      </div>

      {isSearchOpen && <SearchBar mobile />}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden absolute top-16 left-0 w-full bg-[#f9f8ef] shadow-md py-4 px-6"
        >
          <ul className="space-y-4 text-center text-green-900 font-semibold p-0">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} mobile onClick={() => setIsOpen(false)}>
                {link.text}
              </NavLink>
            ))}
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default NavBar;
