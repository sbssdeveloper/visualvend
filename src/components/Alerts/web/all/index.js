import React, { useEffect, useState } from "react";

import useIcons from "../../../../Assets/web/icons/useIcons";
import FormInput from "../../../../Widgets/web/FormInput";
import SearchSelect from "../../../../Widgets/web/SearchSelect";
import vendingAlert from "../../../../Assets/web/images/Alerts/vending-alert.svg";
import refillAlert from "../../../../Assets/web/images/Alerts/refill-alerts.svg";
import refundedAlert from "../../../../Assets/web/images/Alerts/refunded-alert.svg";
import powerAlert from "../../../../Assets/web/images/Alerts/power-alert.svg";
import commonAlert from "../../../../Assets/web/images/Alerts/common-alert.svg";
import tempAlert from "../../../../Assets/web/images/Alerts/temp-alert.svg";
import doorAlert from "../../../../Assets/web/images/Alerts/door-alert.svg";
import bumpAlert from "../../../../Assets/web/images/Alerts/bump-alert.svg";

export default function Alert() {
  const { SearchIcon, DownloadIcon, UploadIcon, RightCornerIcon, LeftCornerIcon } = useIcons();
  return (
    <div className="w--full d--flex flex--column gap--md AlertPage  h--full">
      <div className="d--flex justify-content--between align-items--center h-min--36">
        <div className="w-max--400 w--full position--relative">
          <div className="font--lg font--900">All</div>
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
            Vending Alerts
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={vendingAlert} alt="vendingAlert" width={80} />
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
            Refill Alerts
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={refillAlert} alt="refillAlert" width={80} />
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
            Refunded Vends
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={refundedAlert} alt="refundedAlert" width={80} />
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
            Power Issues
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={powerAlert} alt="powerAlert" width={80} />
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
            Comms Issues
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={commonAlert} alt="commonAlert" width={80} />
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
            Temp Alerts
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={tempAlert} alt="tempAlert" width={80} />
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
            Door Activity
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={doorAlert} alt="doorAlert" width={80} />
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
            Bump In/Out
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={bumpAlert} alt="bumpnAlert" width={80} />
          </div>
        </div>
      </div>
    </div>
  );
}
