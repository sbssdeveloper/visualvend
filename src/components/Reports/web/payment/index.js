import React, { useEffect, useMemo, useRef, useState } from "react";
import TableWithPagination from "../../../../Widgets/web/CommonTable";
import FormInput from "../../../../Widgets/web/FormInput";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import SearchSelect from "../../../../Widgets/web/SearchSelect";
import CommonDateFilter from "../../../../Widgets/web/CommonDateFilter";
import { machineList } from "../../../Dashboard/action";
import { useDispatch, useSelector } from "react-redux";
import { PAYMENTS_COUNT_TABLE_COLUMNS, PRODUCT_REPORT_TYPE_LIST, REFILL_TYPE_CONST, REPORT_TYPE_CONST, SALES_TABLE_TABS_TYPE } from "../../constant";
import { ALL_MACHINES_CONST } from "../../../../Helpers/constant";
import { setCommonMachineFilter } from "../../../../redux/slices/common-filter-slice";
import useDebounce from "../../../../Hooks/useDebounce";
import { getPaymentReport } from "../../action";
import { useQuery } from "@tanstack/react-query";
import FullScreenLoader from "../../../../Widgets/web/FullScreenLoader";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Dropdown from "../../../../Widgets/web/Dropdown";
import CommonReportTable from "../../../../Widgets/web/CommonReportsTable";
import { exportToExcel } from "../../../../Helpers/web/commonFn";
import { useMediaQuery } from 'react-responsive';

export default function PaymentReport() {
  const { SearchIcon, ExportIcon, CalendarIcon, RightCornerIcon, LeftCornerIcon, TrashIcon, FullScreenIcon, AngleDownIcon, CaretIcon } = useIcons();
  const dispatch = useDispatch();
  const commonMachineIdFilter = useSelector((state) => state.commonFilter.commonMachineIdFilter);
  const [selectedOption, setSelectedOption] = useState(commonMachineIdFilter);
  const [selectedType, setSelectedType] = useState({
    label: PRODUCT_REPORT_TYPE_LIST[0].name,
    value: PRODUCT_REPORT_TYPE_LIST[0].id,
  });
  const [sdates, setSDates] = useState(null);
  const [edates, setEDates] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMachineIds, setMachineIds] = useState([]);
  const [isExpandAll, setExpandAll] = useState(false);
  const [refillType, setRefillType] = useState(REFILL_TYPE_CONST.SALE);
  const [length, setLength] = useState(50);
  const _data = useRef(null);

  const [selectedSaleTab, setSelectedSaleTab] = useState(SALES_TABLE_TABS_TYPE.TOP);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    dispatch(setCommonMachineFilter(selectedOption));
  };

  const handleTypeChange = (selectedOption) => {
    setSelectedType(selectedOption);
  };

  const handleSearchFilter = useDebounce((value) => {
    setPage(1);
    setSearch(value);
  }, 1000);

  const {
    isLoading,
    data: _productReport,
    isFetching,
  } = useQuery({
    queryKey: ["refillReportInfo", search, selectedOption, edates, sdates, selectedType, page, refillType, length],
    queryFn: () =>
      getPaymentReport({
        search,
        start_date: sdates,
        end_date: edates,
        type: selectedType.value,
        page: 1,
        length: length * page,
        machine_id: selectedOption?.value === "All machines" ? "" : selectedOption?.value || "",
        refill_type: refillType,
      }),
    onSuccess: (data) => {},
    select: (data) => {
      return data.data;
    },
    enabled: sdates && edates ? true : false,
  });

  const productReportData = useMemo(() => {
    if (_productReport) {
      _data.current = _productReport;
    }
    return _data.current;
  }, [_productReport]);

  const handlePageChange = () => {
    setPage(page + 1);
  };
   const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const columns = [
    { key: "transaction_id", label: "Transaction ID" },
    { key: "product_name", label: "Product Name" },
    { key: "machine_name", label: "Machine Name" },
    { key: "pay_method_name", label: "Payment Method" },
    { key: "amount", label: "Amount(AUD)" },
    { key: "payment_status", label: "Payment Status" },
    { key: "created_at", label: "Timestamp" },
  ];

  const exportReport = (type) => {
    if (selectedMachineIds.length == 0) return;
    let getDataArray = (array, keys) => array?.map((item) => keys.map((key) => item?.[key] || ""));
    let extractData = (sourceArray, dataKeys) => sourceArray?.map((item) => dataKeys.map((key) => item?.[key] || ""));
    let foundElements = Array.isArray(productReportData?.data)
      ? productReportData?.data.filter((item) => item && selectedMachineIds?.includes(item?.id))
      : productReportData?.data &&
        Object.values(productReportData?.data)
          .flat()
          .filter((item) => item && selectedMachineIds?.includes(item?.id));
    let topSelling = extractData(productReportData?.summary, ["pay_method", "ok_amount", "ok_qty", "total_qty", "rate", "failed_amount", "failed_qty", "fees", "total_amount"]);
    let leastSelling = extractData(productReportData?.failedSummary, ["pay_method", "ok_amount", "ok_qty", "total_qty", "rate", "failed_amount", "failed_qty", "fees", "total_amount"]);
    let dataKeys = ["transaction_id", "product_name", "machine_name", "pay_method_name", "amount", "payment_status", "created_at"];
    let data = getDataArray(foundElements, dataKeys);
    console.log("type", type);
    if (type.value === "XLS") handleExcelData({ topSelling, leastSelling, data });
    else handlePDFData({ topSelling, leastSelling, data });
  };

  const handleExcelData = ({ topSelling, leastSelling, data }) => {
    const sampleData = [["Total Vends"], [productReportData?.pagination?.total], [], ["Total Failed Vends"], [productReportData?.badges?.failed_vends], [], ["Total Refunds"], [productReportData?.badges?.successfull_vends], [], ["Total Payments"], [productReportData?.badges?.total_payments], [], ["Total Cost Vend Fails (A$)"], [productReportData?.badges?.failed_payments], [], ["Total Refunds (A$)"], [productReportData?.badges?.successfull_payments], [], ["Payment Summary"], ["Payment Type", "Value($)", "Ok(%)", "Qty", "Rate", "Fail($)", "Fees", "Total"], ...topSelling, [], ["Payments Failed/Refunds"][("Payment Type", "Value($)", "Ok(%)", "Qty", "Rate", "Fail($)", "Fees", "Total")], ...leastSelling, [], ["Transaction ID", "Product Name", "Machine Name", "Payment Method", "Amount(AUD)", "Maximum Qty", "Payment Status", "Timestamp"], ...data];
    exportToExcel(sampleData, "Refill-Reports");
  };
  const handlePDFData = ({ topSelling, leastSelling, data }) => {
    const doc = new jsPDF();
    const totalVends = [["Total Vends"], [productReportData?.pagination?.total]];
    const totalSales = [["Total Failed Vends"], [productReportData?.badges?.failed_vends]];
    const totalMachines = [["Total Refunds"], [productReportData?.badges?.successfull_vends]];
    const totalPayments = [["Total Payments"], [productReportData?.badges?.total_payments]];
    const totalCost = [["Total Cost Vend Fails (A$)"], [productReportData?.badges?.failed_payments]];
    const totalRefunds = [["Total Refunds (A$)"], [productReportData?.badges?.successfull_payments]];
    const topSellingProducts = [["Payment Type", "Value($)", "Ok(%)", "Qty", "Rate", "Fail($)", "Fees", "Total"], ...topSelling];
    const slowestSellingProducts = [["Payment Type", "Value($)", "Ok(%)", "Qty", "Rate", "Fail($)", "Fees", "Total"], ...leastSelling];
    const transactions = [["Transaction ID", "Product Name", "Machine Name", "Payment Method", "Amount(AUD)", "Payment Status", "Timestamp"], ...data];
    doc.autoTable({
      head: totalVends.slice(0, 1),
      body: totalVends.slice(1),
      startY: 10,
    });
    doc.autoTable({
      head: totalSales.slice(0, 1),
      body: totalSales.slice(1),
      startY: doc.previousAutoTable.finalY + 10,
    });
    doc.autoTable({
      head: totalMachines.slice(0, 1),
      body: totalMachines.slice(1),
      startY: doc.previousAutoTable.finalY + 10,
    });
    doc.autoTable({
      head: totalPayments.slice(0, 1),
      body: totalPayments.slice(1),
      startY: doc.previousAutoTable.finalY + 10,
    });
    doc.autoTable({
      head: totalCost.slice(0, 1),
      body: totalCost.slice(1),
      startY: doc.previousAutoTable.finalY + 10,
    });
    doc.autoTable({
      head: totalRefunds.slice(0, 1),
      body: totalRefunds.slice(1),
      startY: doc.previousAutoTable.finalY + 10,
    });
    doc.text("Payment Summary", 14, doc.previousAutoTable.finalY + 15);
    doc.autoTable({
      head: topSellingProducts.slice(0, 1),
      body: topSellingProducts.slice(1),
      startY: doc.previousAutoTable.finalY + 20,
    });
    doc.text("Payments Failed/Refunds", 14, doc.previousAutoTable.finalY + 15);
    doc.autoTable({
      head: slowestSellingProducts.slice(0, 1),
      body: slowestSellingProducts.slice(1),
      startY: doc.previousAutoTable.finalY + 20,
    });
    doc.autoTable({
      head: transactions.slice(0, 1),
      body: transactions.slice(1),
      startY: doc.previousAutoTable.finalY + 10,
    });
    doc.save("Refill-Reports.pdf");
  };

  const dropList = {
    component: ({ item }) => (
      <div onClick={() => exportReport(item)} key={item.value}>
        {item?.title}
      </div>
    ),
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
    <>
    {!isMobile && (
    <div className="w--full d--flex flex--column gap--md salesReportPage  h--full">
      {isFetching && <FullScreenLoader />}
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Payment Reports</div>
          </div>

          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <SearchSelect
              key={"reportRefillType"}
              {...{
                selectedOption: selectedType,
                handleChange: handleTypeChange,
                uniqueKey: "reportRefillTypes",
                placeholder: "Select type",
                options: PRODUCT_REPORT_TYPE_LIST?.map((item) => ({
                  label: item?.name,
                  value: item.id,
                })),
              }}
            />
            <div className="w--full w-max--250 position--relative">
              <FormInput placeholder="Search" onKeyUp={(event) => handleSearchFilter(event.target.value)} />
              <div className="d--flex position--absolute right--10 bottom--4 text--black-200">
                <SearchIcon width={15} />
              </div>
            </div>
            <CommonDateFilter {...{ setSDates, setEDates }} />

            <SearchSelect
              key={"machineIdsSelect"}
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

      <div className="d--flex gap--lg w--full">
        <div className="d--flex gap--lg w--full flex--column  justify-content--between">
          <div className="d--flex gap--lg w--full">
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--orange right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--orange left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Vends</div>

              <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.pagination?.total || 0}</div>
            </div>
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--orange right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--orange left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Failed Vends</div>

              <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.badges?.failed_vends || 0}</div>
            </div>
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--orange right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--orange left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Refunds</div>

              <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.badges?.successfull_vends || 0}</div>
            </div>
          </div>

          <div className="d--flex gap--lg w--full">
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--orange right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--orange left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Payments</div>

              <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.badges?.total_payments || 0}</div>
            </div>
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--orange right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--orange left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Cost Vend Fails (A$)</div>

              <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.badges?.failed_payments || 0}</div>
            </div>
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--orange right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--orange left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Refunds (A$)</div>

              <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.badges?.successfull_payments || 0}</div>
            </div>
          </div>
        </div>
        <div className="w--full d--flex flex--column gap--md">
          <div className="w--full h--full bg--white p--sm radius--md d--flex gap--sm h-max--40">
            <div className=" d--flex h-min--36 w--full">
              <div className={`w--full d--flex gap--sm font--sm font--600 border-bottom--${selectedSaleTab == SALES_TABLE_TABS_TYPE.TOP ? "grey" : "transparent"} border-width--2  h-min--36 d--flex align-items--center justify-content--center  w-min--100 w--full c--pointer`} onClick={() => setSelectedSaleTab(SALES_TABLE_TABS_TYPE.TOP)}>
                Payment Summary
              </div>
              <div className={`w--full d--flex gap--sm font--sm font--600 border-bottom--${selectedSaleTab == SALES_TABLE_TABS_TYPE.SLOWEST ? "grey" : "transparent"} border-width--2  h-min--36 d--flex align-items--center justify-content--center  w-min--100 w--full c--pointer`} onClick={() => setSelectedSaleTab(SALES_TABLE_TABS_TYPE.SLOWEST)}>
                Payments Failed/Refunds
              </div>
            </div>
          </div>
          <div className="d--flex gap--lg w--full">
            <div className="w--full midTable d--flex gap--md">
              <div className="w--full ">
                <div className=" w--full ">
                  <TableWithPagination key="refill" data={selectedSaleTab == SALES_TABLE_TABS_TYPE.TOP ? productReportData?.summary || [] : productReportData?.failedSummary || []} columns={PAYMENTS_COUNT_TABLE_COLUMNS} isPagination={false} isColumns={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w--full h--full bg--white p--sm radius--md d--flex flex--column gap--sm">
        <div className="w--full h--full d--flex justify-content--between">
          <div className="d--flex gap--sm justify-content--end w-max--400">
            <Button variant="black" color="white" btnClasses="btn white-space--nowrap gap--sm">
              <ExportIcon width={18} />
              Export All Report
            </Button>
          </div>
          <div className="d--flex gap--sm justify-content--end w--full w-max--400">
            <div className="bg--black-100 radius--sm dropdownNoPadding p-r--sm">
              <Dropdown closeOnClickOutside={true} dropList={dropList} caretComponent={CaretIcon} showcaret={true}>
                {dropEl}
                <div className="d--flex "></div>
              </Dropdown>
            </div>
            <Button ariant="black-50" color="black-600" btnClasses="btn white-space--nowrap gap--sm w-max--150 ">
              <TrashIcon width={18} />
              Delete Item (s)
            </Button>
            <Button variant="black-50" color="black-600" btnClasses="btn white-space--nowrap gap--sm w-max--150 " type="button" onClick={() => setExpandAll(!isExpandAll)}>
              <FullScreenIcon width={18} />
              {isExpandAll ? "Close" : "Expand"} All
            </Button>
          </div>
        </div>
      </div>
      <CommonReportTable data={productReportData} columnsList={columns} handlePageChange={handlePageChange} totalRecords={productReportData?.pagination?.total} setLength={setLength} length={length} isExpandAll={isExpandAll} selectedMachineIds={selectedMachineIds} setMachineIds={setMachineIds} additionalConditionsArr={[REPORT_TYPE_CONST.MACHINE, REPORT_TYPE_CONST.PRODUCT].includes(selectedType.value)} isFetching={isFetching} />
    </div>
    )}
    {isMobile && (

        <div className="w--full d--flex flex--column gap--md salesReportPage  h--full">
        {isFetching && <FullScreenLoader />}
        <div className="w--full">
          <div className="justify-content--between align-items--center h-min--36">
          
            <div className="w-max--400 w--full position--relative">
              <div className="font--lg font--900">Payment Reports</div>
            </div>

            <div className="d--flex align-items--center justify-content--end gap--sm w--full m-t--md">
              <SearchSelect
                key={"reportRefillType"}
                {...{
                  selectedOption: selectedType,
                  handleChange: handleTypeChange,
                  uniqueKey: "reportRefillTypes",
                  placeholder: "Select type",
                  options: PRODUCT_REPORT_TYPE_LIST?.map((item) => ({
                    label: item?.name,
                    value: item.id,
                  })),
                }}
              />
              <div className="w--full w-max--250 position--relative">
                <FormInput placeholder="Search" onKeyUp={(event) => handleSearchFilter(event.target.value)} />
                <div className="d--flex position--absolute right--10 bottom--4 text--black-200">
                  <SearchIcon width={15} />
                </div>
              </div>
              </div>
            <div className="d--flex align-items--center justify-content--end gap--sm w--full m-t--md">
              <CommonDateFilter {...{ setSDates, setEDates }} />

              <SearchSelect
                key={"machineIdsSelect"}
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

        <div className="gap--lg w--full">
          <div className="d--flex gap--lg w--full flex--column  justify-content--between p-b--lg">
            <div className="d--flex gap--lg w--full">
              <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
                <div className="position--absolute text--orange right---5 top---4 ">
                  <RightCornerIcon width={30} height={30} />
                </div>
                <div className="position--absolute text--orange left---4 bottom---10 ">
                  <LeftCornerIcon width={30} height={30} />
                </div>
                <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Vends</div>

                <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.pagination?.total || 0}</div>
              </div>
              <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
                <div className="position--absolute text--orange right---5 top---4 ">
                  <RightCornerIcon width={30} height={30} />
                </div>
                <div className="position--absolute text--orange left---4 bottom---10 ">
                  <LeftCornerIcon width={30} height={30} />
                </div>
                <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Failed Vends</div>

                <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.badges?.failed_vends || 0}</div>
              </div>
              <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
                <div className="position--absolute text--orange right---5 top---4 ">
                  <RightCornerIcon width={30} height={30} />
                </div>
                <div className="position--absolute text--orange left---4 bottom---10 ">
                  <LeftCornerIcon width={30} height={30} />
                </div>
                <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Refunds</div>

                <div className="font--2xl font--600 text--orange gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.badges?.successfull_vends || 0}</div>
              </div>
            </div>
            
            <div className="d--flex gap--lg w--full">
              <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
                <div className="position--absolute text--orange right---5 top---4 ">
                  <RightCornerIcon width={30} height={30} />
                </div>
                <div className="position--absolute text--orange left---4 bottom---10 ">
                  <LeftCornerIcon width={30} height={30} />
                </div>
                <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Payments</div>

                <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.badges?.total_payments || 0}</div>
              </div>
              <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
                <div className="position--absolute text--orange right---5 top---4 ">
                  <RightCornerIcon width={30} height={30} />
                </div>
                <div className="position--absolute text--orange left---4 bottom---10 ">
                  <LeftCornerIcon width={30} height={30} />
                </div>
                <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Cost Vend Fails (A$)</div>

                <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.badges?.failed_payments || 0}</div>
              </div>
              <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
                <div className="position--absolute text--orange right---5 top---4 ">
                  <RightCornerIcon width={30} height={30} />
                </div>
                <div className="position--absolute text--orange left---4 bottom---10 ">
                  <LeftCornerIcon width={30} height={30} />
                </div>
                <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Refunds (A$)</div>

                <div className="font--2xl font--600 text--black gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{productReportData?.badges?.successfull_payments || 0}</div>
              </div>
              
            </div>
          </div>
          <div className="w--full d--flex flex--column gap--md">
            <div className="w--full h--full bg--white p--sm radius--md d--flex gap--sm h-max--40">
              <div className=" d--flex h-min--36 w--full">
                <div className={`w--full d--flex gap--sm font--sm font--600 border-bottom--${selectedSaleTab == SALES_TABLE_TABS_TYPE.TOP ? "grey" : "transparent"} border-width--2  h-min--36 d--flex align-items--center justify-content--center  w-min--100 w--full c--pointer`} onClick={() => setSelectedSaleTab(SALES_TABLE_TABS_TYPE.TOP)}>
                  Payment Summary
                </div>
                <div className={`w--full d--flex gap--sm font--sm font--600 border-bottom--${selectedSaleTab == SALES_TABLE_TABS_TYPE.SLOWEST ? "grey" : "transparent"} border-width--2  h-min--36 d--flex align-items--center justify-content--center  w-min--100 w--full c--pointer`} onClick={() => setSelectedSaleTab(SALES_TABLE_TABS_TYPE.SLOWEST)}>
                  Payments Failed/Refunds
                </div>
              </div>
            </div>
            <div className="d--flex gap--lg w--full">
              <div className="w--full midTable d--flex gap--md">
                <div className="w--full ">
                  <div className=" w--full ">
                    <TableWithPagination key="refill" data={selectedSaleTab == SALES_TABLE_TABS_TYPE.TOP ? productReportData?.summary || [] : productReportData?.failedSummary || []} columns={PAYMENTS_COUNT_TABLE_COLUMNS} isPagination={false} isColumns={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w--full h--full bg--white p--sm radius--md d--flex flex--column gap--sm m-t--md m-b--md exports">
          <div className="w--full h--full justify-content--between">
            <div className="d--flex gap--md justify-content--end w-max--400 m-t--md">
              <Button variant="black" color="white" btnClasses="btn white-space--nowrap gap--sm">
                <ExportIcon width={18} />
                Export All Report
              </Button>
             <Button ariant="black-50" color="black-600" btnClasses="btn white-space--nowrap gap--sm w-max--150 ">
                <TrashIcon width={18} />
                Delete Item (s)
              </Button>
            </div>
            <div>
            
            </div>
            <div className="d--flex gap--md justify-content--end w--full w-max--400 m-t--md">
              <div className="bg--black-100 radius--sm dropdownNoPadding p-r--sm">
                <Dropdown closeOnClickOutside={true} dropList={dropList} caretComponent={CaretIcon} showcaret={true}>
                  {dropEl}
                  <div className="d--flex "></div>
                </Dropdown>
              </div>
              
              <Button variant="black-50" color="black-600" btnClasses="btn white-space--nowrap gap--sm w-max--150 " type="button" onClick={() => setExpandAll(!isExpandAll)}>
                <FullScreenIcon width={18} />
                {isExpandAll ? "Close" : "Expand"} All
              </Button>
            </div>
          </div>
        </div>
        <CommonReportTable data={productReportData} columnsList={columns} handlePageChange={handlePageChange} totalRecords={productReportData?.pagination?.total} setLength={setLength} length={length} isExpandAll={isExpandAll} selectedMachineIds={selectedMachineIds} setMachineIds={setMachineIds} additionalConditionsArr={[REPORT_TYPE_CONST.MACHINE, REPORT_TYPE_CONST.PRODUCT].includes(selectedType.value)} isFetching={isFetching} />
        </div>


    )}
    </>
  );
}

         
         