import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/ProductSection.css";
import FilterPanel from "../components/FilterPanel";
import ProductSection from "../components/ProductSection";
import ServiceBanner from "../components/ServiceBanner";
import { decorationFilterOption } from "../data/data";

const BASE_IMAGE_URL = "https://partydecorhub.com";

const Service2 = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [decorationServices, setDecorationServices] = useState([]);

  useEffect(() => {
    const fetchDecorationServices = async () => {
      try {
        const response = await axios.get("https://partydecorhub.com/api/services");
        const services = response.data.map(service => ({
          id: service.id,
          name: service.name,
          price: service.price,
          image: BASE_IMAGE_URL + service.thumbnail,
        }));
        setDecorationServices(services);
      } catch (error) {
        console.error("Error fetching decoration services:", error);
      }
    };

    fetchDecorationServices();
  }, []);

  const sortedData = [...decorationServices].sort((a, b) => {
    if (sortOrder === "low-high") return a.price - b.price;
    if (sortOrder === "high-low") return b.price - a.price;
    return 0;
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (showSort) setShowSort(false);
  };

  const toggleSort = () => {
    setShowSort(!showSort);
    if (showFilters) setShowFilters(false);
  };

  return (
    <React.Fragment>
      <ServiceBanner />
      <div className="service-container">
        <div className="filter-container">
          <FilterPanel filterOption={decorationFilterOption} />
        </div>

        <div className="product-container">
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

          <ProductSection products={sortedData} section={"Decoration Services"} />
        </div>
      </div>

      <div className="mobile-only">
        {showFilters && (
          <div className="overlay-f">
            <div className="overlay-f-content">
              <button className="close-btn" onClick={() => setShowFilters(false)}>×</button>
              <FilterPanel filterOption={decorationFilterOption} />
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

export default Service2;
