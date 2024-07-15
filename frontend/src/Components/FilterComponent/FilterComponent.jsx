import React from "react";
import "./FilterComponent.css";

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
