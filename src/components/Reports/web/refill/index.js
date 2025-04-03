import React, { useEffect, useMemo, useRef, useState } from "react";
import TableWithPagination from "../../../../Widgets/web/CommonTable";
import FormInput from "../../../../Widgets/web/FormInput";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import SearchSelect from "../../../../Widgets/web/SearchSelect";
import CommonDateFilter from "../../../../Widgets/web/CommonDateFilter";
import { machineList } from "../../../Dashboard/action";
import { useDispatch, useSelector } from "react-redux";
import { REFILL_TYPES_List, REFILL_TYPE_CONST, REPORT_REFILL_TYPE_LIST, REPORT_TYPE_CONST, SALES_COUNT_TABLE_COLUMNS, SALES_TABLE_TABS_TYPE } from "../../constant";
import { ALL_MACHINES_CONST } from "../../../../Helpers/constant";
import { setCommonMachineFilter } from "../../../../redux/slices/common-filter-slice";
import useDebounce from "../../../../Hooks/useDebounce";
import { getRefillReport } from "../../action";
import { useQuery } from "@tanstack/react-query";
import FullScreenLoader from "../../../../Widgets/web/FullScreenLoader";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Dropdown from "../../../../Widgets/web/Dropdown";
import CommonReportTable from "../../../../Widgets/web/CommonReportsTable";
import { exportToExcel } from "../../../../Helpers/web/commonFn";

export default function RefillReport() {
  const { SearchIcon, ExportIcon, CalendarIcon, RightCornerIcon, LeftCornerIcon, TrashIcon, FullScreenIcon, AngleDownIcon, CaretIcon } = useIcons();
  const dispatch = useDispatch();
  const commonMachineIdFilter = useSelector((state) => state.commonFilter.commonMachineIdFilter);
  const [selectedOption, setSelectedOption] = useState(commonMachineIdFilter);
  const [selectedType, setSelectedType] = useState({
    label: REPORT_REFILL_TYPE_LIST[7].name,
    value: REPORT_REFILL_TYPE_LIST[7].id,
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
    data: _refill,
    isFetching,
  } = useQuery({
    queryKey: ["refillReportInfo", search, selectedOption, edates, sdates, selectedType, page, refillType, length],
    queryFn: () =>
      getRefillReport({
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

  const refillReportData = useMemo(() => {
    if (_refill) {
      _data.current = _refill;
    }
    return _data.current;
  }, [_refill]);

  const handlePageChange = () => {
    setPage(page + 1);
  };

  const columns = [
    { key: "machine_name", label: "Machine Name" },
    { key: "product_id", label: "Product ID" },
    { key: "product_name", label: "Product Name" },
    { key: "aisle_no", label: "Aisle#" },
    { key: "refill_qty", label: "Refill Qty" },
    { key: "aisle_remain_qty", label: "Maximum Qty" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const exportReport = (type) => {
    if (selectedMachineIds.length == 0) return;
    let getDataArray = (array, keys) => array?.map((item) => keys.map((key) => item?.[key] || ""));
    let extractData = (sourceArray, dataKeys) => sourceArray?.map((item) => dataKeys.map((key) => item?.[key] || ""));
    let foundElements = Array.isArray(refillReportData?.data)
      ? refillReportData?.data.filter((item) => item && selectedMachineIds?.includes(item?.id))
      : refillReportData?.data &&
        Object.values(refillReportData?.data)
          .flat()
          .filter((item) => item && selectedMachineIds?.includes(item?.id));
    let topSelling = extractData(refillReportData?.top_refilling, ["machine_name", "product_name", "count"]);
    let leastSelling = extractData(refillReportData?.least_refilling, ["machine_name", "product_name", "count"]);
    let dataKeys = ["machine_name", "product_id", "product_name", "aisle_no", "refill_qty", "refill_qty", "timestamp"];
    let data = getDataArray(foundElements, dataKeys);
    console.log("type", type);
    if (type.value === "XLS") handleExcelData({ topSelling, leastSelling, data });
    else handlePDFData({ topSelling, leastSelling, data });
  };

  const handleExcelData = ({ topSelling, leastSelling, data }) => {
    const sampleData = [["Total Refills"], [refillReportData?.total_refills], [], ["Vended Refills"], [refillReportData?.vended_refills], [], ["Total Machines"], [refillReportData?.pagination?.total], [], ["Top Refilling Products"], ["Machine", "Product", "Count"], ...topSelling, [], ["Slowest  Refilling Products"], ...leastSelling, [], ["Machine Name", "Product ID", "Product Name", "Aisle#", "Refill Qty", "Maximum Qty", "Timestamp"], ...data];
    exportToExcel(sampleData, "Refill-Reports");
  };
  const handlePDFData = ({ topSelling, leastSelling, data }) => {
    const doc = new jsPDF();
    const totalVends = [["Total Refills"], [refillReportData?.total_refills]];
    const totalSales = [["Vended Refills"], [refillReportData?.vended_refills]];
    const totalMachines = [["Total Machines"], [refillReportData?.pagination?.total]];
    const topSellingProducts = [["Machine", "Product", "Count"], ...topSelling];
    const slowestSellingProducts = [["Machine", "Product", "Count"], ...leastSelling];
    const transactions = [["Machine Name", "Product ID", "Product Name", "Aisle#", "Refill Qty", "Maximum Qty", "Timestamp"], ...data];
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
    doc.text("Top Refilling Products", 14, doc.previousAutoTable.finalY + 15);
    doc.autoTable({
      head: topSellingProducts.slice(0, 1),
      body: topSellingProducts.slice(1),
      startY: doc.previousAutoTable.finalY + 20,
    });
    doc.text("Slowest  Refilling Products", 14, doc.previousAutoTable.finalY + 15);
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
    <div className="w--full d--flex flex--column gap--md salesReportPage  h--full">
      {isFetching && <FullScreenLoader />}
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Refill Reports</div>
          </div>

          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <SearchSelect
              key={"reportRefillType"}
              {...{
                selectedOption: selectedType,
                handleChange: handleTypeChange,
                uniqueKey: "reportRefillTypes",
                placeholder: "Select type",
                options: REPORT_REFILL_TYPE_LIST?.map((item) => ({
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
      <div className="w--full h--full d--flex justify-content--end bg--white p--md radius--md">
        <div className="d--flex gap--sm justify-content--end  w-max--400">
          <Button variant="primary" color="white" btnClasses="btn white-space--nowrap gap--sm">
            <ExportIcon width={18} />
            Export All Report
          </Button>
          <Button variant="primary" color="white" btnClasses="btn white-space--nowrap gap--sm">
            <CalendarIcon width={18} />
            Schedule Sales Report
          </Button>
        </div>
      </div>
      <div className="d--flex gap--lg w--full">
        <div className="d--flex gap--lg w--full flex--column  justify-content--between">
          <div className="d--flex gap--lg w--full">
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--primary right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--primary left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Refills</div>

              <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{refillReportData?.total_refills || 0}</div>
            </div>
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--primary right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--primary left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Vended Refills</div>

              <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{refillReportData?.vended_refills || 0}</div>
            </div>
          </div>
          <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full">
            <div className="position--absolute text--primary right---5 top---4 ">
              <RightCornerIcon width={30} height={30} />
            </div>
            <div className="position--absolute text--primary left---4 bottom---10 ">
              <LeftCornerIcon width={30} height={30} />
            </div>
            <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Machines</div>

            <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{refillReportData?.pagination?.total || 0}</div>
          </div>
        </div>
        <div className="w--full d--flex flex--column gap--md">
          <div className="w--full h--full bg--white p--sm radius--md d--flex gap--sm h-max--40">
            <div className=" d--flex h-min--36 w--full">
              <div className={`w--full d--flex gap--sm font--sm font--600 border-bottom--${selectedSaleTab == SALES_TABLE_TABS_TYPE.TOP ? "primary" : "transparent"} border-width--2  h-min--36 d--flex align-items--center justify-content--center  w-min--100 w--full c--pointer`} onClick={() => setSelectedSaleTab(SALES_TABLE_TABS_TYPE.TOP)}>
                Top Refilling Products
              </div>
              <div className={`w--full d--flex gap--sm font--sm font--600 border-bottom--${selectedSaleTab == SALES_TABLE_TABS_TYPE.SLOWEST ? "primary" : "transparent"} border-width--2  h-min--36 d--flex align-items--center justify-content--center  w-min--100 w--full c--pointer`} onClick={() => setSelectedSaleTab(SALES_TABLE_TABS_TYPE.SLOWEST)}>
                Slowest Refilling Products
              </div>
            </div>
          </div>
          <div className="d--flex gap--lg w--full">
            <div className="w--full midTable d--flex gap--md">
              <div className="w--full ">
                <div className=" w--full ">
                  <TableWithPagination key="refill" data={selectedSaleTab == SALES_TABLE_TABS_TYPE.TOP ? refillReportData?.top_refilling || [] : refillReportData?.least_refilling || []} columns={SALES_COUNT_TABLE_COLUMNS} isPagination={false} isColumns={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w--full h--full d--flex gap--md h-max--50">
        <div className=" d--flex h-min--50 w--full bg--white p--sm radius--md d--flex gap--sm ">
          {REFILL_TYPES_List.map((el, i) => (
            <div className={`w--full d--flex gap--sm font--sm font--600 border-bottom--${refillType == el.type ? "primary" : "transparent"} border-width--2  h-min--44 d--flex align-items--center justify-content--center  w-min--100 w--full`} onClick={() => setRefillType(el.type)} key={i + 1}>
              {el.name}
            </div>
          ))}
        </div>
        <div className="w--full h--full d--flex justify-content--end bg--white p--sm radius--md d--flex gap--sm h-max--50 w-max--400">
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
      <CommonReportTable data={refillReportData} columnsList={columns} handlePageChange={handlePageChange} totalRecords={refillReportData?.pagination?.total} setLength={setLength} length={length} isExpandAll={isExpandAll} selectedMachineIds={selectedMachineIds} setMachineIds={setMachineIds} additionalConditionsArr={[REPORT_TYPE_CONST.MACHINE, REPORT_TYPE_CONST.SUMMARY, REPORT_TYPE_CONST.PRODUCT, REPORT_TYPE_CONST.ASILE, REPORT_TYPE_CONST.CATEGOREY].includes(selectedType.value)} isFetching={isFetching} />
    </div>
  );
}
