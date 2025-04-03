import React, { useEffect, useState } from "react";

import useIcons from "../../../../Assets/web/icons/useIcons";
import FormInput from "../../../../Widgets/web/FormInput";
import SearchSelect from "../../../../Widgets/web/SearchSelect";
import vendigAlert from "../../../../Assets/web/images/Alerts/vending-alert.svg";
import contentAlert from "../../../../Assets/web/images/Alerts/content-alert.svg";
import commonAlert from "../../../../Assets/web/images/Alerts/common-alert.svg";
import paymentAlert from "../../../../Assets/web/images/Alerts/payment-alert.svg";
import appVendAlert from "../../../../Assets/web/images/Alerts/app-vend-alert.svg";
import machineAlert from "../../../../Assets/web/images/Alerts/machine-alert.svg";
import serviceAlert from "../../../../Assets/web/images/Alerts/service-alert.svg";
import machineActivity from "../../../../Assets/web/images/Alerts/machine-activity.svg";

export default function OperationAlert() {
  const { SearchIcon, DownloadIcon, UploadIcon, RightCornerIcon, LeftCornerIcon } = useIcons();
  return (
    <div className="w--full d--flex flex--column gap--md AlertPage  h--full">
      <div className="d--flex justify-content--between align-items--center h-min--36">
        <div className="w-max--400 w--full position--relative">
          <div className="font--lg font--900">Operation</div>
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
            <img src={vendigAlert} alt="vendigAlert" width={80} />
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
            Content/SW Alerts
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={contentAlert} alt="contentAlert" width={80} />
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
            Comms Alerts
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
            Payment Alerts
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={paymentAlert} alt="paymentAlert" width={80} />
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
            App Vend/Pay Alerts
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={appVendAlert} alt="appVendAlert" width={80} />
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
            Machine Alerts
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={machineAlert} alt="machineAlert" width={80} />
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
            Service Alerts
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={serviceAlert} alt="serviceAlert" width={80} />
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
            Machine Activity
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={machineActivity} alt="bumpnAlert" width={80} />
          </div>
        </div>
      </div>
    </div>
  );
}
