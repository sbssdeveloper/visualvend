const Bottommenu = ({ onCategoryChange, currentCategory }) => {
  const handleItemClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const menuItems = [
    "ALL",
    "Critical",
    "Stock",
    "Layout",
    "Payments",
    "Faults",
    "Media",
    "Tasks",
  ];

  return (
    <div>
      <section className="bottom-menu-list">
        <div className="d-flex horizontal-menu-scroll py-3">
          {menuItems.map((item) => {
            return (
              <div key={item}>
                <div
                  className={`menu-list-item text-center ${
                    currentCategory == item.toLowerCase() ? "fw-bold" : ""
                  }`}
                  onClick={() => handleItemClick(item.toLowerCase())}
                >
                  <label>{item}</label>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Bottommenu;
