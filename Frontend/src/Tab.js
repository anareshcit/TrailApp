import React from "react";

const Tab = ({ title, active, handleClick }) => (
  <button className={`tab ${active ? "active" : ""}`} onClick={handleClick}>
    {title}
  </button>
);

export default Tab;
