import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const   SearchBar = ({ mobile }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], decor_services: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults({ products: [], decor_services: [] });
        setShowDropdown(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://partydecorhub.com/api/search?query=${query}`
        );
        setResults({
          products: response.data.products || [],
          decor_services: response.data.decor_services || [],
        });
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults({ products: [], decor_services: [] });
        setShowDropdown(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const toggleSearch = () => {
    if (mobile) return;
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus input when expanding
      setTimeout(() => {
        const input = searchRef.current?.querySelector("input");
        input?.focus();
      }, 100);
    } else {
      setQuery("");
      setShowDropdown(false);
    }
  };

  const totalResults = results.products.length + results.decor_services.length;

  return (
    <motion.div
      ref={searchRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`${
        mobile
          ? "absolute top-14 left-0 w-full shadow-md z-50 px-4 py-2"
          : "relative flex items-center justify-end w-24"
      }`}
      style={
        mobile && {
          backgroundImage: "url('../images/bg-with-doodle.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      }
    >
      {mobile ? (
        // Mobile view (unchanged)
        <div className="relative flex items-center border border-gray-300 rounded-full bg-white shadow-sm overflow-hidden h-10 w-full">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => totalResults > 0 && setShowDropdown(true)}
            onBlur={handleBlur}
            className="w-full m-0 outline-none bg-transparent text-gray-700 border-none h-full px-4"
          />
          <button className="w-10  bg-green-900 flex items-center justify-center rounded-r-full hover:bg-green-600 transition h-full">
            <FiSearch className="text-white text-lg" />
          </button>
        </div>
      ) : (
        // Desktop view (new behavior)
        <div className="relative">
          <button
            onClick={toggleSearch}
            className="p-2 rounded-full text-green-900 hover:text-green-700 hover:bg-gray-100 transition-colors"
          >
            <FiSearch className="text-2xl" />
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute right-0 top-1 flex items-center bg-white rounded-full shadow-md overflow-hidden"
                style={{ height: "35px" }}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => totalResults > 0 && setShowDropdown(true)}
                  onBlur={handleBlur}
                  className="w-44 m-0 outline-none bg-transparent text-gray-700 border-none h-full px-4"
                />
                <button className="w-10 bg-green-900 flex items-center justify-center hover:bg-green-600 transition h-full">
                  <FiSearch className="text-white text-lg" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`absolute ${
            mobile
              ? "left-4 right-4"
              : "left-auto right-auto w-96" // Changed from w-96 to w-64 to match input width
          } top-full bg-white shadow-lg rounded-lg z-50 border border-gray-300 max-h-60 overflow-y-auto overflow-x-hidden `}
        >
          {totalResults > 0 ? (
            <>
              {results.products.length > 0 && (
                <div className="px-1 py-2 bg-green-200 text-gray-600 text-xs font-semibold sticky top-0">
                  Products
                </div>
              )}
              {results.products.map((product) => (
                <motion.div
                  key={`product-${product.product_id}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex justify-between items-center px-0 py-2 text-gray-800 border-b last:border-none border-gray-200 hover:bg-green-50 transition-all cursor-pointer whitespace-nowrap overflow-hidden"
                  onClick={() => setShowDropdown(false)}
                >
                  <Link
                    to={`/products/${product.product_id}`}
                    className="flex justify-between items-center w-full no-underline text-gray-800 hover:bg-green-50 hover:scale-105 transition-all duration-300 rounded-lg px-4 py-2"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="font-medium text-sm truncate">
                      {product.name}
                    </span>
                    <span className="text-green-800 font-semibold text-sm ml-4">
                      ₹{product.price}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {results.decor_services.length > 0 && (
                <div className="px-3 py-2 bg-green-200 text-gray-600 text-xs font-semibold sticky top-0">
                  Services
                </div>
              )}
              {results.decor_services.map((service) => (
                <motion.div
                  key={`service-${service.id}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex justify-between items-center px-0 py-2 text-gray-800 border-b last:border-none border-gray-200 hover:bg-green-50 transition-all cursor-pointer whitespace-nowrap overflow-hidden"
                  onClick={() => setShowDropdown(false)}
                >
                  <Link
                    to={`/services/${service.id}`}
                    className="flex justify-between items-center w-full no-underline text-gray-800 hover:bg-green-50 hover:scale-105 transition-all duration-300 rounded-lg px-4 py-2"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="font-medium text-sm truncate">
                      {service.name}
                    </span>
                    <span className="text-green-800 font-semibold text-sm ml-4">
                      ₹{service.price}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </>
          ) : (
            <div className="px-4 py-2 text-gray-500 text-center text-sm">
              No results found
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchBar;