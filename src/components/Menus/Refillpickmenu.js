import React from "react";

const Refillpickmenu = ({ onSelectMenu, selectedMenu }) => {

  const menuItems = [
    "All",
    "By Product",
    "By Category",
    "By Aisle Selection",
    "By Row",
  ];
    
  return (
    <section className="bottom-menu-list">
      <div className="d-flex horizontal-menu-scroll py-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`menu-list-item text-center ${
              selectedMenu === item ? "active-menu-item" : ""
            }`}
            onClick={() => onSelectMenu(item)}
          >
            <label>{item}</label>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Refillpickmenu;
