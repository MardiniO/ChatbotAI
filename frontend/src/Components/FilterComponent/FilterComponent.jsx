import React from "react";

export const FilterComponent = ({ filterText, onFilter }) => (
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
