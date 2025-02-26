import React, { useState } from "react";
import "../assets/styles/ProductSection.css";
import FilterPanel from "../components/FilterPanel";
import ProductSection from "../components/ProductSection";
import ServiceBanner from "../components/ServiceBanner";
import { disposableFilterOption } from "../data/data";

const Service3 = ({ data }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortOrder, setSortOrder] = useState(""); // Sorting state

  // Sorting Function
  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === "low-high") return a.price - b.price;
    if (sortOrder === "high-low") return b.price - a.price;
    return 0;
  });

  // Toggle Filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (showSort) setShowSort(false); // Close sort if open
  };

  // Toggle Sort
  const toggleSort = () => {
    setShowSort(!showSort);
    if (showFilters) setShowFilters(false); // Close filters if open
  };

  return (
    <React.Fragment>
      <ServiceBanner />
      <div className="service-container">
        <div className="filter-container">
          <FilterPanel filterOption={disposableFilterOption} />
        </div>
        
        <div className="product-container">
          {/* Sorting dropdown for desktop */}
          <div className="sort-bar desktop-only">
            <div className="sort-by-container">
              <label htmlFor="sort-by">Sort By:</label>
              <select
                id="sort-by"
                onChange={(e) => setSortOrder(e.target.value)}
                value={sortOrder}
              >
                <option value="">Select</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          <ProductSection products={sortedData} section={"Disposable Items"} />
        </div>
      </div>

      {/* Mobile Sorting & Filtering */}
      <div className="mobile-only">
        {showFilters && (
          <div className="overlay-f">
            <div className="overlay-f-content">
              <button className="close-btn" onClick={() => setShowFilters(false)}>×</button>
              <FilterPanel filterOption={disposableFilterOption} />
            </div>
          </div>
        )}

        {showSort && (
          <div className="overlay-f">
            <div className="overlay-f-content">
              <button className="close-btn" onClick={() => setShowSort(false)}>×</button>
              <div className="sort-options">
                <h3>Sort By</h3>
                <button
                  className={`sort-button ${sortOrder === "low-high" ? "active" : ""}`}
                  onClick={() => { setSortOrder("low-high"); setShowSort(false); }}
                >
                  Price: Low to High
                </button>
                <button
                  className={`sort-button ${sortOrder === "high-low" ? "active" : ""}`}
                  onClick={() => { setSortOrder("high-low"); setShowSort(false); }}
                >
                  Price: High to Low
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Controls (Mobile) */}
        <div className="bottom-controls">
          <button className="filter-toggle" onClick={toggleFilters}>
            {showFilters ? "Close Filters" : "Filters"}
          </button>
          <button className="sort-toggle" onClick={toggleSort}>
            {showSort ? "Close Sort" : "Sort"}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Service3;
