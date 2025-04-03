import React from 'react'

const Categorymenu = () => {
  return (
    <div>
      <section className="bottom-menu-list">
        <div className="d-flex horizontal-menu-scroll py-3">
          <div className="menu-list-item text-center">
            <label>Details</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Supplier details</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Products in Category</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Access</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Limits</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Stock Levels</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Orders</label>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Categorymenu;