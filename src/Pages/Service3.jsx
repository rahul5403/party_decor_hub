// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../assets/styles/ProductSection.css";
// import FilterPanel from "../components/FilterPanel";
// import ProductSection from "../components/ProductSection";
// import ServiceBanner from "../components/ServiceBanner";
// import HeroSection from "../components/HeroSection";
// import { disposableFilterOption } from "../data/data";

// const BASE_IMAGE_URL = "https://partydecorhub.com";

// const Service3 = () => {
//   const [disposableItems, setDisposableItems] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [showSort, setShowSort] = useState(false);
//   const [sortOrder, setSortOrder] = useState("");

//   useEffect(() => {
//     const fetchDisposableItems = async () => {
//       try {
//         const response = await axios.get("https://partydecorhub.com/api/products");
//         const products = response.data
//           .filter(product => product.category === "Disposable Items")
//           .map(product => ({
//             id: product.product_id,
//             name: product.name,
//             price: product.price,
//             originalPrice: product.price + 10,
//             description: product.category,
//             image: BASE_IMAGE_URL + product.thumbnail,
//             images: [BASE_IMAGE_URL + product.thumbnail],
//           }));
//         setDisposableItems(products);
//       } catch (error) {
//         console.error("Error fetching disposable items:", error);
//       }
//     };

//     fetchDisposableItems();
//   }, []);


//   const sortedData = [...disposableItems].sort((a, b) => {
//     if (sortOrder === "low-high") return a.price - b.price;
//     if (sortOrder === "high-low") return b.price - a.price;
//     return 0;
//   });

//   const toggleFilters = () => {
//     setShowFilters(!showFilters);
//     if (showSort) setShowSort(false);
//   };

//   const toggleSort = () => {
//     setShowSort(!showSort);
//     if (showFilters) setShowFilters(false);
//   };

//   return (
//     <React.Fragment>
//       {/* <ServiceBanner /> */}
//       <HeroSection />
//       <div className="service-container">
//         <div className="filter-container">
//           <FilterPanel filterOption={disposableFilterOption} />
//         </div>

//         <div className="product-container">
//           <div className="sort-bar desktop-only">
//             <div className="sort-by-container">
//               <label htmlFor="sort-by">Sort By:</label>
//               <select id="sort-by" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
//                 <option value="">Select</option>
//                 <option value="low-high">Price: Low to High</option>
//                 <option value="high-low">Price: High to Low</option>
//               </select>
//             </div>
//           </div>
//           <ProductSection products={sortedData} section={"Disposable Items"} />
//         </div>
//       </div>

//       <div className="mobile-only">
//         {showFilters && (
//           <div className="overlay-f">
//             <div className="overlay-f-content">
//               <button className="close-btn" onClick={() => setShowFilters(false)}>×</button>
//               <FilterPanel filterOption={disposableFilterOption} />
//             </div>
//           </div>
//         )}

//         {showSort && (
//           <div className="overlay-f">
//             <div className="overlay-f-content">
//               <button className="close-btn" onClick={() => setShowSort(false)}>×</button>
//               <div className="sort-options">
//                 <h3>Sort By</h3>
//                 <button className={`sort-button ${sortOrder === "low-high" ? "active" : ""}`} onClick={() => { setSortOrder("low-high"); setShowSort(false); }}>
//                   Price: Low to High
//                 </button>
//                 <button className={`sort-button ${sortOrder === "high-low" ? "active" : ""}`} onClick={() => { setSortOrder("high-low"); setShowSort(false); }}>
//                   Price: High to Low
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="bottom-controls">
//           <button className="filter-toggle" onClick={toggleFilters}>
//             {showFilters ? "Close Filters" : "Filters"}
//           </button>
//           <button className="sort-toggle" onClick={toggleSort}>
//             {showSort ? "Close Sort" : "Sort"}
//           </button>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Service3;


import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/ProductSection.css";
import FilterPanel from "../components/FilterPanel";
import ProductSection from "../components/ProductSection";
import HeroSection from "../components/HeroSection";
import { disposableFilterOption } from "../data/data";
import { FaFilter, FaSortAmountDown } from "react-icons/fa";

const BASE_IMAGE_URL = "https://partydecorhub.com";

const Service3 = () => {
  const [disposableItems, setDisposableItems] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const fetchDisposableItems = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedFilters.length > 0) {
          params.append("filters", selectedFilters.join(","));
        }

        const response = await axios.get(`https://partydecorhub.com/api/products?${params.toString()}`);
        let products = response.data
          .filter(product => product.category === "Disposable Items")
          .map(product => ({
            id: product.product_id,
            name: product.name,
            price: product.price,
            originalPrice: product.price + 10,
            description: product.category,
            image: BASE_IMAGE_URL + product.thumbnail,
            images: [BASE_IMAGE_URL + product.thumbnail],
          }));

        setDisposableItems(products);
      } catch (error) {
        console.error("Error fetching disposable items:", error);
      }
    };

    fetchDisposableItems();
  }, [selectedFilters]);

  const handleFilterChange = (filterName) => {
    setSelectedFilters(prevFilters =>
      prevFilters.includes(filterName)
        ? prevFilters.filter(f => f !== filterName)
        : [...prevFilters, filterName]
    );
  };

  const sortedData = [...disposableItems].sort((a, b) => {
    if (sortOrder === "low-high") return a.price - b.price;
    if (sortOrder === "high-low") return b.price - a.price;
    return 0;
  });

  return (
    <React.Fragment>
      <HeroSection />
      <div className="service-container">
        <div className="filter-container">
          <FilterPanel filterOption={disposableFilterOption} onFilterChange={handleFilterChange} selectedFilters={selectedFilters} />
        </div>

        <div className="product-container">
          <div className="sort-bar desktop-only">
            <div className="sort-by-container">
              <label htmlFor="sort-by">Sort By:</label>
              <select id="sort-by" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                <option value="">Select</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
          <ProductSection products={sortedData} section={"Disposable Items"} />
        </div>
      </div>

      <div className="mobile-only">
        {showFilters && (
          <div className="overlay-f">
            <div className="overlay-f-content">
              <button className="close-btn" onClick={() => setShowFilters(false)}>×</button>
              <FilterPanel filterOption={disposableFilterOption} onFilterChange={handleFilterChange} selectedFilters={selectedFilters} />
            </div>
          </div>
        )}

        <div className="bottom-controls">
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter className="icon" />
            {showFilters ? "Close Filters" : "Filters"}
          </button>
          <button className="sort-toggle" onClick={() => setShowSort(!showSort)}>
            <FaSortAmountDown className="icon" />
            {showSort ? "Close Sort" : "Sort"}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Service3;