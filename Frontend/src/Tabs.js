import React, { useState } from "react";
import Tab from "./Tab"; // Import Tab component (explained later)
import VehicleDataTable from "./VehicleDataTable"; // Import your data table component
import VehicleData2 from "./VehicleData2";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("vehicles"); // Initial active tab

  const tabsData = [
    { id: "vehicles", title: "VW", content: <VehicleDataTable /> },
    // { id: "other", title: "Tesla", content: <VehicleData2 /> }, // Example content
  ];

  const handleClick = (id) => {
    setActiveTab(id);
  };

  return (
    <div className="tabs-container">
      <ul className="tabs-nav">
        {tabsData.map((tab) => (
          <Tab
            key={tab.id}
            title={tab.title}
            active={tab.id === activeTab}
            handleClick={() => handleClick(tab.id)}
          />
        ))}
      </ul>
      <div className="tab-content">
        {tabsData.map((tab) => (
          <div
            key={tab.id}
            className={`tab-content-pane ${
              activeTab === tab.id ? "active" : ""
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
