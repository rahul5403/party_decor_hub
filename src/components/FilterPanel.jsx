import React from "react";

const FilterPanel = ({ filterOption, onFilterChange, selectedFilters }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg w-full max-w-xs mx-auto">
      <h3 className="text-lg font-bold text-center mb-4 text-green-900">Filters</h3>
      <div className="space-y-3">
        {filterOption.map((item, index) => (
          <label
            key={index}
            className="flex items-center space-x-3 p-2 bg-gray-100 rounded-lg hover:bg-green-100 transition duration-300 cursor-pointer"
          >
            <input
              type="checkbox"
              id={item.id}
              name={`filter-${item.id}`}
              className="form-checkbox h-5 w-5 text-green-600 border-green-300 focus:ring-green-500"
              checked={selectedFilters.includes(item.name)}
              onChange={() => onFilterChange(item.name)}
            />
            <span className="text-gray-800 font-medium">{item.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterPanel;