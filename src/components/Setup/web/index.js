import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import FormSelect from "../../../Widgets/web/FormSelect";
import useIcons from "../../../Assets/web/icons/useIcons";
import FormInput from "../../../Widgets/web/FormInput";
import TableWithPagination from "../../../Widgets/web/CommonTable";

export default function Setup() {
  const { SearchIcon } = useIcons();
  return (
    <div className="w--full d--flex flex--column gap--md reOrderPage  h--full">
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Setup</div>
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
    </div>
  );
}
