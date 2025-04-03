import React, { useEffect, useState } from "react";
import FormInput from "../../../../Widgets/web/FormInput";
import FormSelect from "../../../../Widgets/web/FormSelect";
import useIcons from "../../../../Assets/web/icons/useIcons";
import machineVendImg from "../../../../Assets/web/images/Alerts/userVendMachine.svg";
import Button from "../../../../Widgets/web/Button";

export default function ResetPlanogram() {
  const { SearchIcon, ArrowLongLeftIcon } = useIcons();
  return (
    <div className="w--full d--flex flex--column gap--md machineMainPage resetMachinePage h--full">
      {/* <div className="d--flex align-items--center justify-content--center h--full w--full bg--white radius--md font--lg font--600">Machine</div> */}
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900 d--flex align-items--center gap--sm">
              <div className="d--flex c--pointer">
                <ArrowLongLeftIcon />
              </div>
              Reset Planogram
            </div>
          </div>

          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <div className="w--full w-max--250 position--relative">
              <FormInput placeholder="Search" />
              <div className="d--flex position--absolute right--10 bottom--4 text--black-200">
                <SearchIcon width={15} />
              </div>
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect />
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect />
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect />
            </div>
          </div>
        </div>
      </div>
      <div className="w--full  d--flex align-items--center h-min--50 font--sm font--600  bg--white p--md radius--md text--warning">Warning: This will reset full Planogram of iqs01, products needs to be assigned again to machine iqs01</div>
      <div className="w--full h--full  d--flex flex--column align-items--center justify-content--between h-min--50 font--sm font--600  bg--white p--md radius--md resetMachineList">
        <div className="w--full h--full d--flex align-items--center justify-content--center flex--column gap--md ">
          <img src={machineVendImg} alt="machineVendImg" width={120} />
          <div className="font--600 font--2xl text--black-600">iqs01</div>
        </div>
        <div className="w--full d--flex gap--sm justify-content--center p-b--md">
          <Button variant="white" color="black" btnClasses="btn border-full--black-200 w-min--200 w-max--200" type="button">
            Back
          </Button>
          <Button variant="primary" color="white" btnClasses="btn  w-min--200 w-max--200" type="button">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
