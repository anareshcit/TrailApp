import React from "react";

const TabContent = ({ children, active }) => (
  <div className={`tab-content ${active ? "active" : ""}`}>{children}</div>
);

export default TabContent;
