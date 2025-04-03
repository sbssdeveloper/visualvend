import React from "react";

const Machineproductmenu = () => {

  return (
    <div>
      <section className="bottom-menu-list">
        <div className="d-flex horizontal-menu-scroll py-3">
          <div className="menu-list-item text-center">
            <label>Summary</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Critical</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Refills</label>
          </div>
          <div className="menu-list-item text-center fw-bold">
            <label>SOH</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Planogram</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Access</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Media</label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Machineproductmenu;
