import React from "react";
import noimage from "../../assets/images/no-image-icon.png";

const Productsmenu = ({ onSelectMenu, selectedMenu }) => {
  const menuItems = [
    "Details",
    "Pricing",
    "More Info",
    "Media",
    "Ltd Access",
    "Content",
    "Promos",
    "Stock Levels",
    "Orders",
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

export default Productsmenu;
