import React, { useEffect, useState } from "react";
import FormSelect from "../../../../Widgets/web/FormSelect";
import FormInput from "../../../../Widgets/web/FormInput";
import Button from "../../../../Widgets/web/Button";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Dropdown from "../../../../Widgets/web/Dropdown";

export default function PlanoGramList() {
  const { SearchIcon, UploadIcon, CaretIcon, FullScreenIcon, ExportIcon } = useIcons();

  const dropList = {
    component: ({ item }) => <div>{item?.title}</div>,
    data: [
      { id: 1, title: "Export Pdf", value: "PDF" },
      { id: 2, title: "Export Xls", value: "XLS" },
    ],
  };

  const dropEl = (
    <div className="d--flex align-items--center font--sm font--600 gap--sm">
      <Button ariant="black-50" color="black-600" btnClasses="btn white-space--nowrap gap--sm w-max--150 " type="button">
        <ExportIcon width={16} />
        Export
      </Button>
    </div>
  );
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
      <div className="w--full  bg--white p--sm radius--md d--flex flex--column gap--sm">
        <div className="w--full h--full d--flex justify-content--between">
          <div className="d--flex gap--sm justify-content--end  w-max--200">
            <Button variant="primary" color="white" btnClasses="btn white-space--nowrap gap--sm">
              <UploadIcon width={18} />
              Uplaod Planogram
            </Button>
          </div>
          <div className="d--flex gap--sm justify-content--end w--full w-max--400">
            <div className="bg--black-100 radius--sm dropdownNoPadding p-r--sm">
              <Dropdown closeOnClickOutside={true} dropList={dropList} caretComponent={CaretIcon} showcaret={true}>
                {dropEl}
                <div className="d--flex "></div>
              </Dropdown>
            </div>

            <Button variant="black-50" color="black-600" btnClasses="btn white-space--nowrap gap--sm w-max--150 " type="button">
              <FullScreenIcon width={18} />
              Expend All
            </Button>
          </div>
        </div>
      </div>
      <div className=" h--full w--full bg--white radius--md p--sm">Planogram List</div>
    </div>
  );
}
