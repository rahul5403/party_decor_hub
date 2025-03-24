// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../assets/styles/ProductSection.css";
// import FilterPanel from "../components/FilterPanel";
// import ProductSection from "../components/ProductSection";
// import ServiceBanner from "../components/ServiceBanner";
// import HeroSection from "../components/HeroSection";
// import { decorationFilterOption } from "../data/data";

// const BASE_IMAGE_URL = "https://partydecorhub.com";

// const Service2 = () => {
//   const [showFilters, setShowFilters] = useState(false);
//   const [showSort, setShowSort] = useState(false);
//   const [sortOrder, setSortOrder] = useState("");
//   const [decorationServices, setDecorationServices] = useState([]);

//   useEffect(() => {
//     const fetchDecorationServices = async () => {
//       try {
//         const response = await axios.get("https://partydecorhub.com/api/services");
//         const services = response.data.map(service => ({
//           id: service.id,
//           name: service.name,
//           price: service.price,
//           image: BASE_IMAGE_URL + service.thumbnail,
//         }));
//         setDecorationServices(services);
//       } catch (error) {
//         console.error("Error fetching decoration services:", error);
//       }
//     };

//     fetchDecorationServices();
//   }, []);

//   const sortedData = [...decorationServices].sort((a, b) => {
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
//           <FilterPanel filterOption={decorationFilterOption} />
//         </div>

//         <div className="product-container">
//           <div className="sort-bar desktop-only">
//             <div className="sort-by-container">
//               <label htmlFor="sort-by">Sort By:</label>
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

//           <ProductSection products={sortedData} section={"Decoration Services"} />
//         </div>
//       </div>

//       <div className="mobile-only">
//         {showFilters && (
//           <div className="overlay-f">
//             <div className="overlay-f-content">
//               <button className="close-btn" onClick={() => setShowFilters(false)}>×</button>
//               <FilterPanel filterOption={decorationFilterOption} />
//             </div>
//           </div>
//         )}

//         {showSort && (
//           <div className="overlay-f">
//             <div className="overlay-f-content">
//               <button className="close-btn" onClick={() => setShowSort(false)}>×</button>
//               <div className="sort-options">
//                 <h3>Sort By</h3>
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

// export default Service2;


import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/ProductSection.css";
import FilterPanel from "../components/FilterPanel";
import ProductSection from "../components/ProductSection";
import HeroSection from "../components/HeroSection";
import { decorationFilterOption } from "../data/data";
import { FaFilter, FaSortAmountDown } from "react-icons/fa";

const BASE_IMAGE_URL = "https://partydecorhub.com";

const Service2 = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [decorationServices, setDecorationServices] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    const fetchDecorationServices = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedFilters.length > 0) {
          params.append("filters", selectedFilters.join(","));
        }

        const response = await axios.get(`https://partydecorhub.com/api/services?${params.toString()}`);
        let services = response.data.map(service => ({
          id: service.id,
          name: service.name,
          price: service.price,
          image: BASE_IMAGE_URL + service.thumbnail,
        }));

        if (selectedFilters.length === 0) {
          services = services.filter(service => service.name.includes("Decoration"));
        }

        setDecorationServices(services);
      } catch (error) {
        console.error("Error fetching decoration services:", error);
      }
    };

    fetchDecorationServices();
  }, [selectedFilters]);

  const handleFilterChange = (filterName) => {
    setSelectedFilters(prevFilters =>
      prevFilters.includes(filterName)
        ? prevFilters.filter(f => f !== filterName)
        : [...prevFilters, filterName]
    );
  };

  return (
    <React.Fragment>
      <HeroSection />
      <div className="service-container">
        <div className="filter-container">
          <FilterPanel filterOption={decorationFilterOption} onFilterChange={handleFilterChange} selectedFilters={selectedFilters} />
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

          <ProductSection products={decorationServices} section={"Decoration Services"} />
        </div>
      </div>

      <div className="mobile-only">
        {showFilters && (
          <div className="overlay-f">
            <div className="overlay-f-content">
              <button className="close-btn" onClick={() => setShowFilters(false)}>×</button>
              <FilterPanel filterOption={decorationFilterOption} onFilterChange={handleFilterChange} selectedFilters={selectedFilters} />
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

export default Service2;

