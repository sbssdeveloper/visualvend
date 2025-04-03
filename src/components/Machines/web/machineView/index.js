import React, { useEffect, useState } from "react";

import MachintActivity from "../../../../Assets/web/images/Alerts/machine-activity.svg";
// import Spinner from "../../../Widgets/web/Spinner";
import { useNavigate } from "react-router-dom";
import useIcons from "../../../../Assets/web/icons/useIcons";
import FormInput from "../../../../Widgets/web/FormInput";
import FormSelect from "../../../../Widgets/web/FormSelect";
import Button from "../../../../Widgets/web/Button";
import Spinner from "../../../../Widgets/web/Spinner";

export default function MachineView() {
  const { SearchIcon, PlusIcon, RightCornerIcon, LeftCornerIcon, RestoreIcon } = useIcons();
  const navigate = useNavigate();
  return (
    <div className="w--full d--flex flex--column gap--md machineMainPage h--full">
      {/* <div className="d--flex align-items--center justify-content--center h--full w--full bg--white radius--md font--lg font--600">Machine</div> */}
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Machine</div>
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
      <div className="w--full d--flex justify-content--between gap--xl bg--white p--md radius--md">
        <div className="w--full d--flex gap--sm w-max--400">
          <FormSelect />
        </div>
        <div className=" d--flex gap--sm justify-content--end w-max--600">
          <Button variant="primary" color="white" btnClasses="btn gap--xs w-min--100 white-space--nowrap" type="button">
            <RestoreIcon width={20} /> Restore Planogram
          </Button>
        </div>
      </div>
      <div className="w--full d--grid grid--5 grid--5--md  gap--lg">
        <div className="gridItem w--full h--full bg bg--white p-r--lg p-l--lg p-t--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            iqs01
            <div className="w-min--24 h-min--24  d--flex align-items--center justify-content--center text--primary ">0.00</div>
          </div>
          <div className="h-min--125 h-max--125 d--flex align-items--center justify-content--center">
            <img src={MachintActivity} alt="vendingAlert" width={80} />
          </div>
          <div className="w--full border-bottom--black-100 d--flex align-items--center font--md text--black-600 font--500"></div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Quantity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Capacity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-transparent d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Position <div className="font--sm font--600 text--primary">1</div>
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p-r--lg p-l--lg p-t--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            iqs01
            <div className="w-min--24 h-min--24  d--flex align-items--center justify-content--center text--primary ">0.00</div>
          </div>
          <div className="h-min--125 h-max--125 d--flex align-items--center justify-content--center">
            <img src={MachintActivity} alt="vendingAlert" width={80} />
          </div>
          <div className="w--full border-bottom--black-100 d--flex align-items--center font--md text--black-600 font--500"></div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Quantity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Capacity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-transparent d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Position <div className="font--sm font--600 text--primary">1</div>
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p-r--lg p-l--lg p-t--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            iqs01
            <div className="w-min--24 h-min--24  d--flex align-items--center justify-content--center text--primary ">0.00</div>
          </div>
          <div className="h-min--125 h-max--125 d--flex align-items--center justify-content--center">
            <img src={MachintActivity} alt="vendingAlert" width={80} />
          </div>
          <div className="w--full border-bottom--black-100 d--flex align-items--center font--md text--black-600 font--500"></div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Quantity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Capacity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-transparent d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Position <div className="font--sm font--600 text--primary">1</div>
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p-r--lg p-l--lg p-t--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            iqs01
            <div className="w-min--24 h-min--24  d--flex align-items--center justify-content--center text--primary ">0.00</div>
          </div>
          <div className="h-min--125 h-max--125 d--flex align-items--center justify-content--center">
            <img src={MachintActivity} alt="vendingAlert" width={80} />
          </div>
          <div className="w--full border-bottom--black-100 d--flex align-items--center font--md text--black-600 font--500"></div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Quantity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Capacity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-transparent d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Position <div className="font--sm font--600 text--primary">1</div>
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p-r--lg p-l--lg p-t--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            iqs01
            <div className="w-min--24 h-min--24  d--flex align-items--center justify-content--center text--primary ">0.00</div>
          </div>
          <div className="h-min--125 h-max--125 d--flex align-items--center justify-content--center">
            <img src={MachintActivity} alt="vendingAlert" width={80} className="h-max--80 w-max--80" />.
          </div>
          <div className="w--full border-bottom--black-100 d--flex align-items--center font--md text--black-600 font--500"></div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Quantity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Capacity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-transparent d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Position <div className="font--sm font--600 text--primary">1</div>
          </div>
        </div>
        <div className="gridItem w--full h--full bg bg--white p-r--lg p-l--lg p-t--lg radius--md d--flex flex--column position--relative">
          <div className="position--absolute text--secondary right---5 top---4 ">
            <RightCornerIcon width={30} height={30} />
          </div>
          <div className="position--absolute text--secondary left---4 bottom---10 ">
            <LeftCornerIcon width={30} height={30} />
          </div>
          <div className="font--md font--500 d--flex align-items--center justify-content--between p-b--md border-bottom--black-100">
            iqs01
            <div className="w-min--24 h-min--24  d--flex align-items--center justify-content--center text--primary ">0.00</div>
          </div>
          <div className="h-min--125 h-max--125 d--flex align-items--center justify-content--center">
            <img src={MachintActivity} alt="vendingAlert" width={80} />
          </div>
          <div className="w--full border-bottom--black-100 d--flex align-items--center font--md text--black-600 font--500"></div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Quantity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-100 d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Capacity <div className="font--sm font--600 text--primary">1</div>
          </div>
          <div className="w--full h-min--40 border-bottom--black-transparent d--flex align-items--center justify-content--between font--sm text--black-600 font--500">
            Position <div className="font--sm font--600 text--primary">1</div>
          </div>
        </div>
      </div>
      <div className="w--full  text--primary text--r c--pointer d--flex justify-content--center  font--sm font--500">
        <div className="bg--black-50 w-max--150 text--black-800 radius--full w--full d--flex justify-content--start align-items--center h-min--36 p-l--md pr--md">
          <div className="w-min--36 h-min--32 d--flex align-items--center justify-content--start">
            {" "}
            <Spinner />
          </div>
          <div className="d--flex">Load More</div>
        </div>
      </div>
    </div>
  );
}
