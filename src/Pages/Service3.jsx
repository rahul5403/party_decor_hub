import React from "react";
import "../assets/styles/ProductSection.css";
import FilterPanel from "../components/FilterPanel";
import ProductSection from "../components/ProductSection";
import ServiceBanner from "../components/ServiceBanner";
import { disposableFilterOption } from "../data/data";


const Service3 = ({data}) => {
  return (
    <React.Fragment>
      <ServiceBanner />
      <div className="service-container">
        <div className="filter-container">
          <FilterPanel filterOption={disposableFilterOption}/>
        </div>
        <div className="product-container">
          <ProductSection products={data} section={"Disposable"} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Service3;
