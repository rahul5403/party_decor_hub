import { useState, useEffect } from "react";
import { FiUser, FiSearch } from "react-icons/fi";
import { BsCartFill } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logoh from "../assets/images/logo.png";
import useGetCartItems from "../hooks/cart/useGetCartItems.js";
import useLogout from "../hooks/auth/useLogout.js";
import { motion, AnimatePresence } from "framer-motion";
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
  // const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(cartCount);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const handleLogout = useLogout();
  
  // Include the useGetCartItems hook in component
  const getItems = useGetCartItems();
  
  // Use effect to call the fetcher function when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getItems();
    }
  }, [isAuthenticated, getItems]);

  // Add effect to detect cart changes and show notification
  useEffect(() => {
    if (cartCount > prevCartCount) {
      setIsCartAnimating(true);
      setTimeout(() => setIsCartAnimating(false), 800);
    }
    
    setPrevCartCount(cartCount);
  }, [cartCount, prevCartCount]);

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      setShowUserDropdown(!showUserDropdown);
    } else {
      onLoginClick();
    }
  };

  const navLinks = [
    { to: "/home", text: "Home" },
    { to: "/party", text: "Decoration Items" },
    { to: "/decoration", text: "Decoration Services" },
    { to: "/disposable", text: "Disposable Items" },
    { to: "/about", text: "About Us" },
  ];

  // Cart icon animation variants
  const cartIconVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] },
  };

  // Cart count badge animation variants
  const cartCountVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  };

  return (
    <>
      <nav
        className="bg-cover bg-center p-1 fixed top-0 left-0 right-0 w-full z-30 shadow-md"
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

          <div className="flex items-center space-x-5 relative">
            <SearchBar />
            <Link to="/cart">
              <div className="relative">
                <motion.div
                  variants={cartIconVariants}
                  initial="initial"
                  animate={isCartAnimating ? "animate" : "initial"}
                  transition={{ duration: 0.5 }}
                >
                  <BsCartFill className="text-green-900 text-2xl" />
                </motion.div>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      variants={cartCountVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] h-[18px] flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
            <div className="relative">
              <FiUser
                className="text-green-900 text-2xl cursor-pointer"
                onClick={handleUserIconClick}
              />
              <AnimatePresence>
                {isAuthenticated && showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-200"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-5 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 no-underline"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <i className="fas fa-user-circle text-lg text-gray-500 no-underline"></i>
                      My Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-3 px-5 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 no-underline"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <i className="fas fa-box text-lg text-gray-500"></i>
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center gap-3 w-full text-left px-5 py-2 text-sm text-red-600 font-medium hover:bg-red-50 transition-all duration-200"
                    >
                      <i className="fas fa-sign-out-alt text-lg text-red-500"></i>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                <motion.div
                  variants={cartIconVariants}
                  initial="initial"
                  animate={isCartAnimating ? "animate" : "initial"}
                  transition={{ duration: 0.5 }}
                >
                  <BsCartFill className="text-green-900 text-2xl" />
                </motion.div>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      variants={cartCountVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[18px] h-[18px] flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
            <div className="relative">
              <FiUser
                className="text-green-900 text-2xl cursor-pointer"
                onClick={handleUserIconClick}
              />
              <AnimatePresence>
                {isAuthenticated && showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-200"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-5 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 no-underline"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <i className="fas fa-user-circle text-lg text-gray-500"></i>
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-5 py-2 text-sm text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 no-underline"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <i className="fas fa-box text-lg text-gray-500"></i>
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center gap-3 w-full text-left px-5 py-2 text-sm text-red-600 font-medium hover:bg-red-50 transition-all duration-200 no-underline"
                    >
                      <i className="fas fa-sign-out-alt text-lg text-red-500"></i>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {isSearchOpen && <SearchBar mobile />}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden absolute top-16 left-0 w-full bg-[#f9f8ef] shadow-md py-4 px-6 z-50"
            >
              <ul className="space-y-4 text-center text-green-900 font-semibold p-0">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    mobile
                    onClick={() => setIsOpen(false)}
                  >
                    {link.text}
                  </NavLink>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Add spacing to prevent content from hiding behind the fixed navbar */}
      <div className="h-[60px] md:h-[56px]"></div>
    </>
  );
};

export default NavBar;