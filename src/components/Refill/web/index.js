import React, { useEffect, useState } from "react";
import FormInput from "../../../Widgets/web/FormInput";
import FormSelect from "../../../Widgets/web/FormSelect";
import useIcons from "../../../Assets/web/icons/useIcons";
import TableWithPagination from "../../../Widgets/web/CommonTable";
import { LocationIcon } from "../../../Assets/native/images";

export default function RefillProduct() {
  const { SearchIcon, LocationIcon } = useIcons();
  return (
    <div className="w--full d--flex flex--column gap--md refillProductPage  h--full">
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Refill Menu</div>
          </div>

          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <div className="w--full w-max--250 position--relative">
              <FormInput
                placeholder="Search"
                icon={
                  <div className="d--flex position--absolute left--10 top--5 text--black-400">
                    <SearchIcon width={15} />
                  </div>
                }
              />
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect />
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect
                icon={
                  <div className="d--flex position--absolute left--10 top--5 text--black-400">
                    <LocationIcon width={20} />
                  </div>
                }
              />
            </div>
            <div className="w--full w-max--250 ">
              <FormSelect />
            </div>
          </div>
        </div>
      </div>
      <div className="w--full d--flex justify-content--between gap--xl bg--white p--md radius--md">
        <FormSelect />
        <FormSelect />
        <FormSelect />
      </div>
      <div className="w--full h--full d--flex flex--column gap--xs">
        <div className="w--full h-min--36 font--md font--600 align-items--center d--flex  ">Stock Levels</div>
        <div className="d--flex flex--column w--full h--full bg--white gap--lg radius--md p--sm refillProductList">
          <TableWithPagination />
        </div>
      </div>
    </div>
  );
}
