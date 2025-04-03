import React from 'react'


const Devicemanagemntmenu = () => {
  return (
    <div>
      <section className="bottom-menu-list">
        <div className="d-flex horizontal-menu-scroll p-2">
          <div className="menu-list-item text-center">
            <label>Cabinet</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Planogram</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Details</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Error Log</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Location</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Actions</label>
          </div>
          <div className="menu-list-item text-center">
            <label>Other Settings</label>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Devicemanagemntmenu;