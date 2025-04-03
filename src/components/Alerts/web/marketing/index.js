import useIcons from "../../../../Assets/web/icons/useIcons";
import FormInput from "../../../../Widgets/web/FormInput";
import SearchSelect from "../../../../Widgets/web/SearchSelect";
import issueReported from "../../../../Assets/web/images/Alerts/issue-reported.svg";
import serviceIssue from "../../../../Assets/web/images/Alerts/service-issue.svg";
import vendingAlert from "../../../../Assets/web/images/Alerts/vending-alert.svg";
import paymentAlert from "../../../../Assets/web/images/Alerts/payment-alert.svg";
import machineIssue from "../../../../Assets/web/images/Alerts/machine-issue.svg";
import payOffiline from "../../../../Assets/web/images/Alerts/pay-offline.svg";
import appVendAlert from "../../../../Assets/web/images/Alerts/app-vend-alert.svg";
import bumpAlert from "../../../../Assets/web/images/Alerts/bump-alert.svg";
import PaymentAlert from "../payments";

export default function MarketingAlert() {
  const { SearchIcon, DownloadIcon, UploadIcon, RightCornerIcon, LeftCornerIcon } = useIcons();
  return (
    <div className="w--full d--flex flex--column gap--md AlertPage  h--full">
      <div className="d--flex justify-content--between align-items--center h-min--36">
        <div className="w-max--400 w--full position--relative">
          <div className="font--lg font--900">Marketing</div>
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
            All Issues Reported
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={issueReported} alt="issueReported" width={80} />
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
            Bump In/Out Issues
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={bumpAlert} alt="bumpAlert" width={80} />
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
            Vending Issues
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
            Machine Issues
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={machineIssue} alt="machineIssue" width={80} />
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
            Service Issues
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={serviceIssue} alt="serviceIssue" width={80} />
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
            No Comms
            <div className="w-min--24 h-min--24 w-max--24 h-max--24 bg--danger-800 text--white radius--full d--flex align-items--center justify-content--center font--sm">4</div>
          </div>
          <div className="h-min--200 h-max--200 d--flex align-items--center justify-content--center">
            <img src={payOffiline} alt="payOffiline" width={80} />
          </div>
        </div>
      </div>
    </div>
  );
}
