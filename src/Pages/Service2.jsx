import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilter, FaSortAmountDown, FaTimes, FaRupeeSign, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BASE_IMAGE_URL = "https://partydecorhub.com";

const Service2 = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [decorationServices, setDecorationServices] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filters, setFilters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecorationServices = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedFilters.length > 0) {
          params.append("filters", selectedFilters.join(","));
        }

        const response = await axios.get(
          `https://partydecorhub.com/api/services?${params.toString()}`
        );
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

        setDecorationServices(services);
      } catch (error) {
        console.error("Error fetching decoration services:", error);
      }
    };

    fetchDecorationServices();
  }, [selectedFilters, sortOrder]);


  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch("https://partydecorhub.com/api/filters");
        const data = await response.json();

        const partyDecorFilters = data.find(category => category.category === "Decorative Services")?.filters || [];

        setFilters(partyDecorFilters);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);


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
          {/* Compact Desktop Filter Panel with Transitions */}
          <div className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-2 border border-gray-100 transition-all duration-200 hover:shadow-md">
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
              
              <div className="space-y-2 mt-2">
                {filters.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center p-2 rounded-md transition-all duration-200 ${selectedFilters.includes(item.name) ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-50'}`}
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id={item.id}
                        className="opacity-0 absolute h-4 w-4 cursor-pointer"
                        checked={selectedFilters.includes(item.name)}
                        onChange={() => handleFilterChange(item.name)}
                      />
                      <div className={`flex items-center justify-center h-4 w-4 rounded border transition-all duration-200 ${selectedFilters.includes(item.name) ? 'bg-green-600 border-green-600' : 'border-gray-300 hover:border-gray-400'}`}>
                        {selectedFilters.includes(item.name) && (
                          <FaCheck className="h-2.5 w-2.5 text-white transition-transform duration-200" />
                        )}
                      </div>
                    </div>
                    <label 
                      htmlFor={item.id} 
                      className={`ml-2 text-sm text-gray-700 cursor-pointer transition-all duration-200 ${selectedFilters.includes(item.name) ? 'font-medium text-green-800' : 'hover:text-gray-900'}`}
                    >
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Desktop Header */}
            <div className="hidden sm:flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-green-800 transition-colors duration-200 hover:text-green-900">Decoration Services</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 transition-colors duration-200">
                  {decorationServices.length} results
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
              <h2 className="text-lg font-semibold text-gray-800 transition-colors duration-200">Decoration Services</h2>
              <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded transition-colors duration-200">
                {decorationServices.length} results
              </span>
            </div>

            {/* Products Grid with Transitions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
  {decorationServices.map((product) => (
    <div 
      key={product.id} 
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105"
      onClick={() => handleProductClick(product)}
    >
      <div className="relative overflow-hidden h-64 min-h-[300px]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>

{/* <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 rounded-t-lg">
  <img 
    src={product.image} 
    alt={product.name} 
    className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-500 hover:scale-105"
    loading="lazy"
  />
</div> */}


      <div className="p-2.5">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1 transition-colors duration-200">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-center text-gray-800 mb-2 transition-colors duration-200">
          <FaRupeeSign className="mr-0.5 text-xs text-gray-500 transition-colors duration-200" />
          <span className="text-xs">
            {product.price || "Price not available"}
          </span>
        </div>

        <button className="w-[85%] bg-green-800 hover:bg-green-700 text-white py-2 px-3 rounded text-xs font-medium transition-all duration-200 transform hover:scale-[1.02]">
          Enquire Now
        </button>
      </div>
    </div>
  ))}
</div>


            {decorationServices.length === 0 && (
              <div className="text-center py-8 transition-opacity duration-200">
                <p className="text-sm text-gray-500">No services found matching your filters.</p>
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
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[70vh] overflow-y-auto transform transition-transform duration-300 ease-out">
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
              {filters.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center p-2 rounded transition-all duration-200 ${selectedFilters.includes(item.name) ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-100'}`}
                  onClick={() => handleFilterChange(item.name)}
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id={`mobile-${item.id}`}
                      className="opacity-0 absolute h-4 w-4 cursor-pointer"
                      checked={selectedFilters.includes(item.name)}
                      readOnly
                    />
                    <div className={`flex items-center justify-center h-4 w-4 rounded border transition-all duration-200 ${selectedFilters.includes(item.name) ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                      {selectedFilters.includes(item.name) && (
                        <FaCheck className="h-2.5 w-2.5 text-white transition-transform duration-200" />
                      )}
                    </div>
                  </div>
                  <label 
                    htmlFor={`mobile-${item.id}`} 
                    className={`ml-2 text-sm transition-all duration-200 ${selectedFilters.includes(item.name) ? 'font-medium text-green-800' : 'text-gray-700 hover:text-gray-900'}`}
                  >
                    {item.name}
                  </label>
                </div>
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
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[50vh] overflow-y-auto transform transition-transform duration-300 ease-out">
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
            <span className="ml-0.5 bg-white text-green-700 rounded-full h-4 w-4 flex items-center justify-center text-2xs transition-all duration-200">
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

export default Service2;