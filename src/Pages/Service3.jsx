// import React from "react";
// import "../assets/styles/ProductSection.css";
// import FilterPanel from "../components/FilterPanel";
// import ProductSection from "../components/ProductSection";
// import ServiceBanner from "../components/ServiceBanner";
// import { disposableFilterOption } from "../data/data";


// const Service3 = ({data}) => {
//   return (
//     <React.Fragment>
//       <ServiceBanner />
//       <div className="service-container">
//         <div className="filter-container">
//           <FilterPanel filterOption={disposableFilterOption}/>
//         </div>
//         <div className="product-container">
//           <ProductSection products={data} section={"Disposable"} />
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Service3;


import React, { useState } from "react";
import "../assets/styles/ProductSection.css";
import FilterPanel from "../components/FilterPanel";
import ProductSection from "../components/ProductSection";
import ServiceBanner from "../components/ServiceBanner";
import { disposableFilterOption } from "../data/data";

const Service3 = ({ data }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <React.Fragment>
      <ServiceBanner />
      <div className="service-container">
        <div className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </div>
        <div className={`filter-container ${showFilters ? "show" : "hide"}`}>
          <FilterPanel filterOption={disposableFilterOption} />
        </div>
        <div className="product-container">
          <ProductSection products={data} section={"Disposable"} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Service3;

