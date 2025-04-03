import React, { useEffect, useState } from "react";

import useIcons from "../../../../Assets/web/icons/useIcons";
import FormInput from "../../../../Widgets/web/FormInput";
import SearchSelect from "../../../../Widgets/web/SearchSelect";
import payment from "../../../../Assets/web/images/Alerts/payment.svg";
import paydev from "../../../../Assets/web/images/Alerts/paydev.svg";
import paymentDecline from "../../../../Assets/web/images/Alerts/payment-decline.svg";
import payOffline from "../../../../Assets/web/images/Alerts/pay-offline.svg";
import mobilePay from "../../../../Assets/web/images/Alerts/mobile-pay.svg";
import payFail from "../../../../Assets/web/images/Alerts/pay-fail.svg";
import payVended from "../../../../Assets/web/images/Alerts/pay-vended.svg";
import userCancel from "../../../../Assets/web/images/Alerts/user-cancel.svg";

export default function PaymentAlert() {
  const { SearchIcon, DownloadIcon, UploadIcon, RightCornerIcon, LeftCornerIcon } = useIcons();
  return (
    <div className="w--full d--flex flex--column gap--md AlertPage  h--full">
      <div className="d--flex justify-content--between align-items--center h-min--36">
        <div className="w-max--400 w--full position--relative">
          <div className="font--lg font--900">Payment</div>
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
            Payment Accepted
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={payment} alt="payment" width={80} />
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
            Pay Dev Cancelled
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={paydev} alt="paydev" width={80} />
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
            Payment Declined
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={paymentDecline} alt="paymentDecline" width={80} />
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
            Pay Dev Offline
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={payOffline} alt="payOffline" width={80} />
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
            Mobile Pay/Vended
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={mobilePay} alt="mobilePay" width={80} />
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
            Pay Dev Comms Fail
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={payFail} alt="payFail" width={80} />
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
            Mobile Pay/No Vended
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={payVended} alt="payVended" width={80} />
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
            User Cancelled
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={userCancel} alt="bumpnAlert" width={80} />
          </div>
        </div>
      </div>
    </div>
  );
}
