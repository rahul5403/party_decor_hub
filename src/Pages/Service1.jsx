import React from "react";
import "../assets/styles/ProductSection.css";
import FilterPanel from "../components/FilterPanel";
import ProductSection from "../components/ProductSection";
import ServiceBanner from "../components/ServiceBanner";
import { partyDecorationFilterOption } from "../data/data";

const Service1 = ({data}) => {
  return (
    <React.Fragment>
      <ServiceBanner />
      <div className="service-container">
        <div className="filter-container">
          <FilterPanel filterOption={partyDecorationFilterOption}/>
        </div>
        <div className="product-container">
          <ProductSection products={data} section={"Party"} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Service1;
