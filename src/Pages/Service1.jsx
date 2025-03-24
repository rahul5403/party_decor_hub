// import React, { useState, useEffect } from "react";
// import "../assets/styles/ProductSection.css";
// import FilterPanel from "../components/FilterPanel";
// import ProductSection from "../components/ProductSection";
// import ServiceBanner from "../components/ServiceBanner";
// import HeroSection from "../components/HeroSection";
// import { partyDecorationFilterOption } from "../data/data";
// import { FaFilter, FaSort, FaSortAmountDown } from "react-icons/fa";
// import axios from "axios";

// const BASE_IMAGE_URL = "https://partydecorhub.com"; 


// const Service1 = ({ data }) => {
//   const [showFilters, setShowFilters] = useState(false);
//   const [showSort, setShowSort] = useState(false);
//   const [sortOrder, setSortOrder] = useState(""); // Sorting state

//   const [partyData, setPartyData] = useState([]);
//   useEffect(() => {
//       const fetchProducts = async () => {
//           try {
//               const response = await axios.get("https://partydecorhub.com/api/products");
//               const products = response.data.map(product => ({
//                   id: product.product_id || product.id, 
//                   name: product.name,
//                   price: product.price,
//                   originalPrice: product.price + 10,  
//                   description: product.category,  
//                   image: BASE_IMAGE_URL + product.thumbnail, 
//                   images: [BASE_IMAGE_URL + product.thumbnail], 
//               }));
//               setPartyData(products.filter(item => item.description === "Party Decor"));
//           } catch (error) {
//               console.error("Error fetching products:", error);
//           }
//       };

//       fetchProducts();
//   }, []);



//   // Sorting Function
//   const sortedData = [...data].sort((a, b) => {
//     if (sortOrder === "low-high") return a.price - b.price;
//     if (sortOrder === "high-low") return b.price - a.price;
//     return 0;
//   });

//   // Toggle Filters
//   const toggleFilters = () => {
//     setShowFilters(!showFilters);
//     if (showSort) setShowSort(false); // Close sort if open
//   };

//   // Toggle Sort
//   const toggleSort = () => {
//     setShowSort(!showSort);
//     if (showFilters) setShowFilters(false); // Close filters if open
//   };

//   return (
//     <React.Fragment>
//       {/* <ServiceBanner /> */}
//       <HeroSection />
//       <div className="service-container">
//         <div className="filter-container">
//           <FilterPanel filterOption={partyDecorationFilterOption} />
//         </div>
        
//         <div className="product-container">
//           {/* Sorting dropdown for desktop */}
//           <div className="sort-bar desktop-only">
//             <div className="sort-by-container">
//               <label htmlFor="sort-by ">Sort By:</label>
//               <select
//                 id="sort-by"
//                 onChange={(e) => setSortOrder(e.target.value)}
//                 value={sortOrder}
//               >
//                 <option value="">Select</option>
//                 <option value="low-high">Price: Low to High</option>
//                 <option value="high-low">Price: High to Low</option>
//               </select>
//             </div>
//           </div>

//           <ProductSection products={partyData} section={"Decoration Items"} />
//         </div>
//       </div>

//       {/* Mobile Sorting & Filtering */}
//       <div className="mobile-only">
//         {showFilters && (
//           <div className="overlay-f">
//             <div className="overlay-f-content">
//               <button className="close-btn" onClick={() => setShowFilters(false)}>×</button>
//               <FilterPanel filterOption={partyDecorationFilterOption} />
//             </div>
//           </div>
//         )}

//         {showSort && (
//           <div className="overlay-f">
//             <div className="overlay-f-content">
//               <button className="close-btn" onClick={() => setShowSort(false)}>×</button>
//               <div className="sort-options">
//                 <ft>Sort By</ft>
//                 <button
//                   className={`sort-button ${sortOrder === "low-high" ? "active" : ""}`}
//                   onClick={() => { setSortOrder("low-high"); setShowSort(false); }}
//                 >
//                   Price: Low to High
//                 </button>
//                 <button
//                   className={`sort-button ${sortOrder === "high-low" ? "active" : ""}`}
//                   onClick={() => { setSortOrder("high-low"); setShowSort(false); }}
//                 >
//                   Price: High to Low
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Bottom Controls (Mobile) */}
//         <div className="bottom-controls">
//       <button className="filter-toggle" onClick={toggleFilters}>
//         <FaFilter className="icon" />
//         {showFilters ? "Close Filters" : "Filters"}
//       </button>
//       <button className="sort-toggle" onClick={toggleSort}>
//         <FaSortAmountDown className="icon" />
//         {showSort ? "Close Sort" : "Sort"}
//       </button>
//       </div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Service1;

import React, { useState, useEffect } from "react";
import FilterPanel from "../components/FilterPanel";
import ProductSection from "../components/ProductSection";
import HeroSection from "../components/HeroSection";
import { partyDecorationFilterOption } from "../data/data";
import { FaFilter, FaSortAmountDown } from "react-icons/fa";
import axios from "axios";

const BASE_IMAGE_URL = "https://partydecorhub.com";

const Service1 = ({ data }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [partyData, setPartyData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedFilters.length > 0) {
          params.append("filters", selectedFilters.join(","));
        }

        const response = await axios.get(
          `https://partydecorhub.com/api/products?${params.toString()}`
        );
        let products = response.data.map((product) => ({
          id: product.product_id || product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.price + 10,
          description: product.category,
          image: BASE_IMAGE_URL + product.thumbnail,
          images: [BASE_IMAGE_URL + product.thumbnail],
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

  const handleFilterChange = (filterName) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filterName)
        ? prevFilters.filter((f) => f !== filterName)
        : [...prevFilters, filterName]
    );
  };

  return (
    <>
      <HeroSection />
      <div className="flex flex-col lg:flex-row p-4">
        {/* Left Sidebar for Filters in Desktop */}
        <div className="hidden lg:block lg:w-1/4">
          <FilterPanel
            filterOption={partyDecorationFilterOption}
            onFilterChange={handleFilterChange}
            selectedFilters={selectedFilters}
          />
        </div>

        {/* Product Section */}
        <div className="w-full lg:w-3/4">
          {/* Sort Dropdown for Desktop */}
          <div className="hidden lg:flex justify-end mb-4">
            <div className="flex items-center">
              <label htmlFor="sort-by" className="mr-2 font-medium">
                Sort By:
              </label>
              <select
                id="sort-by"
                onChange={(e) => setSortOrder(e.target.value)}
                value={sortOrder}
                className="border rounded-lg p-2 focus:ring focus:ring-green-400"
              >
                <option value="">Select</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          <ProductSection products={partyData} section={"Decoration Items"} />
        </div>
      </div>

      {/* Mobile Filter & Sort Buttons */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around p-3 border-t z-50">
        <button
          className="flex items-center space-x-2 text-lg p-2 bg-green-500 text-white rounded-lg shadow-md transition-all hover:bg-green-600"
          onClick={() => setShowFilters(true)}
        >
          <FaFilter />
          <span>Filters</span>
        </button>
        <button
          className="flex items-center space-x-2 text-lg p-2 bg-green-500 text-white rounded-lg shadow-md transition-all hover:bg-green-600"
          onClick={() => setSortOrder(sortOrder === "low-high" ? "high-low" : "low-high")}
        >
          <FaSortAmountDown />
          <span>Sort</span>
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-end">
          <div className="w-full bg-white p-4 rounded-t-3xl max-h-[80vh] overflow-y-auto relative shadow-lg transition-all transform translate-y-0">
            <button
              className="absolute top-3 right-4 text-2xl font-bold text-gray-700 hover:text-red-500 transition"
              onClick={() => setShowFilters(false)}
            >
              ×
            </button>
            <h2 className="text-center font-bold text-xl pb-4">Filters</h2>
            <FilterPanel
              filterOption={partyDecorationFilterOption}
              onFilterChange={handleFilterChange}
              selectedFilters={selectedFilters}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Service1;