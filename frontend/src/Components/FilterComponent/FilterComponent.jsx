// src/components/FilterComponent/FilterComponent.js

import React, { useState, useEffect } from "react";
import "./FilterComponent.css";

export const useFilter = (data, filterText) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (filterText === "") {
      setFilteredData(data);
    } else {
      const filteredItem = data.find(
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

const FilterComponent = ({ filterText, onFilter }) => (
  <div className="filter-component">
    <input
      type="text"
      placeholder="Filter by Question or Answer"
      value={filterText}
      onChange={onFilter}
      className="filter-input"
    />
  </div>
);

export default FilterComponent;
