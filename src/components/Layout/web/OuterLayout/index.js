import React from "react";
import { Outlet } from "react-router-dom";

export default function OuterLayout() {
  return (
    <div className="w--full  h--full bg--contrast d--flex align-items--center justify-content--center loginPage">
      <div className="radius--md  gap--xl w-max--500 w--full bg--secondary p--xl z-index--xs bg--white box-shadow d--flex align-items--center justify-content--center flex--column gap--xs h-min--300">
        <Outlet />
      </div>
    </div>
  );
}
