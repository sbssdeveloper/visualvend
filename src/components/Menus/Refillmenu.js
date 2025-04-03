import React from 'react'


const Refillmenu = () => {
  return (
    <div>
      <section className="bottom-menu-list">
        <div className="d-flex horizontal-menu-scroll py-3">
          <div className="menu-list-item text-center">
            <label>All</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Refill</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Empty</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Low Stock</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Slow</label>
          </div>
          <div className="menu-list-item text-center">
            <label>SOH</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Planogram</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Pick</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Pre-Kit</label>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Refillmenu;