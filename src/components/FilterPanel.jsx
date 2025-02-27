import React from "react";
import "../assets/styles/Filterpanel.css";

const FilterPanel = ({ filterOption }) => {
  return (
    <div className="filter-panel">
      <h3 className="ft">Filters</h3>
      <div className="filter-options">
        {filterOption.map((item, index) => (
          <label className="filter-category" key={index}>
            <input
              id={item.id}
              name={`filter-${item.id}`}
              type="checkbox"
              className="checkbox"
            />
            <span className="custom-checkbox"></span>
            <p className="filter-name">{item.name}</p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;