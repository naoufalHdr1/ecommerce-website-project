import React, { useState } from "react";

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    size: [],
    color: [],
    price: [0, 100], // Assuming price range is from 0 to 100
  });

  const handleCheckboxChange = (filterType, value) => {
    const updatedFilters = { ...selectedFilters };
    if (filterType === "price") {
      updatedFilters[filterType] = value; // Handle price range separately
    } else {
      if (updatedFilters[filterType].includes(value)) {
        updatedFilters[filterType] = updatedFilters[filterType].filter(
          (item) => item !== value
        );
      } else {
        updatedFilters[filterType].push(value);
      }
    }
    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="filter-sidebar p-4">
      <h4 className="fw-bold mb-4">Filter By</h4>

      {/* Category Filter */}
      <div className="filter-section mb-4">
        <h5>Category</h5>
        {filters.category.map((category, index) => (
          <div key={index} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`category-${category}`}
              onChange={() => handleCheckboxChange("category", category)}
            />
            <label className="form-check-label" htmlFor={`category-${category}`}>
              {category}
            </label>
          </div>
        ))}
      </div>

      {/* Size Filter */}
      <div className="filter-section mb-4">
        <h5>Size</h5>
        {filters.size.map((size, index) => (
          <div key={index} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`size-${size}`}
              onChange={() => handleCheckboxChange("size", size)}
            />
            <label className="form-check-label" htmlFor={`size-${size}`}>
              {size}
            </label>
          </div>
        ))}
      </div>

      {/* Color Filter */}
      <div className="filter-section mb-4">
        <h5>Color</h5>
        {filters.color.map((color, index) => (
          <div key={index} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`color-${color}`}
              onChange={() => handleCheckboxChange("color", color)}
            />
            <label className="form-check-label" htmlFor={`color-${color}`}>
              {color}
            </label>
          </div>
        ))}
      </div>

      {/* Price Filter */}
      <div className="filter-section">
        <h5>Price</h5>
        <input
          type="range"
          className="form-range"
          min="0"
          max="100"
          step="1"
          value={selectedFilters.price[1]}
          onChange={(e) =>
            handleCheckboxChange("price", [0, parseInt(e.target.value)])
          }
        />
        <p>Up to ${selectedFilters.price[1]}</p>
      </div>
    </div>
  );
};

export default FilterSidebar;

