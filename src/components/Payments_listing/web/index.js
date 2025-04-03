import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CARD_PAYMENT_OPTION_LIST, PAYEMENT_EVENT_FILTERS_LIST, PAYMENT_OPTION_LIST, STRING_FORMATING_TYPE, stringFormating } from "../../../Helpers/resource";
import useIcons from "../../../Assets/web/icons/useIcons";
import { ALL_MACHINES_CONST, PAYEMNT_PAGE_TYPE, PAYMENT_TYPE_CONST, VEND_STATUS_CONST } from "../../../Helpers/constant";
import { paymentActivities } from "../action";
import FormInput from "../../../Widgets/web/FormInput";
import Spinner from "../../../Widgets/web/Spinner";
import SearchSelect from "../../../Widgets/web/SearchSelect";
import { machineList } from "../../Dashboard/action";
import TableWithPagination from "../../../Widgets/web/CommonTable";
import useDebounce from "../../../Hooks/useDebounce";
import CommonDateFilter from "../../../Widgets/web/CommonDateFilter";
import { useMediaQuery } from 'react-responsive';

const PaymentListing = () => {
  const [paymentOption, setPaymentOption] = useState(null);
  const { pageType } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState({
    label: PAYEMENT_EVENT_FILTERS_LIST[0]?.title,
    value: PAYEMENT_EVENT_FILTERS_LIST[0].value,
  });
  const { SearchIcon, ArrowLongLeftIcon, AppleIcon, PaypalIcon, GpayIcon, CardCancelled, CardSuccess } = useIcons();
  const [machine_id, setMachineId] = useState(null);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [sdates, setSDates] = useState(null);
  const [edates, setEDates] = useState(null);

  const payMethodType = pageType === PAYEMNT_PAGE_TYPE.CARD ? CARD_PAYMENT_OPTION_LIST : PAYMENT_OPTION_LIST;
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    
  const { data: paymentActivity, isLoading } = useQuery({
    queryKey: ["paymentActivityList", type, machine_id, page, paymentOption, sdates, edates, search],
    queryFn: () => {
      let pay_type = pageType === PAYEMNT_PAGE_TYPE.CARD ? "card" : "mobile";
      let machineId = machine_id && machine_id.value !== ALL_MACHINES_CONST.id ? machine_id.value : "";
      let pay_method = paymentOption?.value;
      return paymentActivities({
        pay_type,
        type: type?.value,
        page,
        machine_id: machineId,
        pay_method,
        start_date: sdates,
        end_date: edates,
        search,
      });
    },
    select: (data) => data?.data,
    enabled: sdates && edates ? true : false,
  });

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleChange = (selectedOption) => {
    setMachineId(selectedOption);
  };

  const handleEventFilter = (selectedOption) => {
    setType(selectedOption);
  };
  const handlePayTypeFilter = (selectedOption) => {
    setPaymentOption(selectedOption);
  };

  const handleSearchFilter = useDebounce((value) => {
    setSearch(value);
  }, 1000);

  const backToPayments = () => {
    navigate(`/payments`);
  };

  const PAYEMNT_ACTIVITY_TABLE_COLUMNS = [
    {
      name: "Method",
      render: (value, isIconWIthText, iconKey) => getPayType(value, isIconWIthText, iconKey),
    },
    {
      name: "Client name ",
      key: "client_name",
    },
    {
      name: "Machine ",
      key: "machine_name",
    },
    {
      name: "Product",
      key: "product_name",
    },
    {
      name: "Product Id",
      key: "product_id",
    },
    {
      name: "Amount",
      key: "amount",
    },
    {
      name: "Aisle",
      key: "aisle_number",
    },
  
    {
      name: "Date ",
      key: "created_at",
      render: (value) => stringFormating(value.created_at, STRING_FORMATING_TYPE.UTC_TO_LOCAL),
      
    },
    {
      name: "Payment Status ",
      key: "payment_status",
      render: (value) => getPaymentStatus(value),
    },
    {
      name: "Vend Status ",
      key: "vend_status",
      render: (value) => getStatusView(value),
    },
  ];

  function getStatusView(value) {
    switch (value.vend_status) {
      case VEND_STATUS_CONST.CREATED:
      case VEND_STATUS_CONST.INITIATE:
      case VEND_STATUS_CONST.PRIORITY:
      case VEND_STATUS_CONST.VENDING:
        return <div className="text--info">IN PROGRESS</div>;
      case VEND_STATUS_CONST.SUCCESS:
        return <div className="text--success">SUCCESS</div>;
      case VEND_STATUS_CONST.SERIAL_ERROR:
        return <div className="text--danger">SERIAL ERROR</div>;
      case VEND_STATUS_CONST.AISLE_ERROR:
        return <div className="text--danger">AISLE ERROR</div>;
      case VEND_STATUS_CONST.MOTOR_ERROR:
        return <div className="text--danger">MOTOR ERROR</div>;
      case VEND_STATUS_CONST.OUT_OF_STOCK:
        return <div className="text--danger">OUT OF STOCK</div>;
      case VEND_STATUS_CONST.DROP_ERROR:
        return <div className="text--danger">DROP ERROR</div>;
      case VEND_STATUS_CONST.CANCEL:
        return <div className="text--danger">{value.payment_status === PAYMENT_TYPE_CONST.SUCCESS ? 'TIMEOUT' : 'VEND FAILED'}</div>;
  
      default:
        break;
    }
  }
  
  function getPaymentStatus(value) {
    return (
      <div
        className={`${
          value.payment_status === PAYMENT_TYPE_CONST.SUCCESS
            ? "text--success"
            : "text--danger"
        }`}
      >
        {value.payment_status === PAYMENT_TYPE_CONST.SUCCESS
          ? value.payment_status
          : value.error}
      </div>
    );
  }
  
  const GetIconByType = (value) => {
    switch (value) {
      case PAYMENT_TYPE_CONST.APPLE_PAY:
        return <AppleIcon width={75} />;
      case PAYMENT_TYPE_CONST.FAILED:
        return <CardCancelled width={75} />;
      case PAYMENT_TYPE_CONST.GPAY:
        return <GpayIcon width={40} />;
      case PAYMENT_TYPE_CONST.PAYPAL:
        return <PaypalIcon width={75} />;
      case PAYMENT_TYPE_CONST.SUCCESS:
        return <CardSuccess width={75} />;
      default:
        break;
    }
  };
  
  function getPayType(value) {
    return (
      <div
        className={`w-min--75 w-max--75   radius--sm d--flex align-items--center justify-content--center ${
          pageType === PAYEMNT_PAGE_TYPE.CARD ? "flex--column" : ""
        }`}
      >
        {GetIconByType(value[pageType === PAYEMNT_PAGE_TYPE.CARD ? "payment_status" : "pay_method"])}
        {pageType === PAYEMNT_PAGE_TYPE.CARD ? value.card_type : ""}
      </div>
    );
  }
  return (
    <>
    {!isMobile &&(
       <div className="w--full d--flex flex--column gap--md paymentPage h--full">
       <div className="w--full">
         <div className="d--flex justify-content--between">
           <div className="d--flex gap--sm align-items--center w-max--350">
             <div className="d--flex c--pointer" onClick={() => backToPayments()}>
               <ArrowLongLeftIcon />
             </div>
             <div className="w-min--300 w--full position--relative w-max--300">
               <FormInput placeholder="Search" onKeyUp={(event) => handleSearchFilter(event.target.value)} />
               <div className="inputIcon position--absolute right--10 bottom--1 c--pointer text--black-700">
                 <SearchIcon width={15} />
               </div>
             </div>
           </div>
           <div className="d--flex align-items--center gap--sm w--full w-max--900">
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
                 selectedOption: paymentOption,
                 handleChange: handlePayTypeFilter,
                 placeholder: "Select pay methods",
                 options: payMethodType?.map((item) => ({
                   label: item?.name,
                   value: item.value,
                 })),
               }}
             />
             <SearchSelect
               {...{
                 selectedOption: type,
                 handleChange: handleEventFilter,
                 placeholder: "Select payment status",
                 options: PAYEMENT_EVENT_FILTERS_LIST?.map((item) => ({
                   label: item?.title,
                   value: item.value,
                 })),
               }}
             />
             <SearchSelect
               {...{
                 selectedOption: machine_id,
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
       <div className="w--full">
         <div className="d--flex flex--column gap--sm">
           <TableWithPagination key="tasks" data={paymentActivity?.data || []} itemsPerPage={10} onPageChange={handlePageChange} columns={PAYEMNT_ACTIVITY_TABLE_COLUMNS} isPagination={true} isColumns={true} total={paymentActivity?.pagination?.total} actionWidth={5} customClass="text--c" isLoading={isLoading} currentPageNo={page} />
         </div>
       </div>
 
 
     </div>
    )}
     {isMobile &&(
       <div className="w--full d--flex flex--column gap--md paymentPage h--full">
       <div className="w--full">
         <div className=" justify-content--between">
           <div className="d--flex gap--sm align-items--center w-max--350">
             <div className="d--flex c--pointer" onClick={() => backToPayments()}>
               <ArrowLongLeftIcon />
             </div>
             <div className="w-min--300 w--full position--relative w-max--300">
               <FormInput placeholder="Search" onKeyUp={(event) => handleSearchFilter(event.target.value)} />
               <div className="inputIcon position--absolute right--10 bottom--1 c--pointer text--black-700">
                 <SearchIcon width={15} />
               </div>
             </div>
           </div>
           <div className=" align-items--center gap--sm w--full w-max--900">
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
                 selectedOption: paymentOption,
                 handleChange: handlePayTypeFilter,
                 placeholder: "Select pay methods",
                 options: payMethodType?.map((item) => ({
                   label: item?.name,
                   value: item.value,
                 })),
               }}
             />
             <SearchSelect
               {...{
                 selectedOption: type,
                 handleChange: handleEventFilter,
                 placeholder: "Select payment status",
                 options: PAYEMENT_EVENT_FILTERS_LIST?.map((item) => ({
                   label: item?.title,
                   value: item.value,
                 })),
               }}
             />
             <SearchSelect
               {...{
                 selectedOption: machine_id,
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
       <div className="w--full">
         <div className="d--flex flex--column gap--sm">
           <TableWithPagination key="tasks" data={paymentActivity?.data || []} itemsPerPage={10} onPageChange={handlePageChange} columns={PAYEMNT_ACTIVITY_TABLE_COLUMNS} isPagination={true} isColumns={true} total={paymentActivity?.pagination?.total} actionWidth={5} customClass="text--c" isLoading={isLoading} currentPageNo={page} />
         </div>
       </div>
 
 
     </div>
    )}
   
    </>
 
  );
};

export default PaymentListing;

// actions={[
//   {
//     label: 'Share',
//     onClick: handleShare,
//     icon: (
//       <div className="w-min--32 w-max--32 h-max--32 h-min--32  radius--sm d--flex align-items--center justify-content--center bg--black-50 c--pointer">
//         <ShareIcon width={16} />
//       </div>
//     ),
//   },
// ]}
