import React from "react";
import "../assets/styles/Filterpanel.css";

const FilterPanel = ({ filterOption }) => {
  
  return (
    <div className="filter-panel">
      <h3>Filters</h3>
      {
        filterOption.map((item, index) => (
          <div className="filter-category" key={index}>
            <input
              id={item.id}
              name={`filter-${item.id}`}
              type="checkbox"
              className="checkbox"
            />
            <p className="filter-name">{item.name}</p>
          </div>
        ))
      }
    </div>
  );
};

export default FilterPanel;
