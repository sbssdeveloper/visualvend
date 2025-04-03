import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useIcons from "../../../Assets/web/icons/useIcons";
import { getPercentage } from "../../../Helpers/resource";
import { paymentList } from "../action";
import { setCommonMachineFilter } from "../../../redux/slices/common-filter-slice";
import Spinner from "../../../Widgets/web/Spinner";
import SearchSelect from "../../../Widgets/web/SearchSelect";
import { ALL_MACHINES_CONST, PAYEMNT_PAGE_TYPE } from "../../../Helpers/constant";
import { machineList } from "../../Dashboard/action";
import PieChart from "../../../Widgets/web/CommonPieChart";
import CommonDateFilter from "../../../Widgets/web/CommonDateFilter";
import FullScreenLoader from "../../../Widgets/web/FullScreenLoader";
import Button from "../../../Widgets/web/Button";
import { getCount } from "../../../Helpers/web";
import { useMediaQuery } from 'react-responsive';

export default function Payments() {
  const commonMachineIdFilter = useSelector((state) => state.commonFilter.commonMachineIdFilter);
  const [selectedOption, setSelectedOption] = useState(commonMachineIdFilter);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  

  const { EyeIcon, RightCornerIcon, LeftCornerIcon } = useIcons();

  const dispatch = useDispatch();
  const [sdates, setSDates] = useState(null);
  const [edates, setEDates] = useState(null);

  function getWidthAccToPercentage(percentage) {
    if (!percentage) return;
    return +percentage.replace("%", "");
  }

  const {
    data: paymentData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["paymentInfo", edates, sdates, selectedOption],
    queryFn: () =>
      paymentList({
        start_date: sdates,
        end_date: edates,
        type: "all",
        machine_id: selectedOption?.value === "All machines" ? "" : selectedOption?.value || "",
      }),
    onSuccess: (data) => { },
    select: (data) => {
      return data.data.data;
    },
    enabled: sdates && edates ? true : false,
  });

  const mobilePaymentsGraphDetails = {
    labels: ["Gpay", "Apple", "Afterpay", "Paypal"],
    backgroundColor: ["#FF6700", "#000", "#f58c45", "#CCCCCC"],
    datasets: [getPercentage(+paymentData?.google_pay, +paymentData?.total_mobile_payments_amount), getPercentage(+paymentData?.apple, +paymentData?.total_mobile_payments_amount), getPercentage(+paymentData?.after_pay, +paymentData?.total_mobile_payments_amount), getPercentage(+paymentData?.paypal, +paymentData?.total_mobile_payments_amount)],
  };

  const cardPaymentsGraphDetails = {
    labels: ["Visa", "Debit card", "Master Card", "Amex"],
    backgroundColor: ["#FF6700", "#000", "#CCCCCC", "#f58c45"],
    datasets: [getPercentage(+paymentData?.visa, +paymentData?.total_card_payments_amount), getPercentage(+paymentData?.debit_card, +paymentData?.total_card_payments_amount), getPercentage(+paymentData?.master_card, +paymentData?.total_card_payments_amount), getPercentage(+paymentData?.amex, +paymentData?.total_card_payments_amount)],
  };

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    dispatch(setCommonMachineFilter(selectedOption));
  };

  return (  
    <>
     {!isMobile && (
    <div className="w--full d--flex flex--column gap--md paymentPage h--full">
      {isFetching && <FullScreenLoader />}
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Payments</div>
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
      </div>
      <div className="d--flex gap--xl w--full">
        <div className="d--grid grid--4 gap--lg w--full  ">
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
            <div className="position--absolute text--orange right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--orange left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black text--c">Total Vend | Total Payments (A$)</div>

            <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">{paymentData?.badges?.vend_total_pay_total_count || 0}  <span className="text--black-200">|</span> {paymentData?.badges?.vend_total_pay_total_amount || 0} (A$)</div>
          </div>
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full">
            <div className="position--absolute text--orange right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--orange left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black text--c">Successful Vends | Successful Payments (A$) </div>

            <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">{paymentData?.badges?.vend_success_pay_success_count || 0} <span className="text--black-200">|</span> {paymentData?.badges?.vend_success_pay_success_amount || 0} (A$)</div>
          </div>
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
            <div className="position--absolute text--orange right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--orange left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black text--c">Failed Vends | Successful Payments (A$)</div>

            <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">{paymentData?.badges?.vend_fail_pay_success_count || 0} <span className="text--black-200">|</span> {paymentData?.badges?.vend_fail_pay_success_amount || 0} (A$)</div>
          </div>
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full">
            <div className="position--absolute text--orange right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--orange left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black text--c">Failed Vends | Failed Payments (A$) </div>

            <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">{paymentData?.badges?.vend_fail_pay_fail_count || 0} <span className="text--black-200">|</span> {paymentData?.badges?.vend_fail_pay_fail_amount || 0} (A$)</div>
          </div>
        </div>
        {/* <div className="d--grid grid--2 gap--lg w--full  ">
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
            <div className="position--absolute text--primary right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--primary left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black">Total Failed Vends </div>

            <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">{getCount(paymentData?.failed_vends || 0, paymentData?.failed_mobile_vends || 0)}</div>
          </div>
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full">
            <div className="position--absolute text--primary right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--primary left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black">Total Refunds</div>

            <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">0</div>
          </div>
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
            <div className="position--absolute text--primary right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--primary left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black">Total Cost Vend Fails (A$)</div>

            <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">{paymentData?.badges?.failed_payments}</div>
          </div>
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full">
            <div className="position--absolute text--primary right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--primary left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black">Total Refunds (A$)</div>

            <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">0</div>
          </div>
        </div> */}
      </div>
      <div className="w--full d--flex gap--xl h--full">
        <div className="w--full d--flex flex--column gap--sm">
          <div className="font--md d--flex justify-content--between align-items--center font--600">
            <div className="w--full d--flex gap--sm h-min--36 align-items--end">
              Total Card Vends
              <span className="font--md font--500 text--black">{paymentData?.total_card_vends || 0}</span>
            </div>
          </div>
          <div className="h--full p--lg gap--xl d--flex w--full bg--white radius--sm flex--column  ">
            {/* <div className="w--full d--flex gap--sm">
              <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                <div className="text--primary font--600 font--lg">{paymentData?.successfull_vends || 0}</div>
                <div className="font--sm text--black-700">Successfull Vends</div>
              </div>
              <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                <div className="text--red font--600 font--lg">{paymentData?.failed_vends || 0}</div>
                <div className="font--sm text--black-700">Failed Vends</div>
              </div>
              <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                <div className="text--danger font--600 font--lg">{paymentData?.pay_failed || 0}</div>
                <div className="font--sm text--black-700">Pay Failed</div>
              </div>
              <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                <div className="text--secondary font--600 font--lg">{paymentData?.in_progress || 0}</div>
                <div className="font--sm text--black-700">In progress</div>
              </div>
            </div> */}
            <div className="d--flex flex--column gap--sm">
              <div className="d--flex align-items--center justify-content--between">
                <div className="font--sm font--500 d--flex gap--sm align-items--center">
                  Vend Success Rate <div className="font--sm d--flex text--orange">({paymentData?.total_card_vend_success || 0})</div>
                </div>
                <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_card_vend_success || 0, +paymentData?.total_card_vends || 0)}%</div>
              </div>
              <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                <div
                  className="bg--primary h-min--3 d--flex align-items--center radius--md"
                  style={{
                    width: `${getPercentage(+paymentData?.total_card_vend_success || 0, +paymentData?.total_card_vends || 0)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="d--flex flex--column gap--sm">
              <div className="d--flex align-items--center justify-content--between">
                <div className="font--sm font--500 d--flex gap--sm align-items--center">
                  Vend Failed Rate <div className="font--sm d--flex text--orange">({paymentData?.total_card_vend_fail || 0})</div>
                </div>
                <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_card_vend_fail || 0, +paymentData?.total_card_vends || 0)}%</div>
              </div>
              <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                <div
                  className="bg--red h-min--3 d--flex align-items--center  radius--md"
                  style={{
                    width: `${getPercentage(+paymentData?.total_card_vend_fail || 0, +paymentData?.total_card_vends || 0)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="d--flex flex--column gap--sm">
              <div className="d--flex align-items--center justify-content--between">
                <div className="font--sm font--500 d--flex gap--sm align-items--center">
                Payment Success Rate <div className="font--sm d--flex text--orange">({paymentData?.total_card_payment_success || 0})</div>
                </div>
                <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_card_payment_success || 0, +paymentData?.total_card_vends || 0)}%</div>
              </div>
              <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                <div
                  className="bg--secondary h-min--3 d--flex align-items--center radius--md"
                  style={{
                    width: `${getPercentage(+paymentData?.total_card_payment_success || 0, +paymentData?.total_card_vends || 0)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="d--flex flex--column gap--sm">
              <div className="d--flex align-items--center justify-content--between">
                <div className="font--sm font--500 d--flex gap--sm align-items--center">
                  Payment Failed Rate <div className="font--sm d--flex text--orange">({paymentData?.total_card_payment_fail || 0})</div>
                </div>
                <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_card_payment_fail || 0, +paymentData?.total_card_vends || 0)}%</div>
              </div>
              <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                <div
                  className="bg--danger-800 h-min--3 d--flex align-items--center radius--md"
                  style={{
                    width: `${getPercentage(+paymentData?.total_card_payment_fail || 0, +paymentData?.total_card_vends || 0)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="d--flex gap--md justify-content--between w--full m-t--sm m-b--sm">
              <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                <div className="text--black-700 font--600 font--md">${paymentData?.master_card || 0}</div>
                <div className="font--sm text--black-700 font--600">Master Card</div>
              </div>
              <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                <div className="text--black-700 font--600 font--md">${paymentData?.visa || 0}</div>
                <div className="font--sm text--black-700 font--600">Visa</div>
              </div>
              <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                <div className="text--black-700 font--600 font--md">${paymentData?.debit_card || 0}</div>
                <div className="font--sm text--black-700 font--600">Debit card</div>
              </div>
              <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                <div className="text--black-700 font--600 font--md">${paymentData?.amex || 0}</div>
                <div className="font--sm text--black-700 font--600">Amex</div>
              </div>
            </div>
          </div>
        </div>
        <div className="w--full d--flex flex--column gap--sm">
          <div className="font--md d--flex justify-content--between align-items--center font--600">
            <div className="w--full d--flex gap--sm h-min--36 align-items--end">
              Total Mobile Vends
              <span className="font--md font--500 text--black">{paymentData?.total_mobile_vends || 0}</span>
            </div>
          </div>

          <div className="h--full p--lg gap--xl d--flex w--full bg--white radius--sm flex--column  ">
            {/* <div className="w--full d--flex gap--sm">
              <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                <div className="text--primary font--600 font--lg">{paymentData?.successfull_mobile_vends || 0}</div>
                <div className="font--sm text--black-700"> Successfull mVends</div>
              </div>
              <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                <div className="text--red font--600 font--lg">{paymentData?.failed_mobile_vends || 0}</div>
                <div className="font--sm text--black-700">Failed mVends</div>
              </div>
              <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                <div className="text--danger font--600 font--lg">{paymentData?.failed_mobile_payments || 0}</div>
                <div className="font--sm text--black-700">mPay Failed</div>
              </div>
              <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                <div className="text--secondary font--600 font--lg">0</div>
                <div className="font--sm text--black-700">In progress</div>
              </div>
            </div> */}
            <div className="d--flex flex--column gap--sm">
              <div className="d--flex align-items--center justify-content--between">
                <div className="font--sm font--500 d--flex gap--sm align-items--center">
                  Vend Success Rate <div className="font--sm d--flex text--orange">({paymentData?.total_mobile_vend_success || 0})</div>
                </div>
                <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_mobile_vend_success || 0, +paymentData?.total_mobile_vends || 0)}%</div>
              </div>
              <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                <div
                  className="bg--primary h-min--3 d--flex align-items--center radius--md"
                  style={{
                    width: `${getPercentage(+paymentData?.total_mobile_vend_success || 0, +paymentData?.total_mobile_vends || 0)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="d--flex flex--column gap--sm">
              <div className="d--flex align-items--center justify-content--between">
                <div className="font--sm font--500 d--flex gap--sm align-items--center">
                  Vend Failed Rate <div className="font--sm d--flex text--orange">({paymentData?.total_mobile_vend_fail || 0})</div>
                </div>
                <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_mobile_vend_fail || 0, +paymentData?.total_mobile_vends || 0)}%</div>
              </div>
              <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                <div
                  className="bg--red h-min--3 d--flex align-items--center radius--md"
                  style={{
                    width: `${getPercentage(+paymentData?.total_mobile_vend_fail || 0, +paymentData?.total_mobile_vends || 0)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="d--flex flex--column gap--sm">
              <div className="d--flex align-items--center justify-content--between">
                <div className="font--sm font--500 d--flex gap--sm align-items--center">
                Payment Success Rate <div className="font--sm d--flex text--orange">({paymentData?.total_mobile_payment_success || 0})</div>
                </div>
                <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_mobile_payment_success || 0, +paymentData?.total_mobile_vends || 0)}%</div>
              </div>
              <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                <div
                  className="bg--secondary h-min--3 d--flex align-items--center radius--md"
                  style={{
                    width: `${getPercentage(+paymentData?.total_mobile_payment_success || 0, +paymentData?.total_mobile_vends || 0)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="d--flex flex--column gap--sm">
              <div className="d--flex align-items--center justify-content--between">
                <div className="font--sm font--500 d--flex gap--sm align-items--center">
                  Payment Failed Rate <div className="font--sm d--flex text--orange">({paymentData?.total_mobile_payment_fail || 0})</div>
                </div>
                <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_mobile_payment_fail || 0, +paymentData?.total_mobile_vends || 0)}%</div>
              </div>
              <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                <div
                  className="bg--danger-800 h-min--3 d--flex align-items--center radius--md"
                  style={{
                    width: `${getPercentage(+paymentData?.total_mobile_payment_fail || 0, +paymentData?.total_mobile_vends || 0)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="d--flex gap--md justify-content--between w--full m-t--sm m-b--sm">
              <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                <div className="text--black-700 font--600 font--md ">${paymentData?.apple || 0}</div>
                <div className="font--sm text--black-700 font--600 ">Apple</div>
              </div>
              <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                <div className="text--black-700 font--600 font--md">${paymentData?.google_pay || 0}</div>
                <div className="font--sm text--black-700 font--600">Gpay</div>
              </div>
              <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                <div className="text--black-700 font--600 font--md p-l--mb">${paymentData?.after_pay || 0}</div>
                <div className="font--sm text--black-700 font--600">Afterpay</div>
              </div>
              <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                <div className="text--black-700 font--600 font--md">${paymentData?.paypal || 0}</div>
                <div className="font--sm text--black-700 font--600">Paypal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w--full h--full d--flex gap--xl m-t--md ">
        <div className="w--full  d--flex flex--column gap--sm piechart_background m-t--sm">
          <div className="font--md d--flex justify-content--between align-items--center font--600 h-min--40 m-t--md m-l--lg m-r--lg">
            <div className="w--full d--flex gap--sm ">
              Card Payments
              <span className="font--md font--500 text--orange">${paymentData?.total_card_payments_amount}</span>
            </div>
            <Button variant="black" color="white" btnClasses="btn w-max--100 gap--xs c--pointer  white-space--nowrap" onClick={() => navigate(PAYEMNT_PAGE_TYPE.CARD)}>
              <EyeIcon width={18} /> View All
            </Button>
          </div>
          <div className="h-min--300 h--full p--md  d--flex w--full bg-- radius--sm flex--column d--flex align-items--center justify-content--center  piaChart">
            <PieChart data={cardPaymentsGraphDetails} />
          </div>
        </div>
        <div className="w--full  d--flex flex--column gap--sm piechart_background m-t--sm">
          <div className="font--md d--flex justify-content--between align-items--center font--600 h-min--40 m-t--md m-l--lg m-r--lg">
            <div className="w--full d--flex gap--sm ">
              Mobile Payments
              <span className="font--md font--500 text--orange">${paymentData?.total_mobile_payments_amount || 0}</span>
            </div>
            <Button variant="black" color="white" btnClasses="btn w-max--100 gap--xs c--pointer  white-space--nowrap" onClick={() => navigate(PAYEMNT_PAGE_TYPE.MOBILE)}>
              <EyeIcon width={18} /> View All
            </Button>
          </div>

          <div className="h-min--300 h--full p--md  d--flex w--full bg-- radius--sm flex--column d--flex align-items--center justify-content--center  piaChart">
            <PieChart data={mobilePaymentsGraphDetails} />
          </div>
        </div>
      </div>
    </div>
     )}
 

     {isMobile &&(
       <div className="w--full d--flex flex--column gap--md paymentPage h--full">
       {isFetching && <FullScreenLoader />}
       <div className="w--full">
         <div className="d--flex flex--column align-items--start gap--sm h-min--36">
           <div className="w-max--600 w--full d--flex gap--md  justify-content--between">
             <div className="font--lg font--900">Payments</div>
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
           <div className="d--flex align-items--center gap--sm w--full w-max--600">
             {isLoading ? (
               <div className="d--flex w-min--36 justify-content--end">
                 <Spinner />
               </div>
             ) : (
              //  <div className="d--flex w-min--36 justify-content--end"></div>
             <CommonDateFilter {...{ setSDates, setEDates }} />
             )}
 
 
           </div>
         </div>
       </div>
       <div className="d--flex gap--xl w--full">
         <div className="d--grid grid--1 gap--md w--full  ">
           <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
             <div className="position--absolute text--orange right---5 top---4 ">
               <RightCornerIcon width={30} height={30} />
             </div>
             <div className="position--absolute text--orange left---4 bottom---10 ">
               <LeftCornerIcon width={30} height={30} />
             </div>
             <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black text--c">Total Vend | Total Payments (A$)</div>
 
             <div className="font--lg font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--40 h--full">{paymentData?.badges?.vend_total_pay_total_count || 0}  <span className="text--black-200">|</span> {paymentData?.badges?.vend_total_pay_total_amount || 0} (A$)</div>
           </div>
           <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full">
             <div className="position--absolute text--orange right---5 top---4 ">
               <RightCornerIcon width={30} height={30} />
             </div>
             <div className="position--absolute text--orange left---4 bottom---10 ">
               <LeftCornerIcon width={30} height={30} />
             </div>
             <div className="font--md font--500 p-b--sm m-b--xs h-min--35 border-bottom--black-100 text--black text--c">Successful Vends | Successful Payments (A$) </div>
 
             <div className="font--lg font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--40 h--full">{paymentData?.badges?.vend_success_pay_success_count || 0} <span className="text--black-200">|</span> {paymentData?.badges?.vend_success_pay_success_amount || 0} (A$)</div>
           </div>
           <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
             <div className="position--absolute text--orange right---5 top---4 ">
               <RightCornerIcon width={30} height={30} />
             </div>
             <div className="position--absolute text--orange left---4 bottom---10 ">
               <LeftCornerIcon width={30} height={30} />
             </div>
             <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black text--c">Failed Vends | Successful Payments (A$)</div>
 
             <div className="font--lg font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--40 h--full">{paymentData?.badges?.vend_fail_pay_success_count || 0} <span className="text--black-200">|</span> {paymentData?.badges?.vend_fail_pay_success_amount || 0} (A$)</div>
           </div>
           <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full">
             <div className="position--absolute text--orange right---5 top---4 ">
               <RightCornerIcon width={30} height={30} />
             </div>
             <div className="position--absolute text--orange left---4 bottom---10 ">
               <LeftCornerIcon width={30} height={30} />
             </div>
             <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black text--c">Failed Vends | Failed Payments (A$) </div>
 
             <div className="font--lg font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--40 h--full">{paymentData?.badges?.vend_fail_pay_fail_count || 0} <span className="text--black-200">|</span> {paymentData?.badges?.vend_fail_pay_fail_amount || 0} (A$)</div>
           </div>
         </div>
         {/* <div className="d--grid grid--2 gap--lg w--full  ">
           <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
             <div className="position--absolute text--primary right---5 top---4 ">
               <RightCornerIcon width={30} height={30} />
             </div>
             <div className="position--absolute text--primary left---4 bottom---10 ">
               <LeftCornerIcon width={30} height={30} />
             </div>
             <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black">Total Failed Vends </div>
 
             <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">{getCount(paymentData?.failed_vends || 0, paymentData?.failed_mobile_vends || 0)}</div>
           </div>
           <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full">
             <div className="position--absolute text--primary right---5 top---4 ">
               <RightCornerIcon width={30} height={30} />
             </div>
             <div className="position--absolute text--primary left---4 bottom---10 ">
               <LeftCornerIcon width={30} height={30} />
             </div>
             <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black">Total Refunds</div>
 
             <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">0</div>
           </div>
           <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
             <div className="position--absolute text--primary right---5 top---4 ">
               <RightCornerIcon width={30} height={30} />
             </div>
             <div className="position--absolute text--primary left---4 bottom---10 ">
               <LeftCornerIcon width={30} height={30} />
             </div>
             <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black">Total Cost Vend Fails (A$)</div>
 
             <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">{paymentData?.badges?.failed_payments}</div>
           </div>
           <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full">
             <div className="position--absolute text--primary right---5 top---4 ">
               <RightCornerIcon width={30} height={30} />
             </div>
             <div className="position--absolute text--primary left---4 bottom---10 ">
               <LeftCornerIcon width={30} height={30} />
             </div>
             <div className="font--md font--500 p-b--sm m-b--xs h-min--32 border-bottom--black-100 text--black">Total Refunds (A$)</div>
 
             <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--60 h--full">0</div>
           </div>
         </div> */}
       </div>
       <div className="w--full ">
         <div className="w--full d--flex flex--column gap--sm">
           <div className="font--md d--flex justify-content--between align-items--center font--600">
             <div className="w--full d--flex gap--sm h-min--36 align-items--end">
               Total Card Vends
               <span className="font--md font--500 text--black">{paymentData?.total_card_vends || 0}</span>
             </div>
           </div>
           <div className="h--full p--lg gap--xl d--flex w--full bg--white radius--sm flex--column  ">
             {/* <div className="w--full d--flex gap--sm">
               <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                 <div className="text--primary font--600 font--lg">{paymentData?.successfull_vends || 0}</div>
                 <div className="font--sm text--black-700">Successfull Vends</div>
               </div>
               <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                 <div className="text--red font--600 font--lg">{paymentData?.failed_vends || 0}</div>
                 <div className="font--sm text--black-700">Failed Vends</div>
               </div>
               <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                 <div className="text--danger font--600 font--lg">{paymentData?.pay_failed || 0}</div>
                 <div className="font--sm text--black-700">Pay Failed</div>
               </div>
               <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                 <div className="text--secondary font--600 font--lg">{paymentData?.in_progress || 0}</div>
                 <div className="font--sm text--black-700">In progress</div>
               </div>
             </div> */}
             <div className="d--flex flex--column gap--sm">
               <div className="d--flex align-items--center justify-content--between">
                 <div className="font--sm font--500 d--flex gap--sm align-items--center">
                   Vend Success Rate <div className="font--sm d--flex text--orange">({paymentData?.total_card_vend_success || 0})</div>
                 </div>
                 <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_card_vend_success || 0, +paymentData?.total_card_vends || 0)}%</div>
               </div>
               <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                 <div
                   className="bg--primary h-min--3 d--flex align-items--center radius--md"
                   style={{
                     width: `${getPercentage(+paymentData?.total_card_vend_success || 0, +paymentData?.total_card_vends || 0)}%`,
                   }}
                 ></div>
               </div>
             </div>
             <div className="d--flex flex--column gap--sm">
               <div className="d--flex align-items--center justify-content--between">
                 <div className="font--sm font--500 d--flex gap--sm align-items--center">
                   Vend Failed Rate <div className="font--sm d--flex text--orange">({paymentData?.total_card_vend_fail || 0})</div>
                 </div>
                 <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_card_vend_fail || 0, +paymentData?.total_card_vends || 0)}%</div>
               </div>
               <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                 <div
                   className="bg--red h-min--3 d--flex align-items--center  radius--md"
                   style={{
                     width: `${getPercentage(+paymentData?.total_card_vend_fail || 0, +paymentData?.total_card_vends || 0)}%`,
                   }}
                 ></div>
               </div>
             </div>
 
             <div className="d--flex flex--column gap--sm">
               <div className="d--flex align-items--center justify-content--between">
                 <div className="font--sm font--500 d--flex gap--sm align-items--center">
                 Payment Success Rate <div className="font--sm d--flex text--orange">({paymentData?.total_card_payment_success || 0})</div>
                 </div>
                 <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_card_payment_success || 0, +paymentData?.total_card_vends || 0)}%</div>
               </div>
               <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                 <div
                   className="bg--secondary h-min--3 d--flex align-items--center radius--md"
                   style={{
                     width: `${getPercentage(+paymentData?.total_card_payment_success || 0, +paymentData?.total_card_vends || 0)}%`,
                   }}
                 ></div>
               </div>
             </div>
 
             <div className="d--flex flex--column gap--sm">
               <div className="d--flex align-items--center justify-content--between">
                 <div className="font--sm font--500 d--flex gap--sm align-items--center">
                   Payment Failed Rate <div className="font--sm d--flex text--orange">({paymentData?.total_card_payment_fail || 0})</div>
                 </div>
                 <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_card_payment_fail || 0, +paymentData?.total_card_vends || 0)}%</div>
               </div>
               <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                 <div
                   className="bg--danger-800 h-min--3 d--flex align-items--center radius--md"
                   style={{
                     width: `${getPercentage(+paymentData?.total_card_payment_fail || 0, +paymentData?.total_card_vends || 0)}%`,
                   }}
                 ></div>
               </div>
             </div>
             <div className="d--flex gap--md justify-content--between w--full m-t--sm m-b--sm">
               <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                 <div className="text--black-700 font--600 font--md">${paymentData?.master_card || 0}</div>
                 <div className="font--sm text--black-700 font--600">Master Card</div>
               </div>
               <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                 <div className="text--black-700 font--600 font--md">${paymentData?.visa || 0}</div>
                 <div className="font--sm text--black-700 font--600">Visa</div>
               </div>
               <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                 <div className="text--black-700 font--600 font--md">${paymentData?.debit_card || 0}</div>
                 <div className="font--sm text--black-700 font--600">Debit card</div>
               </div>
               <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                 <div className="text--black-700 font--600 font--md">${paymentData?.amex || 0}</div>
                 <div className="font--sm text--black-700 font--600">Amex</div>
               </div>
             </div>
           </div>
         </div>
         <div className="w--full d--flex flex--column gap--sm">
           <div className="font--md d--flex justify-content--between align-items--center font--600">
             <div className="w--full d--flex gap--sm h-min--36 align-items--end">
               Total Mobile Vends
               <span className="font--md font--500 text--black">{paymentData?.total_mobile_vends || 0}</span>
             </div>
           </div>
 
           <div className="h--full p--lg gap--xl d--flex w--full bg--white radius--sm flex--column  ">
             {/* <div className="w--full d--flex gap--sm">
               <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                 <div className="text--primary font--600 font--lg">{paymentData?.successfull_mobile_vends || 0}</div>
                 <div className="font--sm text--black-700"> Successfull mVends</div>
               </div>
               <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                 <div className="text--red font--600 font--lg">{paymentData?.failed_mobile_vends || 0}</div>
                 <div className="font--sm text--black-700">Failed mVends</div>
               </div>
               <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                 <div className="text--danger font--600 font--lg">{paymentData?.failed_mobile_payments || 0}</div>
                 <div className="font--sm text--black-700">mPay Failed</div>
               </div>
               <div className="radius--sm d--flex align-items--center justify-content--center border-full--black-200 flex--column w--full h-min--60">
                 <div className="text--secondary font--600 font--lg">0</div>
                 <div className="font--sm text--black-700">In progress</div>
               </div>
             </div> */}
             <div className="d--flex flex--column gap--sm">
               <div className="d--flex align-items--center justify-content--between">
                 <div className="font--sm font--500 d--flex gap--sm align-items--center">
                   Vend Success Rate <div className="font--sm d--flex text--orange">({paymentData?.total_mobile_vend_success || 0})</div>
                 </div>
                 <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_mobile_vend_success || 0, +paymentData?.total_mobile_vends || 0)}%</div>
               </div>
               <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                 <div
                   className="bg--primary h-min--3 d--flex align-items--center radius--md"
                   style={{
                     width: `${getPercentage(+paymentData?.total_mobile_vend_success || 0, +paymentData?.total_mobile_vends || 0)}%`,
                   }}
                 ></div>
               </div>
             </div>
             <div className="d--flex flex--column gap--sm">
               <div className="d--flex align-items--center justify-content--between">
                 <div className="font--sm font--500 d--flex gap--sm align-items--center">
                   Vend Failed Rate <div className="font--sm d--flex text--orange">({paymentData?.total_mobile_vend_fail || 0})</div>
                 </div>
                 <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_mobile_vend_fail || 0, +paymentData?.total_mobile_vends || 0)}%</div>
               </div>
               <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                 <div
                   className="bg--red h-min--3 d--flex align-items--center radius--md"
                   style={{
                     width: `${getPercentage(+paymentData?.total_mobile_vend_fail || 0, +paymentData?.total_mobile_vends || 0)}%`,
                   }}
                 ></div>
               </div>
             </div>
 
             <div className="d--flex flex--column gap--sm">
               <div className="d--flex align-items--center justify-content--between">
                 <div className="font--sm font--500 d--flex gap--sm align-items--center">
                 Payment Success Rate <div className="font--sm d--flex text--orange">({paymentData?.total_mobile_payment_success || 0})</div>
                 </div>
                 <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_mobile_payment_success || 0, +paymentData?.total_mobile_vends || 0)}%</div>
               </div>
               <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                 <div
                   className="bg--secondary h-min--3 d--flex align-items--center radius--md"
                   style={{
                     width: `${getPercentage(+paymentData?.total_mobile_payment_success || 0, +paymentData?.total_mobile_vends || 0)}%`,
                   }}
                 ></div>
               </div>
             </div>
 
             <div className="d--flex flex--column gap--sm">
               <div className="d--flex align-items--center justify-content--between">
                 <div className="font--sm font--500 d--flex gap--sm align-items--center">
                   Payment Failed Rate <div className="font--sm d--flex text--orange">({paymentData?.total_mobile_payment_fail || 0})</div>
                 </div>
                 <div className="font--sm text--black-600">{getPercentage(+paymentData?.total_mobile_payment_fail || 0, +paymentData?.total_mobile_vends || 0)}%</div>
               </div>
               <div className="bg--black-50 h-min--3 d--flex align-items--center w--full radius--md">
                 <div
                   className="bg--danger-800 h-min--3 d--flex align-items--center radius--md"
                   style={{
                     width: `${getPercentage(+paymentData?.total_mobile_payment_fail || 0, +paymentData?.total_mobile_vends || 0)}%`,
                   }}
                 ></div>
               </div>
             </div>
             <div className="d--flex gap--md justify-content--between w--full m-t--sm m-b--md">
               <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                 <div className="text--black-700 font--600 font--md ">${paymentData?.apple || 0}</div>
                 <div className="font--sm text--black font--600 ">Apple</div>
               </div>
               <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                 <div className="text--black-700 font--600 font--md">${paymentData?.google_pay || 0}</div>
                 <div className="font--sm text--black-700 font--600">Gpay</div>
               </div>
               <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                 <div className="text--black-700 font--600 font--md">${paymentData?.after_pay || 0}</div>
                 <div className="font--sm text--black-700 font--600">Afterpay</div>
               </div>
               <div className="radius--sm d--flex justify-content--center align-items--center gap--xs  flex--column ">
                 <div className="text--black-700 font--600 font--md">${paymentData?.paypal || 0}</div>
                 <div className="font--sm text--black-700 font--600">Paypal</div>
               </div>
             </div>
           </div>
         </div>
       </div>
       <div className="w--full h--full d--flex flex--column gap--md ">
         <div className="w--full d--flex flex--column gap--sm piechart_background">
           <div className="font--md d--flex justify-content--between align-items--center font--600 h-min--40 m-t--md m-l--lg m-r--lg ">
             <div className="w--full d--flex gap--sm ">
               Card Payments
               <span className="font--md font--500 text--orange">${paymentData?.total_card_payments_amount}</span>
             </div>
             <Button variant="black" color="white" btnClasses="btn w-max--100 gap--xs c--pointer  white-space--nowrap" onClick={() => navigate(PAYEMNT_PAGE_TYPE.CARD)}>
               <EyeIcon width={18} /> View All
             </Button>
           </div>
           <div className="h-min--300 h--full p--md  d--flex w--full bg radius--sm flex--column d--flex align-items--center justify-content--center   piaChart">
             <PieChart data={cardPaymentsGraphDetails} />
           </div>
         </div>
         <div className="w--full  d--flex flex--column gap--sm piechart_background m-t--sm">
           <div className="font--md d--flex justify-content--between align-items--center font--600 h-min--40 m-t--md m-l--lg m-r--lg">
             <div className="w--full d--flex gap--sm ">
               Mobile Payments
               <span className="font--md font--500 text--orange">${paymentData?.total_mobile_payments_amount || 0}</span>
             </div>
             <Button variant="black" color="white" btnClasses="btn w-max--100 gap--xs c--pointer  white-space--nowrap" onClick={() => navigate(PAYEMNT_PAGE_TYPE.MOBILE)}>
               <EyeIcon width={18} /> View All
             </Button>
           </div>
 
           <div className="h-min--300 h--full p--md  d--flex w--full  radius--sm flex--column d--flex align-items--center justify-content--center  piaChart">
             <PieChart data={mobilePaymentsGraphDetails} />
           </div>
         </div>
       </div>
     </div>

     )}

    </> 
  );
}
