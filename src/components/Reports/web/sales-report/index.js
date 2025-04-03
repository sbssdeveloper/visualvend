import React, { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TableWithPagination from "../../../../Widgets/web/CommonTable";
import FormInput from "../../../../Widgets/web/FormInput";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import CommonDateFilter from "../../../../Widgets/web/CommonDateFilter";
import { machineList } from "../../../Dashboard/action";
import { ALL_MACHINES_CONST } from "../../../../Helpers/constant";
import { setCommonMachineFilter } from "../../../../redux/slices/common-filter-slice";
import { useDispatch, useSelector } from "react-redux";
import SearchSelect from "../../../../Widgets/web/SearchSelect";
import { useQuery } from "@tanstack/react-query";
import { getSalesReport } from "../../action";
import { REPORT_TYPE_CONST, REPORT_TYPE_LIST, SALES_COUNT_TABLE_COLUMNS, SALES_TABLE_TABS_TYPE } from "../../constant";
import useDebounce from "../../../../Hooks/useDebounce";
import FullScreenLoader from "../../../../Widgets/web/FullScreenLoader";
import Dropdown from "../../../../Widgets/web/Dropdown";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CommonReportTable from "../../../../Widgets/web/CommonReportsTable";
import { exportToExcel } from "../../../../Helpers/web/commonFn";
import { useMediaQuery } from 'react-responsive';

export default function SalesReport() {
  const _data = useRef(null);
  const { SearchIcon, ExportIcon, CalendarIcon, RightCornerIcon, LeftCornerIcon, CaretIcon, TrashIcon, FullScreenIcon } = useIcons();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const commonMachineIdFilter = useSelector((state) => state.commonFilter.commonMachineIdFilter);
  const [selectedOption, setSelectedOption] = useState(commonMachineIdFilter);
  const [selectedType, setSelectedType] = useState({
    label: REPORT_TYPE_LIST[0].name,
    value: REPORT_TYPE_LIST[0].id,
  });
  const [sdates, setSDates] = useState(null);
  const [edates, setEDates] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMachineIds, setMachineIds] = useState([]);
  const [isExpandAll, setExpandAll] = useState(false);
  const [length, setLength] = useState(50);

  const [selectedSaleTab, setSelectedSaleTab] = useState(SALES_TABLE_TABS_TYPE.TOP);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    dispatch(setCommonMachineFilter(selectedOption));
  };

  const handleSearchFilter = useDebounce((value) => {
    setPage(1);
    setSearch(value);
  }, 1000);

  const {
    data: _sales,
    isFetching,
  } = useQuery({
    queryKey: ["saleReportInfo", search, selectedOption, edates, sdates, selectedType, page, length],
    queryFn: () =>
      getSalesReport({
        search,
        start_date: sdates,
        end_date: edates,
        type: selectedType.value,
        page: 1,
        length: length * page,
        machine_id: selectedOption?.value === "All machines" ? "" : selectedOption?.value || "",
      }),
    onSuccess: (data) => { },
    select: (data) => {
      return data.data;
    },
    enabled: sdates && edates ? true : false,
  });

  const handleTypeChange = (selectedOption) => {
    setSelectedType(selectedOption);
  };

  const handlePageChange = () => {
    setPage(page + 1);
  };

  const salesReportData = useMemo(() => {
    if (_sales) {
      _data.current = _sales;
    }
    return _data.current;
  }, [_sales])

  const columns = [
    { key: "transaction_id", label: "Trans ID" },
    { key: "machine_name", label: "Machine Name" },
    { key: "product_id", label: "Product ID" },
    { key: "product_name", label: "Product Name" },
    { key: "product_price", label: "Product Price" },
    { key: "employee_name", label: "Employee" },
    { key: "sku", label: "SKU#" },
    { key: "aisle_no", label: "Aisle#" },
    { key: "pickup_or_return", label: "Pickup/Return", render: (value) => (value === -1 ? 'pickup' : 'return') },
    { key: "timestamp", label: "Timestamp" },
  ];

  const exportReport = (type) => {
    if (selectedMachineIds.length == 0) return;
    let getDataArray = (array, keys) => array?.map((item) => keys.map((key) => item?.[key] || ""));
    let extractData = (sourceArray, dataKeys) => sourceArray?.map((item) => dataKeys.map((key) => item?.[key] || ""));
    let foundElements = Array.isArray(salesReportData?.data)
      ? salesReportData?.data.filter((item) => item && selectedMachineIds?.includes(item?.id))
      : salesReportData?.data &&
      Object.values(salesReportData?.data)
        .flat()
        .filter((item) => item && selectedMachineIds?.includes(item?.id));
    let topSelling = extractData(salesReportData?.top_selling, ["machine_name", "product_name", "count"]);
    let leastSelling = extractData(salesReportData?.least_selling, ["machine_name", "product_name", "count"]);
    let dataKeys = ["transaction_id", "machine_name", "product_id", "product_name", "product_price", "employee_name", "sku", "aisle_no", "pickup_or_return", "timestamp"];
    let data = getDataArray(foundElements, dataKeys);
    if (type.value === "XLS") handleExcelData({ topSelling, leastSelling, data });
    else handlePDFData({ topSelling, leastSelling, data });
  };

  const handleExcelData = ({ topSelling, leastSelling, data }) => {
    const sampleData = [["Total Vends"], [salesReportData?.pagination?.total], [], ["Total Sales($)"], [salesReportData?.total_sales], [], ["Top Selling Products"], ["Machine", "Product", "Count"], ...topSelling, [], ["Slowest Selling Products"], ...leastSelling, [], ["Trans ID", "Machine Name", "Product ID", "Product Name", "Product Price", "Employee Name", "SKU#", "Aisle#", "Pickup/Return", "Timestamp"], ...data];
    exportToExcel(sampleData, "Sales-Report");
  };
  const handlePDFData = ({ topSelling, leastSelling, data }) => {
    const doc = new jsPDF();
    const totalVends = [["Total Vends"], [salesReportData?.pagination?.total]];
    const totalSales = [["Total Sales($)"], [salesReportData?.total_sales]];
    const topSellingProducts = [["Machine", "Product", "Count"], ...topSelling];
    const slowestSellingProducts = [["Machine", "Product", "Count"], ...leastSelling];
    const transactions = [["Trans ID", "Machine Name", "Product ID", "Product Name", "Product Price", "Employee Name", "SKU#", "Aisle#", "Pickup/Return", "Timestamp"], ...data];
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
    doc.text("Top Selling Products", 14, doc.previousAutoTable.finalY + 15);
    doc.autoTable({
      head: topSellingProducts.slice(0, 1),
      body: topSellingProducts.slice(1),
      startY: doc.previousAutoTable.finalY + 20,
    });
    doc.text("Slowest Selling Products", 14, doc.previousAutoTable.finalY + 15);
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
    doc.save("vend-sales-reports.pdf");
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
            <div className="font--lg font--900">Sales Report</div>
          </div>

          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <SearchSelect
              key={"reportTypeList"}
              {...{
                selectedOption: selectedType,
                handleChange: handleTypeChange,
                uniqueKey: "reportTypes",
                placeholder: "Select type",
                options: REPORT_TYPE_LIST?.map((item) => ({
                  label: item.name,
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
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
            <div className="position--absolute text--primary right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--primary left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Vends</div>

            <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{salesReportData?.pagination?.total || 0}</div>
          </div>
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full">
            <div className="position--absolute text--primary right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--primary left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Sales($)</div>

            <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{salesReportData?.total_sales || 0}</div>
          </div>
        </div>
        <div className="w--full d--flex flex--column gap--md">
          <div className="w--full h--full bg--white p--sm radius--md d--flex gap--sm h-max--40">
            <div className=" d--flex h-min--36 w--full">
              <div className={`w--full d--flex gap--sm font--sm font--600 border-bottom--${selectedSaleTab == SALES_TABLE_TABS_TYPE.TOP ? "primary" : "transparent"} border-width--2  h-min--36 d--flex align-items--center justify-content--center  w-min--100 w--full c--pointer`} onClick={() => setSelectedSaleTab(SALES_TABLE_TABS_TYPE.TOP)}>
                Top Selling Products
              </div>
              <div className={`w--full d--flex gap--sm font--sm font--600 border-bottom--${selectedSaleTab == SALES_TABLE_TABS_TYPE.SLOWEST ? "primary" : "transparent"} border-width--2  h-min--36 d--flex align-items--center justify-content--center  w-min--100 w--full c--pointer`} onClick={() => setSelectedSaleTab(SALES_TABLE_TABS_TYPE.SLOWEST)}>
                Slowest Selling Products
              </div>
            </div>
          </div>
          <div className="d--flex gap--lg w--full">
            <div className="w--full midTable d--flex gap--md">
              <div className="w--full ">
                <div className=" w--full ">
                  <TableWithPagination key="refill" data={selectedSaleTab == SALES_TABLE_TABS_TYPE.TOP ? salesReportData?.top_selling || [] : salesReportData?.least_selling || []} columns={SALES_COUNT_TABLE_COLUMNS} isPagination={false} isColumns={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w--full h--full bg--white p--sm radius--md d--flex flex--column gap--sm">
        <div className="w--full h--full d--flex justify-content--between">
          <div className="d--flex gap--sm justify-content--end w--full w-max--400">
            <Button variant="primary" color="white" btnClasses="btn white-space--nowrap gap--sm">
              <ExportIcon width={18} />
              Export All Report
            </Button>
            <Button variant="primary" color="white" btnClasses="btn white-space--nowrap gap--sm" type="button" onClick={() => navigate("/report/schedule-report/sales")}>
              <CalendarIcon width={18} />
              Schedule Sales Report
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
      <CommonReportTable data={salesReportData} columnsList={columns} handlePageChange={handlePageChange} totalRecords={salesReportData?.pagination?.total} setLength={setLength} length={length} isExpandAll={isExpandAll} selectedMachineIds={selectedMachineIds} setMachineIds={setMachineIds} additionalConditionsArr={[REPORT_TYPE_CONST.MACHINE, REPORT_TYPE_CONST.EMPLOYEE, REPORT_TYPE_CONST.PRODUCT].includes(selectedType.value)} isFetching={isFetching} />
    </div>
    )}
    {isMobile && (

        <div className="w--full  flex--column gap--md salesReportPage  h--full">
        {isFetching && <FullScreenLoader />}
        <div className="w--full">
          <div className="d--flex justify-content--between align-items--center h-min--36">
            <div className="w-max--400 w--full position--relative">
              <div className="font--lg font--900">Sales Report</div>
            </div>

            <div className="d--flex align-items--center justify-content--end gap--sm w--full m-t--md">
              <SearchSelect
                key={"reportTypeList"}
                {...{
                  selectedOption: selectedType,
                  handleChange: handleTypeChange,
                  uniqueKey: "reportTypes",
                  placeholder: "Select type",
                  options: REPORT_TYPE_LIST?.map((item) => ({
                    label: item.name,
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

        <div className="d--flex gap--lg w--full">
          <div className="d--flex gap--lg w--full flex--column  justify-content--between">
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--primary right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--primary left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Vends</div>

              <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{salesReportData?.pagination?.total || 0}</div>
            </div>
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full">
              <div className="position--absolute text--primary right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--primary left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Sales($)</div>

              <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{salesReportData?.total_sales || 0}</div>
            </div>
          </div>
          <div className="w--full d--flex flex--column gap--md">
            <div className="w--full h--full bg--white p--sm radius--md d--flex gap--sm h-max--40">
              <div className=" d--flex h-min--36 w--full">
                <div className={`w--full d--flex gap--sm font--sm font--600 border-bottom--${selectedSaleTab == SALES_TABLE_TABS_TYPE.TOP ? "primary" : "transparent"} border-width--2  h-min--36 d--flex align-items--center justify-content--center  w-min--100 w--full c--pointer`} onClick={() => setSelectedSaleTab(SALES_TABLE_TABS_TYPE.TOP)}>
                  Top Selling Products
                </div>
                <div className={`w--full d--flex gap--sm font--sm font--600 border-bottom--${selectedSaleTab == SALES_TABLE_TABS_TYPE.SLOWEST ? "primary" : "transparent"} border-width--2  h-min--36 d--flex align-items--center justify-content--center  w-min--100 w--full c--pointer`} onClick={() => setSelectedSaleTab(SALES_TABLE_TABS_TYPE.SLOWEST)}>
                  Slowest Selling Products
                </div>
              </div>
            </div>
            <div className="d--flex gap--lg w--full">
              <div className="w--full midTable d--flex gap--md">
                <div className="w--full ">
                  <div className=" w--full ">
                    <TableWithPagination key="refill" data={selectedSaleTab == SALES_TABLE_TABS_TYPE.TOP ? salesReportData?.top_selling || [] : salesReportData?.least_selling || []} columns={SALES_COUNT_TABLE_COLUMNS} isPagination={false} isColumns={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w--full h--full bg--white p--sm radius--md d--flex flex--column gap--sm">
          <div className="w--full h--full d--flex justify-content--between">
            <div className="d--flex gap--sm justify-content--end w--full w-max--400">
              <Button variant="primary" color="white" btnClasses="btn white-space--nowrap gap--sm">
                <ExportIcon width={18} />
                Export All Report
              </Button>
              <Button variant="primary" color="white" btnClasses="btn white-space--nowrap gap--sm" type="button" onClick={() => navigate("/report/schedule-report/sales")}>
                <CalendarIcon width={18} />
                Schedule Sales Report
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
        <CommonReportTable data={salesReportData} columnsList={columns} handlePageChange={handlePageChange} totalRecords={salesReportData?.pagination?.total} setLength={setLength} length={length} isExpandAll={isExpandAll} selectedMachineIds={selectedMachineIds} setMachineIds={setMachineIds} additionalConditionsArr={[REPORT_TYPE_CONST.MACHINE, REPORT_TYPE_CONST.EMPLOYEE, REPORT_TYPE_CONST.PRODUCT].includes(selectedType.value)} isFetching={isFetching} />
        </div>


    )}

    </>
  );
}
