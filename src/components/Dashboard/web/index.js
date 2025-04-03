import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import useIcons from "../../../Assets/web/icons/useIcons";
import { setCommonMachineFilter } from "../../../redux/slices/common-filter-slice";
import { dashboardInfo, machineList } from "../action";
import Spinner from "../../../Widgets/web/Spinner";
import SearchSelect from "../../../Widgets/web/SearchSelect";
import TableWithPagination from "../../../Widgets/web/CommonTable";
import { ALL_MACHINES_CONST, RECENT_FEED_TABLE_COLUMNS, REFILL_TABLE_COLUMNS, TASK_TABLE_COLUMNS, VEND_RUN_TABLE_COLUMNS } from "../../../Helpers/constant";
import CommonDateFilter from "../../../Widgets/web/CommonDateFilter";
import FullScreenLoader from "../../../Widgets/web/FullScreenLoader";
import { Container, Row, Col } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

export default function Dashboard() {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const { TaskIcon, VendRunIcon, RefillIcon, RightCornerIcon, LeftCornerIcon } = useIcons();
  const dispatch = useDispatch();
  const commonMachineIdFilter = useSelector((state) => state.commonFilter.commonMachineIdFilter);
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState(commonMachineIdFilter);
  const [sdates, setSDates] = useState(null);
  const [edates, setEDates] = useState(null);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    dispatch(setCommonMachineFilter(selectedOption));
  };

  const {
    isLoading,
    data: dashboardInfoList,
    isFetching,
  } = useQuery({
    queryKey: ["dashboardInfo", search, selectedOption, edates, sdates],
    queryFn: () =>
      dashboardInfo({
        search,
        start_date: sdates,
        end_date: edates,
        machine_id: selectedOption?.value === "All machines" ? "" : selectedOption?.value || "",
      }),
    onSuccess: (data) => { },
    select: (data) => {
      return data.data.data;
    },
    enabled: sdates && edates ? true : false,
  });

  const { vend_beat = {}, other = {} } = dashboardInfoList || {};
  const { total = 0, connected = 0, offline = 0, fluctuating = 0 } = vend_beat;
  const noResponse = parseInt(total) - (parseInt(connected) + parseInt(offline) + parseInt(fluctuating));

  const handlePageChange = (page) => {
  };

  console.log("dashboardInfoList", dashboardInfoList);


 
  return (
    <>
      {!isMobile && (
      <div className="w--full d--flex flex--column gap--md dashboardPage h--full">
        {isFetching && <FullScreenLoader />}
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Home</div>
          </div>
          <div className="d--flex align-items--center gap--sm w--full w-max--600">
            {isLoading ? (
              <div className="d--flex w-min--36 justify-content--end">
                <Spinner />
              </div>
            ) : (
              <div className="d--flex w-min--36 justify-content--end"></div>
            )}

            <CommonDateFilter {...{ setSDates, setEDates }} />

            <SearchSelect
              {...{
                selectedOption,
                handleChange,
                uniqueKey: "machineIds",
                uniqueFn: () => machineList({ type: "list" }),
                labelKey: "machine_name",
                valueKey: "id",
                placeholder: "Select machine",
                extraColumObj: ALL_MACHINES_CONST,
              }}
            />
          </div>
        </div>
        <div className="d--flex gap--md w--full">
          <div className="w--full">
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative ">
              <div className="position--absolute text--orange right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--orange left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--600 p-b--sm m-b--sm border-bottom--orange-100 text--black-800"> All Machines</div>
              <div className="d--flex gap--sm">
                <div className="font--sm gap--sm d--flex align-items--center font--500 w--full">
                  <span className="font--600  font--lg">{dashboardInfoList?.vend_machines}</span> Vend Machines
                </div>
                <div className="font--xs gap--sm d--flex align-items--center  justify-content--end white-space--nowrap">
                  <span className="font--500 ">{other?.bump_in || 0}</span> Bump In
                </div>
              </div>
              <div className="d--flex gap--sm">
                <div className="font--sm gap--sm d--flex align-items--center w--full ">
                  <span className="font--600">{dashboardInfoList?.items_vended?.vended_items}</span> Items Vended
                </div>
                <div className="font--xs gap--sm d--flex align-items--center  justify-content--end white-space--nowrap">
                  <span className="">{other?.bump_out || 0}</span> Bump Out
                </div>
              </div>
            </div>
          </div>
          <div className="w--full">
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm topBoxItem position--relative">
              <div className="position--absolute text--orange right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--orange left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--600 p-b--sm m-b--sm border-bottom--orange-100 text--black-800"> Total Vend Sales</div>
              <div className="d--flex gap--sm">
                <div className="font--sm gap--sm d--flex align-items--center font--500 w--full">
                  <span className="font--600 text--black font--lg">{dashboardInfoList?.vend_sales?.total || "0"}</span> (${dashboardInfoList?.vend_sales?.total_payments || "0"} fees)
                </div>
                <div className="font--xs gap--sm d--flex align-items--center justify-content--end white-space--nowrap">
                  <span className="font--500">Card</span> ${dashboardInfoList?.vend_sales?.card_sales || 0}
                </div>
              </div>
              <div className="d--flex gap--sm">
                <div className="font--sm gap--sm d--flex align-items--center w--full">
                  <span className="font--600">Today</span> {dashboardInfoList?.items_vended?.today_sales || 0}
                </div>

                <div className="font--xs gap--sm d--flex align-items--center justify-content--end white-space--nowrap">
                  <span className="">Mobile</span> ${dashboardInfoList?.vend_sales?.mobile_payments || 0}
                </div>
              </div>
            </div>
          </div>
          <div className="w--full">
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm topBoxItem position--relative">
              <div className="position--absolute text--orange right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--orange left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--600 p-b--sm m-b--sm border-bottom--orange-100 text--black-800"> VendBeat</div>

              <div className="d--flex gap--sm">
                <div className="font--sm gap--sm d--flex align-items--center font--500 w--full">
                  <span className="font--600 text--black font--lg">{dashboardInfoList?.machines?.connected || "0"}</span> {/* Active (89 Pay Dev) */}
                  Active
                </div>
                <div className="font--xs gap--sm d--flex align-items--center white-space--nowrap">
                  <span className="font--500">{dashboardInfoList?.machines?.offline || "0"}</span> Offline
                </div>
              </div>
              <div className="d--flex gap--sm">
                <div className="font--sm gap--sm d--flex align-items--center w--full">
                  <span className="font--600">{dashboardInfoList?.machines?.fluctuating || "0"}</span> {/* In-active (04 Txn Err) */}
                  In-active
                </div>

                <div className="font--xs gap--sm d--flex align-items--center white-space--nowrap">
                  <span className="">{noResponse || 0}</span> No response
                </div>
              </div>
            </div>
          </div>
          <div className="w--full">
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm topBoxItem position--relative">
              <div className="position--absolute text--orange right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--orange left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--600 p-b--sm m-b--sm border-bottom--orange-100 text--black-800">Stock Levels</div>
              <div className="d--flex gap--sm">
                <div className="font--sm gap--sm d--flex align-items--center font--500 w--full">
                  <span className="font--600 text--black font--lg ">{dashboardInfoList?.stock_level?.required_quantity || "0%"}</span>
                </div>
                <div className="font--sm gap--sm d--flex align-items--center white-space--nowrap">
                  <span className="font--600">Slow sell</span> {dashboardInfoList?.stock_level?.slow_sell || "0"}
                </div>
              </div>
              <div className="d--flex gap--sm">
                <div className="font--sm gap--sm d--flex align-items--center w--full white-space--nowrap">
                  <span className="font--600">In Stock</span> {dashboardInfoList?.stock_level?.in_stock || "0"} aisles
                </div>

                <div className="font--xs gap--sm d--flex align-items--center white-space--nowrap">
                  <span className="">Out of stock -</span> {dashboardInfoList?.stock_level?.out_of_stock || "0"} aisles
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w--full  d--flex gap--md">
          <div className="w--full ">
            <div className="font--md font--600 m-b--xs d--flex align-items--center gap--sm">
              <span className="text--orange d--flex">
                <RefillIcon width={20} />
              </span>
              Recent Vend
            </div>
            <div className=" w--full halfTable position--relative">
              <TableWithPagination key="Vend_run" data={dashboardInfoList?.recent_vend || []} itemsPerPage={10} onPageChange={handlePageChange} columns={VEND_RUN_TABLE_COLUMNS} isPagination={false} isColumns={true} />
            </div>
          </div>
          <div className="w--full ">
            <div className="font--md font--600 m-b--xs d--flex align-items--center gap--sm">
              <span className="text--orange d--flex">
                <TaskIcon width={20} />
              </span>
              Recent Refill
            </div>
            <div className=" w--full halfTable">
              <TableWithPagination key="refill" data={dashboardInfoList?.recent_refill || []} itemsPerPage={10} onPageChange={handlePageChange} columns={REFILL_TABLE_COLUMNS} isPagination={false} isColumns={true} />
            </div>
          </div>
        </div>
        <div className="w--full halfTable d--flex gap--md">
          <div className="w--full ">
            <div className="font--md font--600 m-b--xs d--flex align-items--center gap--sm">
              <span className="text--orange d--flex">
                <VendRunIcon width={20} />
              </span>
              Recent Feed
            </div>
            <div className=" w--full ">
              <TableWithPagination key="recent_feed" data={dashboardInfoList?.recent_feed || []} itemsPerPage={10} onPageChange={handlePageChange} columns={RECENT_FEED_TABLE_COLUMNS} isPagination={false} isColumns={true} />
            </div>
          </div>
          <div className="w--full">
            <div className="font--md font--600 m-b--xs d--flex align-items--center gap--sm">
              <span className="text--orange d--flex">
                <VendRunIcon width={20} />
              </span>
              Tasks
            </div>
            <div className=" w--full ">
              <TableWithPagination key="tasks" data={[]} itemsPerPage={10} onPageChange={handlePageChange} columns={TASK_TABLE_COLUMNS} isPagination={false} isColumns={true} />
            </div>
          </div>
        </div>
      </div>
      )}

    {isMobile && (
      <div className="w--full d--flex flex--column gap--md dashboardPage h--full">
        {isFetching && <FullScreenLoader />}

      <div className="container">
          <div className="d--flex w--full gap--sm w-max--600">
            <div className="font--lg font--900">Home</div>
            <SearchSelect
              {...{
                selectedOption,
                handleChange,
                uniqueKey: "machineIds",
                uniqueFn: () => machineList({ type: "list" }),
                labelKey: "machine_name",
                valueKey: "id",
                placeholder: "Select machine",
                extraColumObj: ALL_MACHINES_CONST,
              }}
            />
          </div>
          <div className="d--flex m-t--sm align-items--center gap--sm w--full w-max--600">
            {isLoading &&(
              <div className="d--flex w-min--36 justify-content--end">
                <Spinner />
              </div>
            ) }
            <CommonDateFilter {...{ setSDates, setEDates }} />
          </div>
      </div>


        {/* Modified Section for All Machines */}
        <div className="d--flex flex--column gap--md w--full">
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative">
            <div className="position--absolute text--orange right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--orange left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--600 p-b--sm m-b--sm border-bottom--orange-100 text--black-800">
              All Machines
            </div>
            <div className="d--flex gap--sm flex--wrap">
              <div className="font--sm gap--sm d--flex align-items--center font--500 w--full">
                <span className="font--600 font--lg">{dashboardInfoList?.vend_machines}</span> Vend Machines
              </div>
              <div className="font--xs gap--sm d--flex align-items--center justify-content--end white-space--nowrap">
                <span className="font--500">{other?.bump_in || 0}</span> Bump In
              </div>
            </div>
            <div className="d--flex gap--sm flex--wrap">
              <div className="font--sm gap--sm d--flex align-items--center w--full">
                <span className="font--600">{dashboardInfoList?.items_vended?.vended_items}</span> Items Vended
              </div>
              <div className="font--xs gap--sm d--flex align-items--center justify-content--end white-space--nowrap">
                <span className="">{other?.bump_out || 0}</span> Bump Out
              </div>
            </div>
          </div>
        </div>

        {/* Modified Section for Total Vend Sales */}
        <div className="d--flex flex--column gap--md w--full">
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm topBoxItem position--relative">
            <div className="position--absolute text--orange right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--orange left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--600 p-b--sm m-b--sm border-bottom--orange-100 text--black-800">
              Total Vend Sales
            </div>
            <div className="d--flex gap--sm flex--wrap">
              <div className="font--sm gap--sm d--flex align-items--center font--500 w--full">
                <span className="font--600 text--black font--lg">
                  {dashboardInfoList?.vend_sales?.total || "0"}
                </span>{" "}
                (${dashboardInfoList?.vend_sales?.total_payments || "0"} fees)
              </div>
              <div className="font--xs gap--sm d--flex align-items--center justify-content--end white-space--nowrap">
                <span className="font--500">Card</span> ${dashboardInfoList?.vend_sales?.card_sales || 0}
              </div>
            </div>
            <div className="d--flex gap--sm flex--wrap">
              <div className="font--sm gap--sm d--flex align-items--center w--full">
                <span className="font--600">Today</span> {dashboardInfoList?.items_vended?.today_sales || 0}
              </div>
              <div className="font--xs gap--sm d--flex align-items--center justify-content--end white-space--nowrap">
                <span className="">Mobile</span> ${dashboardInfoList?.vend_sales?.mobile_payments || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Modified Section for VendBeat */}
        <div className="d--flex flex--column gap--md w--full">
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm topBoxItem position--relative">
            <div className="position--absolute text--orange right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--orange left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--600 p-b--sm m-b--sm border-bottom--orange-100 text--black-800">
              VendBeat
            </div>
            <div className="d--flex gap--sm flex--wrap">
              <div className="font--sm gap--sm d--flex align-items--center font--500 w--full">
                <span className="font--600 text--black font--lg">
                  {dashboardInfoList?.machines?.connected || "0"}
                </span>{" "}
                Active
              </div>
              <div className="font--xs gap--sm d--flex align-items--center white-space--nowrap">
                <span className="font--500">{dashboardInfoList?.machines?.offline || "0"}</span> Offline
              </div>
            </div>
            <div className="d--flex gap--sm flex--wrap">
              <div className="font--sm gap--sm d--flex align-items--center w--full">
                <span className="font--600">
                  {dashboardInfoList?.machines?.fluctuating || "0"}
                </span>{" "}
                In-active
              </div>
              <div className="font--xs gap--sm d--flex align-items--center white-space--nowrap">
                <span className="">{noResponse || 0}</span> No response
              </div>
            </div>
          </div>
        </div>

        {/* Modified Section for Stock Levels */}
        <div className="d--flex flex--column gap--md w--full">
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm topBoxItem position--relative">
            <div className="position--absolute text--orange right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--orange left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--600 p-b--sm m-b--sm border-bottom---100 text--black-800">
              Stock Levels
            </div>
            <div className="d--flex gap--sm flex--wrap">
              <div className="font--sm gap--sm d--flex align-items--center font--500 w--full">
                <span className="font--600 text--black font--lg ">
                  {dashboardInfoList?.stock_level?.required_quantity || "0%"}
                </span>
              </div>
              <div className="font--sm gap--sm d--flex align-items--center white-space--nowrap">
                <span className="font--600">Slow sell</span> {dashboardInfoList?.stock_level?.slow_sell || "0"}
              </div>
            </div>
            <div className="d--flex gap--sm flex--wrap">
              <div className="font--sm gap--sm d--flex align-items--center w--full white-space--nowrap">
                <span className="font--600">In Stock</span> {dashboardInfoList?.stock_level?.in_stock || "0"} aisles
              </div>
              <div className="font--xs gap--sm d--flex align-items--center white-space--nowrap">
                <span className="">Out of stock -</span> {dashboardInfoList?.stock_level?.out_of_stock || "0"} aisles
              </div>
            </div>
          </div>
        </div>

        {/* Modified Section for Recent Vend and Refill */}
        <div className="w--full flex--wrap gap--md">
          <div className="w--full  m-t--lg">
            <div className="font--md font--600 m-b--xs d--flex align-items--center gap--sm">
              <span className="text--orange d--flex">
                <RefillIcon width={20} />
              </span>
              Recent Vend
            </div>
            <div className="w--full halfTable position--relative">
              <TableWithPagination key="Vend_run" data={dashboardInfoList?.recent_vend || []} itemsPerPage={10} onPageChange={handlePageChange} columns={VEND_RUN_TABLE_COLUMNS} isPagination={false} isColumns={true} />
            </div>
          </div>
          <div className="w--full  m-t--lg">
            <div className="font--md font--600 m-b--xs d--flex align-items--center gap--sm">
              <span className="text--orange d--flex">
                <TaskIcon width={20} />
              </span>
              Recent Refill
            </div>
            <div className="w--full halfTable">
              <TableWithPagination key="refill" data={dashboardInfoList?.recent_refill || []} itemsPerPage={10} onPageChange={handlePageChange} columns={REFILL_TABLE_COLUMNS} isPagination={false} isColumns={true} />
            </div>
          </div>
        </div>

        {/* Modified Section for Recent Feed */}
        <div className="w--full halfTable flex--wrap gap--md">
          <div className="w--full  m-t--lg">
            <div className="font--md font--600 m-b--xs d--flex align-items--center gap--sm">
              <span className="text--orange d--flex">
                <VendRunIcon width={20} />
              </span>
              Recent Feed
            </div>
            <div className="w--full">
              <TableWithPagination key="recent_feed" data={dashboardInfoList?.recent_feed || []} itemsPerPage={10} onPageChange={handlePageChange} columns={RECENT_FEED_TABLE_COLUMNS} isPagination={false} isColumns={true} />
            </div>
          </div>
          <div className="w--full  m-t--lg">
            <div className="font--md font--600 m-b--xs d--flex align-items--center gap--sm">
              <span className="text--orange d--flex">
                <VendRunIcon width={20} />
              </span>
              Tasks
            </div>
            <div className="w--full">
              <TableWithPagination key="tasks" data={[]} itemsPerPage={10} onPageChange={handlePageChange} columns={TASK_TABLE_COLUMNS} isPagination={false} isColumns={true} />
            </div>
          </div>
        </div>
      </div>
    )}

    </>


  );
}
