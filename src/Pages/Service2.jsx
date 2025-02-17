import React from "react";
import "../assets/styles/ProductSection.css";
import FilterPanel from "../components/FilterPanel";
import ProductSection from "../components/ProductSection";
import ServiceBanner from "../components/ServiceBanner";
import { decorationFilterOption } from "../data/data";

const Service2 = ({data}) => {
  return (
    <React.Fragment>
      <ServiceBanner />
    <div className="service-container">
      <div className="filter-container">
        <FilterPanel filterOption={decorationFilterOption}/>
      </div>
      <div className="product-container">
        <ProductSection products={data} section={"Decoration"}/>
      </div>
    </div>
    </React.Fragment>
  );
};

export default Service2;
