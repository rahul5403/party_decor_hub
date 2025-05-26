import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilter, FaSortAmountDown, FaTimes, FaRupeeSign, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BASE_IMAGE_URL =   process.env.REACT_APP_BASE_URL

const ServicePage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [decorationServices, setDecorationServices] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecorationServices = async () => {
      try {
        setLoading(true); // Set loading to true
        console.log("Fetching services with filters:", selectedFilters); // Debug log
        
        const params = new URLSearchParams();
        if (selectedFilters.length > 0) {
          params.append("filters", selectedFilters.join(","));
        }

        const apiUrl = `${process.env.REACT_APP_BASE_URL}/api/services?${params.toString()}`;
        console.log("API URL:", apiUrl); // Debug log
        
        const response = await axios.get(apiUrl);
        console.log("API Response:", response.data); // Debug log
        
        let services = response.data.map((service) => ({
          id: service.id,
          name: service.name,
          price: service.price,
          image: BASE_IMAGE_URL + service.thumbnail,
        }));

        if (sortOrder === "low-high") {
          services.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "high-low") {
          services.sort((a, b) => b.price - a.price);
        }

        console.log("Processed services:", services); // Debug log
        setDecorationServices(services);
      } catch (error) {
        console.error("Error fetching decoration services:", error);
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchDecorationServices();
  }, [selectedFilters, sortOrder]); // Make sure this dependency array is correct

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/filters`);
        const data = await response.json();
        console.log("Filters response:", data); // Debug log

        const partyDecorFilters = data.find(category => category.category === "Decorative Services")?.filters || [];
        console.log("Party decor filters:", partyDecorFilters); // Debug log

        setFilters(partyDecorFilters);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  const handleFilterChange = (filterName) => {
    console.log("Filter changed:", filterName); // Debug log
    setSelectedFilters((prevFilters) => {
      const newFilters = prevFilters.includes(filterName)
        ? prevFilters.filter((f) => f !== filterName)
        : [...prevFilters, filterName];
      
      console.log("New selected filters:", newFilters); // Debug log
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    console.log("Clearing all filters"); // Debug log
    setSelectedFilters([]);
  };

  const handleProductClick = (product) => {
    navigate(`/services/${product.id}`, { state: { product } });
  };

  const handleMobileSort = (order) => {
    setSortOrder(order);
    setShowSortOptions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-14 lg:pb-0">
      {/* Desktop Layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 w-full">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Desktop Filter Panel */}
          <div className="hidden lg:block w-65 flex-shrink-0">
            <div
              className="bg-white rounded-lg shadow-sm p-3 sticky top-2 border border-gray-100 transition-all duration-200 hover:shadow-md"
              style={{
                maxHeight: 'calc(100vh - 2rem)',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <style>
                {`
                  ::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                <h3 className="text-lg pl-3 font-semibold text-gray-800">Filters</h3>
                {selectedFilters.length > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs text-red-700 hover:text-red-800 font-normal"
                  >
                    Clear all ({selectedFilters.length})
                  </button>
                )}
              </div>
              
              <div className="space-y-2 mt-2">
                {filters.map((item) => (
                  <label 
                    key={item.id} 
                    htmlFor={item.id} 
                    className={`flex items-center p-2 rounded-md cursor-pointer ${selectedFilters.includes(item.name) ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-50'}`}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id={item.id}
                        className="opacity-0 absolute h-4 w-4 cursor-pointer"
                        checked={selectedFilters.includes(item.name)}
                        onChange={() => handleFilterChange(item.name)}
                      />
                      <div className={`flex items-center justify-center h-4 w-4 rounded border ${selectedFilters.includes(item.name) ? 'bg-green-600 border-green-600' : 'border-gray-300 hover:border-gray-400'}`}>
                        {selectedFilters.includes(item.name) && (
                          <FaCheck className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                    </div>
                    <span 
                      className={`ml-2 text-sm ${selectedFilters.includes(item.name) ? 'font-medium text-green-800' : 'text-gray-700 hover:text-gray-900'}`}
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
              <h2 className="text-2xl font-semibold text-green-800">Decoration Services</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">
                  {loading ? "Loading..." : `${decorationServices.length} results`}
                </span>
                {selectedFilters.length > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {selectedFilters.length} filter{selectedFilters.length > 1 ? 's' : ''} active
                  </span>
                )}
                <div className="relative">
                  <select
                    onChange={(e) => setSortOrder(e.target.value)}
                    value={sortOrder}
                    className="block appearance-none w-40 bg-white border border-gray-200 text-gray-700 py-1.5 px-3 pr-6 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Sort by</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="sm:hidden flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Decoration Services</h2>
              <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                {loading ? "Loading..." : `${decorationServices.length} results`}
              </span>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-5">
                {decorationServices.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer sm:transform sm:hover:-translate-y-1 sm:hover:scale-105"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden border-b border-gray-100 rounded-t-lg">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover p-1 sm:p-2 transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-1.5 sm:p-2.5">
                      <h3 
                        className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1 overflow-hidden mb-1"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: '1.2',
                          maxHeight: '1.2em'
                        }}
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-center text-gray-800 mb-1.5 sm:mb-2">
                        <FaRupeeSign className="mr-0.5 text-xs text-gray-500" />
                        <span className="text-xs">
                          {product.price || "Price not available"}
                        </span>
                      </div>

                      <button className="w-full sm:w-[85%] bg-green-800 hover:bg-green-700 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded text-xs font-medium transition-all duration-200 transform hover:scale-[1.02]">
                        Enquire Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && decorationServices.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No services found matching your filters.</p>
                {selectedFilters.length > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className="mt-2 text-sm text-red-700 hover:text-red-800"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {showFilters && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[70vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-3 space-y-1">
              {filters.map((item) => (
                <label 
                  key={item.id} 
                  className={`flex items-center p-2 rounded cursor-pointer ${selectedFilters.includes(item.name) ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-100'}`}
                >
                  <input
                    type="checkbox"
                    id={`mobile-${item.id}`}
                    className="opacity-0 absolute h-4 w-4 cursor-pointer"
                    checked={selectedFilters.includes(item.name)}
                    onChange={() => handleFilterChange(item.name)}
                  />
                  <div className={`flex items-center justify-center h-4 w-4 rounded border ${selectedFilters.includes(item.name) ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                    {selectedFilters.includes(item.name) && (
                      <FaCheck className="h-2.5 w-2.5 text-white" />
                    )}
                  </div>
                  <span 
                    className={`ml-2 text-sm ${selectedFilters.includes(item.name) ? 'font-medium text-green-800' : 'text-gray-700 hover:text-gray-900'}`}
                  >
                    {item.name}
                  </span>
                </label>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white p-2 border-t border-gray-200 flex justify-between">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-green-700 text-white rounded text-sm hover:bg-green-800"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Panel */}
      {showSortOptions && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setShowSortOptions(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[50vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sort By</h3>
              <button 
                onClick={() => setShowSortOptions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => handleMobileSort("low-high")}
                className={`w-full text-left p-2 rounded flex items-center ${sortOrder === "low-high" ? "bg-green-50 text-green-800 font-medium" : "hover:bg-gray-100"}`}
              >
                <FaSortAmountDown className={`mr-2 ${sortOrder === "low-high" ? "text-green-700" : "text-gray-500"}`} />
                Price: Low to High
                {sortOrder === "low-high" && <FaCheck className="ml-auto text-green-700" />}
              </button>
              <button
                onClick={() => handleMobileSort("high-low")}
                className={`w-full text-left p-2 rounded flex items-center ${sortOrder === "high-low" ? "bg-green-50 text-green-800 font-medium" : "hover:bg-gray-100"}`}
              >
                <FaSortAmountDown className={`mr-2 transform rotate-180 ${sortOrder === "high-low" ? "text-green-700" : "text-gray-500"}`} />
                Price: High to Low
                {sortOrder === "high-low" && <FaCheck className="ml-auto text-green-700" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm p-2 flex justify-between z-40 gap-4">
        <button
          className="flex-1 flex items-center justify-center gap-1 bg-green-700 text-white py-2 px-2 rounded text-sm hover:bg-green-800"
          onClick={() => setShowFilters(true)}
        >
          <FaFilter className="text-xs" /> 
          <span>Filters</span>
          {selectedFilters.length > 0 && (
            <span className="ml-0.5 bg-white text-green-700 rounded-full h-4 w-4 flex items-center justify-center text-xs">
              {selectedFilters.length}
            </span>
          )}
        </button>
        <button 
          className="flex-1 flex items-center justify-center gap-1 bg-white text-green-700 border border-green-700 py-2 px-2 rounded text-sm hover:border-green-800 hover:text-green-800"
          onClick={() => setShowSortOptions(true)}
        >
          <FaSortAmountDown className="text-xs" /> 
          <span>
            {sortOrder === "low-high" ? "Low-High" : 
             sortOrder === "high-low" ? "High-Low" : "Sort"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ServicePage;