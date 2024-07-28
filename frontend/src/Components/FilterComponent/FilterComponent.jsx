// src/components/FilterComponent/FilterComponent.js

import React, { useState, useEffect } from "react";
import "./FilterComponent.css";

export const useFilter = (data, filterText) => {
  // Imports all data into "filteredData" and alters it.
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (filterText === "") {
      setFilteredData(data); // If there is no input in the search bar, set the table to show all data
    } else {
      const filteredItem = data.find(
        // Find differs from previously used filter. Find provides only best match
        (item) =>
          (item.question &&
            item.question.toLowerCase().includes(filterText.toLowerCase())) ||
          (item.answer &&
            item.answer.toLowerCase().includes(filterText.toLowerCase()))
      );
      setFilteredData(filteredItem ? [filteredItem] : []);
    }
  }, [filterText, data]);

  return filteredData;
};

// HTML for search bar. Applicable with its CSS in any page.
const FilterComponent = ({ filterText, onFilter }) => (
  <div className="filter-component">
    <input
      type="text"
      placeholder="Filter Question or Answer"
      value={filterText}
      onChange={onFilter}
      className="filter-input"
    />
  </div>
);

export default FilterComponent;
