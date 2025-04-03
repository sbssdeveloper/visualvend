import React, { useEffect, useState } from "react";

import useIcons from "../../../../Assets/web/icons/useIcons";
import FormInput from "../../../../Widgets/web/FormInput";
import SearchSelect from "../../../../Widgets/web/SearchSelect";
import stockLevel from "../../../../Assets/web/images/Alerts/stock-level.svg";
import lowStock from "../../../../Assets/web/images/Alerts/low-stock.svg";
import outOffStock from "../../../../Assets/web/images/Alerts/out-of-stock.svg";
import fullStock from "../../../../Assets/web/images/Alerts/full-stock.svg";
import fastedMoving from "../../../../Assets/web/images/Alerts/fasted-moving.svg";
import slowMoving from "../../../../Assets/web/images/Alerts/slow-moving.svg";
import quarantinedStock from "../../../../Assets/web/images/Alerts/quarantined-stock.svg";
import spoiledStock from "../../../../Assets/web/images/Alerts/spoiled-stock.svg";

export default function StockAlert() {
  const { SearchIcon, DownloadIcon, UploadIcon, RightCornerIcon, LeftCornerIcon } = useIcons();
  return (
    <div className="w--full d--flex flex--column gap--md AlertPage  h--full">
      <div className="d--flex justify-content--between align-items--center h-min--36">
        <div className="w-max--400 w--full position--relative">
          <div className="font--lg font--900">Stock</div>
        </div>

        <div className="d--flex align-items--center justify-content--end gap--sm w--full">
          <div className="w--full w-max--250 position--relative">
            <FormInput placeholder="Search" />
            <div className="d--flex position--absolute right--10 bottom--4 text--black-200">
              <SearchIcon width={15} />
            </div>
          </div>
          <div className="w-max--250 w--full">
            <SearchSelect />
          </div>
          <div className="w-max--250 w--full">
            <SearchSelect />
          </div>
          <div className="w-max--250 w--full">
            <SearchSelect />
          </div>
        </div>
      </div>
      <div className="w--full d--flex justify-content--end gap--xl bg--white p--md radius--md">
        <div className="w-max--100 d--flex gap--sm justify-content--end">
          <div className="w-min--36 w-max--36 h-min--36 h-max--36 radius--sm d--flex align-items--center justify-content--center bg--primary text--white c--pointer">
            <DownloadIcon width={18} height={18} />
          </div>
          <div className="w-min--36 w-max--36 h-min--36 h-max--36 radius--sm d--flex align-items--center justify-content--center bg--primary text--white c--pointer">
            <UploadIcon width={18} height={18} />
          </div>
        </div>
      </div>
      <div className="w--full d--grid grid--4  gap--xl">
        <div className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            All Stock Levels
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={stockLevel} alt="stockLevel" width={80} />
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            Low Stock
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={lowStock} alt="lowStock" width={80} />
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            Out of Stock
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={outOffStock} alt="outOffStock" width={80} />
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            Fully Stocked
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={fullStock} alt="fullStock" width={80} />
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            Fastest Moving
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={fastedMoving} alt="fastedMoving" width={80} />
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            Slowest Moving
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={slowMoving} alt="slowMoving" width={80} />
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            Quarantined Stock
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={quarantinedStock} alt="quarantinedStock" width={80} />
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            Spoiled Stock
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={spoiledStock} alt="bumpnAlert" width={80} />
          </div>
        </div>
      </div>
    </div>
  );
}
