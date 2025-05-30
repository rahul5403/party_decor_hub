import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { FaFilter, FaSortAmountDown, FaTimes, FaRupeeSign, FaCheck, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { addToCart, mergeCart } from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import useSetCartItems from "../hooks/cart/useSetCartItems.js";
import useRemoveItem from "../hooks/cart/useRemoveItem.js";

const BASE_IMAGE_URL = process.env.REACT_APP_BASE_URL  ;

const DecorPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [partyData, setPartyData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState([]);
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");
  const addItemToCart = useSetCartItems();
  const removeItem = useRemoveItem();
  const [expandedComboFilter, setExpandedComboFilter] = useState(false);
  const [hoveredCombo, setHoveredCombo] = useState(false);
  const [comboFilters, setComboFilters] = useState([]);
  const [regularFilters, setRegularFilters] = useState([]);
  
  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Refs for positioning
  const comboFilterRef = useRef(null);
  const comboDropdownRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedFilters.length > 0) {
          params.append("filters", selectedFilters.join(","));
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/products?${params.toString()}`
        );
        let products = response.data.map((product) => ({
          id: product.product_id || product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.price + 10,
          description: product.category,
          image: BASE_IMAGE_URL + product.thumbnail,
          images: [BASE_IMAGE_URL + product.thumbnail],
          colors: product.colors || [],
          sizes: product.sizes || [],
        }));

        if (selectedFilters.length === 0) {
          products = products.filter(
            (product) => product.description === "Party Decor"
          );
        }

        if (sortOrder === "low-high") {
          products.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "high-low") {
          products.sort((a, b) => b.price - a.price);
        }

        setPartyData(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedFilters, sortOrder]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/filters`);
        const data = await response.json();

        const partyDecorFilters = data.find(category => category.category === "Party Decor")?.filters || [];
        
        // Separate combo filters from regular filters
        const comboFiltersList = partyDecorFilters.filter(filter => 
          filter.name.toLowerCase().includes('combo')
        );
        
        const regularFiltersList = partyDecorFilters.filter(filter => 
          !filter.name.toLowerCase().includes('combo')
        );
        
        setComboFilters(comboFiltersList);
        setRegularFilters(regularFiltersList);
        setFilters(regularFiltersList); // Initially show only regular filters
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  // Handle click outside to close combo dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        comboDropdownRef.current && 
        !comboDropdownRef.current.contains(event.target) &&
        comboFilterRef.current &&
        !comboFilterRef.current.contains(event.target)
      ) {
        setHoveredCombo(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [comboDropdownRef, comboFilterRef]);

  // Add useEffect to position dropdown correctly
  useEffect(() => {
    if (hoveredCombo && comboFilterRef.current && comboDropdownRef.current) {
      const filterRect = comboFilterRef.current.getBoundingClientRect();
      comboDropdownRef.current.style.left = `${filterRect.right + 10}px`;
      comboDropdownRef.current.style.top = `${filterRect.top}px`;
    }
  }, [hoveredCombo]);

  const handleFilterChange = (filterName) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filterName)
        ? prevFilters.filter((f) => f !== filterName)
        : [...prevFilters, filterName]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`, { state: { product } });
  };

  const handleMobileSort = (order) => {
    setSortOrder(order);
    setShowSortOptions(false);
  };

  // Function to create a cart item object
  const createCartItem = (product, qty = 1) => {
    return {
      id: String(product.id),
      product_id: String(product.id),
      quantity: qty,
      color: Array.isArray(product.colors) && product.colors.length > 0
        ? product.colors[0]
        : null,
      size: Array.isArray(product.sizes) && product.sizes.length > 0
        ? product.sizes[0]
        : null,
      price: product.price,
      name: product.name,
      thumbnail: product.image,
      images: product.images,
    };
  };

  const handleAddToCart = (product) => {
    const item = createCartItem(product);

    if (!isAuthenticated) {
      dispatch(addToCart(item));
    } else {
      addItemToCart([item]);
      dispatch(addToCart(item));
    }
  };

  // Function to check if product is in cart
  const isProductInCart = (productId) => {
    return cartItems.some(item => item.product_id === String(productId));
  };

  // Function to get quantity of product in cart
  const getProductQuantity = (productId) => {
    const item = cartItems.find(item => item.product_id === String(productId));
    return item ? item.quantity : 0;
  };

  // Function to handle increment
  const handleIncrement = useCallback(async (product) => {
    const productId = String(product.id);
    const existingItem = cartItems.find(item => item.product_id === productId);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
    
    // First update local state
    const updatedItems = cartItems.map(cartItem => {
      if (cartItem.product_id === productId) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });
    
    if (updatedItems.length === cartItems.length) {
      dispatch(mergeCart(updatedItems));
    } else {
      const newItem = createCartItem(product, newQuantity);
      dispatch(addToCart(newItem));
    }
    
    // Then call API if logged in
    if (isAuthenticated) {
      try {
        await addItemToCart([{
          product_id: productId,
          quantity: 1,
          size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : null,
          color: product.colors && product.colors.length > 0 ? product.colors[0] : null
        }]);
      } catch (error) {
        console.error("Error incrementing item:", error);
      }
    }
  }, [cartItems, isAuthenticated, dispatch, addItemToCart]);

  // Function to handle decrement
  const handleDecrement = useCallback(async (product) => {
    const productId = String(product.id);
    const existingItem = cartItems.find(item => item.product_id === productId);
    
    if (!existingItem) return;
    
    if (existingItem.quantity <= 1) {
      // If quantity is 1, remove the item
      await removeItem(existingItem);
      return;
    }
    
    // First update local state
    const updatedItems = cartItems.map(cartItem => {
      if (cartItem.product_id === productId) {
        return { ...cartItem, quantity: cartItem.quantity - 1 };
      }
      return cartItem;
    });
    
    dispatch(mergeCart(updatedItems));
    
    // Then call API if logged in
    if (isAuthenticated) {
      const accessToken = localStorage.getItem("accessToken");
      try {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/cart/remove`,
          {
            product_id: productId,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error("Error decrementing item:", error);
      }
    }
  }, [cartItems, isAuthenticated, dispatch, removeItem]);

  const toggleExpandComboFilter = () => {
    setExpandedComboFilter(!expandedComboFilter);
  };

  // Desktop hover/click handlers
  const handleComboInteraction = () => {
    setHoveredCombo(!hoveredCombo);
  };

  // Modified filter change handler to prevent incorrect behavior
  const handleComboFilterChange = (e, filterName) => {
    e.stopPropagation(); // Prevent event bubbling
    handleFilterChange(filterName);
  };

  const handleRegularFilterChange = (e, filterName) => {
    e.stopPropagation(); // Prevent event bubbling
    handleFilterChange(filterName);
  };

  // Function to check if any combo filter is selected
  const isAnyComboFilterSelected = () => {
    return comboFilters.some(filter => selectedFilters.includes(filter.name));
  };

  // Count of selected combo filters
  const selectedComboCount = comboFilters.filter(filter => 
    selectedFilters.includes(filter.name)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-14 lg:pb-0">
      {/* Desktop Layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 w-full">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Compact Desktop Filter Panel with Transitions */}
          <div className="hidden lg:block w-65 flex-shrink-0">
            <div
              className="bg-white rounded-lg shadow-sm p-3 sticky top-2 border border-gray-100 transition-all duration-200 hover:shadow-md overflow-visible"
              style={{
                maxHeight: 'calc(100vh - 2rem)',
                overflowY: 'auto',
                scrollbarWidth: 'none', // For Firefox
                msOverflowStyle: 'none', // For IE and Edge
                position: 'relative',
              }}
            >
              <style>
                {`
                  .filter-panel::-webkit-scrollbar {
                    display: none; /* For Chrome, Safari, and Edge */
                  }
                  .combo-dropdown {
                    transform: translateX(10px);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease-in-out;
                    position: fixed !important;
                    z-index: 9999;
                  }
                  .combo-dropdown.active {
                    transform: translateX(0);
                    opacity: 1;
                    visibility: visible;
                  }
                  .combo-filter-item {
                    transition: all 0.2s ease;
                  }
                  .combo-filter-item:hover {
                    background-color: #f3f4f6;
                  }
                  .selected-combo {
                    background-color: #ecfdf5;
                    border-color: #d1fae5;
                  }
                  .combo-chevron {
                    transition: transform 0.3s ease;
                  }
                  .combo-chevron.active {
                    transform: rotate(90deg);
                  }
                `}
              </style>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-200">Filters</h3>
                {selectedFilters.length > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs text-red-700 hover:text-red-800 transition-colors duration-200 font-normal"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="space-y-2 mt-2 filter-panel">
                {/* Combo filter category with hover/click effect */}
                <div className="relative" ref={comboFilterRef}>
                  <div 
                    className={`flex items-center justify-between p-2 rounded-md transition-all duration-200 cursor-pointer ${isAnyComboFilterSelected() ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-50'}`}
                    onClick={handleComboInteraction}
                  >
                    <div className="flex items-center">
                      <span 
                        className={`text-sm transition-all duration-200 ${isAnyComboFilterSelected() ? 'font-medium text-green-800' : 'text-gray-700 hover:text-gray-900'}`}
                      >
                        Combo Products
                        {selectedComboCount > 0 && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
                            {selectedComboCount}
                          </span>
                        )}
                      </span>
                    </div>
                    <FaChevronRight className={`h-3 w-3 text-gray-500 combo-chevron ${hoveredCombo ? 'active' : ''}`} />
                  </div>
                  
                  {/* Combo filters dropdown (desktop) */}
                  <div 
                    ref={comboDropdownRef}
                    className={`fixed bg-white rounded-lg shadow-lg border border-gray-100 p-2 z-50 w-70 combo-dropdown ${hoveredCombo ? 'active' : ''}`}
                    style={{ 
                      left: comboFilterRef.current ? comboFilterRef.current.getBoundingClientRect().right + 10 : 'auto',
                      top: comboFilterRef.current ? comboFilterRef.current.getBoundingClientRect().top : 'auto'
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                  >
                    <div className="space-y-1 py-1">
                      <div className="border-b border-gray-100 pb-2 mb-1">
                        <h4 className="text-sm font-medium text-green-800 px-2">Combo Filters</h4>
                      </div>
                      {comboFilters.map((item) => (
                        <label 
                          key={item.id} 
                          htmlFor={`combo-${item.id}`} 
                          className={`flex items-center p-2 rounded-md transition-all duration-200 cursor-pointer combo-filter-item ${selectedFilters.includes(item.name) ? 'selected-combo' : ''}`}
                          onClick={(e) => handleComboFilterChange(e, item.name)}
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              id={`combo-${item.id}`}
                              className="h-4 w-4 cursor-pointer opacity-0 absolute"
                              checked={selectedFilters.includes(item.name)}
                              onChange={() => handleFilterChange(item.name)}
                            />
                            <div className={`flex items-center justify-center h-4 w-4 rounded border transition-all duration-200 ${selectedFilters.includes(item.name) ? 'bg-green-600 border-green-600' : 'border-gray-300 hover:border-gray-400'}`}>
                              {selectedFilters.includes(item.name) && (
                                <FaCheck className="h-2.5 w-2.5 text-white transition-transform duration-200" />
                              )}
                            </div>
                          </div>
                          <span 
                            className={`ml-2 text-sm transition-all duration-200 ${selectedFilters.includes(item.name) ? 'font-medium text-green-800' : 'text-gray-700 hover:text-gray-900'}`}
                          >
                            {item.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Regular filters */}
                {regularFilters.map((item) => (
                  <label 
                    key={item.id} 
                    htmlFor={item.id} 
                    className={`flex items-center p-2 rounded-md transition-all duration-200 cursor-pointer ${selectedFilters.includes(item.name) ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-50'}`}
                    onClick={(e) => handleRegularFilterChange(e, item.name)}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id={item.id}
                        className="h-4 w-4 cursor-pointer opacity-0 absolute"
                        checked={selectedFilters.includes(item.name)}
                        onChange={() => handleFilterChange(item.name)}
                      />
                      <div className={`flex items-center justify-center h-4 w-4 rounded border transition-all duration-200 ${selectedFilters.includes(item.name) ? 'bg-green-600 border-green-600' : 'border-gray-300 hover:border-gray-400'}`}>
                        {selectedFilters.includes(item.name) && (
                          <FaCheck className="h-2.5 w-2.5 text-white transition-transform duration-200" />
                        )}
                      </div>
                    </div>
                    <span 
                      className={`ml-2 text-sm text-gray-700 transition-all duration-200 ${selectedFilters.includes(item.name) ? 'font-medium text-green-800' : 'hover:text-gray-900'}`}
                    >
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop Header */}
            <div className="hidden sm:flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-green-800 transition-colors duration-200 hover:text-green-900">Decoration Items</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 transition-colors duration-200">
                  {partyData.length} results
                </span>
                <div className="relative transition-all duration-200">
                  <select
                    onChange={(e) => setSortOrder(e.target.value)}
                    value={sortOrder}
                    className="block appearance-none w-40 bg-white border border-gray-200 text-gray-700 py-1.5 px-3 pr-6 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200 hover:border-gray-300"
                  >
                    <option value="">Sort by</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700 transition-colors duration-200">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="sm:hidden flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800 transition-colors duration-200">Decoration Items</h2>
              <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded transition-colors duration-200">
                {partyData.length} results
              </span>
            </div>

            {/* Products Grid with Mobile-Specific Sizing */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-5">
              {partyData.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer sm:transform sm:hover:-translate-y-1 sm:hover:scale-105"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Mobile-specific image container with smaller aspect ratio */}
                  <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden border-b border-gray-100 rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-contain p-1 sm:p-2 transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {/* Mobile-specific content with reduced padding and tighter spacing */}
                  <div className="p-1.5 sm:p-2.5">
                    {/* Compact title with ellipsis - reduced height and margin */}
                    <h3 
                      className="text-xs sm:text-sm font-medium text-gray-900 transition-colors duration-200 line-clamp-1 overflow-hidden mb-1"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.2',
                        maxHeight: '1.2em'
                      }}
                      title={product.name} // Show full name on hover
                    >
                      {product.name}
                    </h3>
                    
                    {/* Price with reduced margin */}
                    <div className="flex items-center justify-center text-gray-800 mb-1.5 sm:mb-2 transition-colors duration-200">
                      <FaRupeeSign className="mr-0.5 text-xs text-gray-500 transition-colors duration-200" />
                      <span className="text-xs">
                        {product.price || "Price not available"}
                      </span>
                    </div>

                    {/* Add to Cart or Quantity Controls - Mobile optimized */}
                    {isProductInCart(product.id) ? (
                      <div 
                        className="flex items-center justify-center space-x-2 sm:space-x-3 py-1 sm:py-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 text-red-500 hover:text-gray-700 rounded-full transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecrement(product);
                          }}
                        >
                          <span className="text-sm sm:text-lg font-bold">-</span>
                        </button>
                        <span className="w-6 sm:w-8 text-center font-medium text-xs sm:text-sm">
                          {getProductQuantity(product.id)}
                        </span>
                        <button
                          className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 text-green-500 hover:text-green-700 rounded-full transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIncrement(product);
                          }}
                        >
                          <span className="text-sm sm:text-lg font-bold">+</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-full sm:w-[85%] bg-green-800 hover:bg-green-700 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded text-xs font-medium transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {partyData.length === 0 && (
              <div className="text-center py-8 transition-opacity duration-200">
                <p className="text-sm text-gray-500">No products found matching your filters.</p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-2 text-sm text-red-700 hover:text-red-800 transition-colors duration-200"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel with Smooth Transitions */}
      {showFilters && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out" 
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[70vh] overflow-y-auto transform transition-transform duration-300 ease-out animate-slide-up">
            <div className="sticky top-0 bg-white p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold transition-colors duration-200">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-3 space-y-1">
              {/* Mobile Combo Filter with dropdown */}
              <div className="border-b border-gray-100 pb-2 mb-2">
                <button
                  onClick={toggleExpandComboFilter}
                  className={`w-full flex items-center justify-between p-2 rounded transition-all duration-200 ${isAnyComboFilterSelected() ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                >
                  <span className={`text-sm ${isAnyComboFilterSelected() ? 'font-medium text-green-800' : 'text-gray-700'}`}>
                    Combo Products
                    {selectedComboCount > 0 && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
                        {selectedComboCount}
                      </span>
                    )}
                  </span>
                  <FaChevronDown 
                    className={`h-3 w-3 text-gray-500 transition-transform duration-300 ${expandedComboFilter ? 'transform rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Combo filter options */}
                <div 
                  className={`pl-4 space-y-1 mt-1 overflow-hidden transition-all duration-300 ${expandedComboFilter ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {comboFilters.map((item) => (
                    <label 
                      key={item.id}
                      className={`flex items-center p-2 rounded transition-all duration-200 cursor-pointer ${selectedFilters.includes(item.name) ? 'bg-green-50' : 'hover:bg-gray-100'}`}
                      onClick={(e) => handleRegularFilterChange(e, item.name)}
                    >
                      <input
                        type="checkbox"
                        id={`mobile-combo-${item.id}`}
                        className="h-4 w-4 cursor-pointer opacity-0 absolute"
                        checked={selectedFilters.includes(item.name)}
                        onChange={() => handleFilterChange(item.name)}
                      />
                     <div className={`flex items-center justify-center h-4 w-4 rounded border transition-all duration-200 ${selectedFilters.includes(item.name) ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                       {selectedFilters.includes(item.name) && (
                         <FaCheck className="h-2.5 w-2.5 text-white transition-transform duration-200" />
                       )}
                     </div>
                     <span 
                       className={`ml-2 text-sm transition-all duration-200 ${selectedFilters.includes(item.name) ? 'font-medium text-green-800' : 'text-gray-700 hover:text-gray-900'}`}
                     >
                       {item.name}
                     </span>
                   </label>
                 ))}
               </div>
             </div>
             
             {/* Regular filters for mobile */}
             {regularFilters.map((item) => (
               <label 
                 key={item.id} 
                 className={`flex items-center p-2 rounded transition-all duration-200 cursor-pointer ${selectedFilters.includes(item.name) ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-100'}`}
                onClick={(e) => handleRegularFilterChange(e, item.name)}
              >
                <input
                  type="checkbox"
                  id={`mobile-${item.id}`}
                  className="h-4 w-4 cursor-pointer opacity-0 absolute"
                  checked={selectedFilters.includes(item.name)}
                  onChange={() => handleFilterChange(item.name)}
                />
                <div className={`flex items-center justify-center h-4 w-4 rounded border transition-all duration-200 ${selectedFilters.includes(item.name) ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                  {selectedFilters.includes(item.name) && (
                    <FaCheck className="h-2.5 w-2.5 text-white transition-transform duration-200" />
                  )}
                </div>
                <span 
                  className={`ml-2 text-sm transition-all duration-200 ${selectedFilters.includes(item.name) ? 'font-medium text-green-800' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  {item.name}
                </span>
              </label>
            ))}
          </div>
          <div className="sticky bottom-0 bg-white p-2 border-t border-gray-200 flex justify-between">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition-colors duration-200"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-green-700 text-white rounded text-sm hover:bg-green-800 transition-colors duration-200"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Mobile Sort Panel with Smooth Transitions */}
    {showSortOptions && (
      <div className="fixed inset-0 z-50">
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out" 
          onClick={() => setShowSortOptions(false)}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[50vh] overflow-y-auto transform transition-transform duration-300 ease-out animate-slide-up">
          <div className="sticky top-0 bg-white p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold transition-colors duration-200">Sort By</h3>
            <button 
              onClick={() => setShowSortOptions(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-2">
            <button
              onClick={() => handleMobileSort("low-high")}
              className={`w-full text-left p-2 rounded flex items-center transition-all duration-200 ${sortOrder === "low-high" ? "bg-green-50 text-green-800 font-medium" : "hover:bg-gray-100"}`}
            >
              <FaSortAmountDown className={`mr-2 transition-colors duration-200 ${sortOrder === "low-high" ? "text-green-700" : "text-gray-500"}`} />
              Price: Low to High
              {sortOrder === "low-high" && <FaCheck className="ml-auto text-green-700 transition-opacity duration-200" />}
            </button>
            <button
              onClick={() => handleMobileSort("high-low")}
              className={`w-full text-left p-2 rounded flex items-center transition-all duration-200 ${sortOrder === "high-low" ? "bg-green-50 text-green-800 font-medium" : "hover:bg-gray-100"}`}
            >
              <FaSortAmountDown className={`mr-2 transform rotate-180 transition-colors duration-200 ${sortOrder === "high-low" ? "text-green-700" : "text-gray-500"}`} />
              Price: High to Low
              {sortOrder === "high-low" && <FaCheck className="ml-auto text-green-700 transition-opacity duration-200" />}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Mobile Bottom Navigation with Transitions */}
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm p-2 flex justify-between z-40 gap-4">
      <button
        className="flex-1 flex items-center justify-center gap-1 bg-green-700 text-white py-2 px-2 rounded text-sm transition-all duration-200 hover:bg-green-800 transform hover:scale-[1.02]"
        onClick={() => setShowFilters(true)}
      >
        <FaFilter className="text-xs transition-transform duration-200" /> 
        <span className="transition-colors duration-200">Filters</span>
        {selectedFilters.length > 0 && (
          <span className="ml-0.5 bg-white text-green-700 rounded-full h-4 w-4 flex items-center justify-center text-xs transition-all duration-200">
            {selectedFilters.length}
          </span>
        )}
      </button>
      <button 
        className="flex-1 flex items-center justify-center gap-1 bg-white text-green-700 border border-green-700 py-2 px-2 rounded text-sm transition-all duration-200 hover:border-green-800 hover:text-green-800 transform hover:scale-[1.02]"
        onClick={() => setShowSortOptions(true)}
      >
        <FaSortAmountDown className="text-xs transition-transform duration-200" /> 
        <span className="transition-colors duration-200">
          {sortOrder === "low-high" ? "Low-High" : 
           sortOrder === "high-low" ? "High-Low" : "Sort"}
        </span>
      </button>
    </div>
  </div>
);
};

export default DecorPage;