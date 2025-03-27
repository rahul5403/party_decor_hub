import { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SearchBar = ({ mobile }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://partydecorhub.com/api/search?query=${query}`
        );
        setResults(response.data.products || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`${
        mobile
          ? "absolute top-14 left-0 w-full shadow-md z-50 px-4 py-2"
          : "relative w-full max-w-md mx-auto"
      }`}
      style={
        mobile && {
          backgroundImage: "url('../images/bg-with-doodle.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      }
    >
      <div className="relative flex items-center border border-gray-300 rounded-full bg-white shadow-sm overflow-hidden h-10 w-full">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onBlur={handleBlur}
          className="w-full m-0 outline-none bg-transparent text-gray-700 border-none h-full px-4"
        />
        <button className="w-10 bg-green-900 flex items-center justify-center rounded-r-full hover:bg-green-600 transition h-full">
          <FiSearch className="text-white text-lg" />
        </button>
      </div>

      {showDropdown && (
  <motion.div
    initial={{ opacity: 0, y: -10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.95 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
    className={`absolute ${
      mobile ? "left-4 right-4" : "left-0 right-0 w-96 "
    } top-full bg-white shadow-lg rounded-lg z-50 border border-gray-300 max-h-60 overflow-y-auto overflow-x-hidden`}
  >
    {results.length > 0 ? (
      results.map((product) => (
        <motion.div
          key={product.product_id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex justify-between items-center px-4 py-2 text-gray-800 border-b last:border-none border-gray-200 hover:bg-gray-100 transition-all cursor-pointer whitespace-nowrap overflow-hidden"
          onClick={() => setShowDropdown(false)}
        >
          <Link
            key={product.product_id}
            to={`/products/${product.product_id}`}
            className="flex justify-between items-center w-full no-underline text-gray-800 hover:bg-gray-100 hover:scale-105 transition-all duration-300 rounded-lg px-4 py-2"
            onClick={() => setShowDropdown(false)}
          >
            <span className="font-medium text-sm truncate">{product.name}</span>
            <span className="text-green-600 font-semibold text-sm ml-4">
              ₹{product.price}
            </span>
          </Link>
        </motion.div>
      ))
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
