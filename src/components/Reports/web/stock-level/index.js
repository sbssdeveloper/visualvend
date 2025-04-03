import React, { useEffect, useMemo, useRef, useState } from "react";
import FormInput from "../../../../Widgets/web/FormInput";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import { useDispatch, useSelector } from "react-redux";
import { REPORT_STOCK_TYPE_LIST, REPORT_TYPE_CONST } from "../../constant";
import { setCommonMachineFilter } from "../../../../redux/slices/common-filter-slice";
import { useQuery } from "@tanstack/react-query";
import { getStockReport } from "../../action";
import FullScreenLoader from "../../../../Widgets/web/FullScreenLoader";
import CommonDateFilter from "../../../../Widgets/web/CommonDateFilter";
import SearchSelect from "../../../../Widgets/web/SearchSelect";
import { machineList } from "../../../Dashboard/action";
import { ALL_MACHINES_CONST } from "../../../../Helpers/constant";
import useDebounce from "../../../../Hooks/useDebounce";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Dropdown from "../../../../Widgets/web/Dropdown";
import CommonReportTable from "../../../../Widgets/web/CommonReportsTable";
import { exportToExcel } from "../../../../Helpers/web/commonFn";

export default function StockLevelReport() {
  const { SearchIcon, ExportIcon, TrashIcon, FullScreenIcon, AngleDownIcon, CaretIcon } = useIcons();
  const dispatch = useDispatch();
  const commonMachineIdFilter = useSelector((state) => state.commonFilter.commonMachineIdFilter);
  const [selectedOption, setSelectedOption] = useState(commonMachineIdFilter);
  const [selectedType, setSelectedType] = useState({
    label: REPORT_STOCK_TYPE_LIST[0].name,
    value: REPORT_STOCK_TYPE_LIST[0].id,
  });
  const [sdates, setSDates] = useState(null);
  const [edates, setEDates] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [length, setLength] = useState(50)
  const [selectedMachineIds, setMachineIds] = useState([]);
  const [isExpandAll, setExpandAll] = useState(false);
  const _data = useRef(null);

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
    data: _stock,
    isFetching,
  } = useQuery({
    queryKey: [
      "refillReportInfo",
      search,
      selectedOption,
      edates,
      sdates,
      selectedType,
      page,
      length
    ],
    queryFn: () =>
      getStockReport({
        search,
        start_date: sdates,
        end_date: edates,
        type: selectedType.value,
        page: 1,
        length: length * page,
        machine_id:
          selectedOption?.value === "All machines"
            ? ""
            : selectedOption?.value || "",
      }),
    onSuccess: (data) => {},
    select: (data) => {
      return data.data;
    },
    enabled: sdates && edates ? true : false,
  });

  const stockReportData = useMemo(() => {
    if (_stock) {
      _data.current = _stock;
    }
    return _data.current;
  }, [_stock])

  const handlePageChange = () => {
    setPage(page + 1);
  };

  const columns = [
    { key: "aisle_number", label: "Aisle No." },
    { key: "category_id", label: "Category" },
    { key: "product_id", label: "Product ID" },
    { key: "product_name", label: "Product Name" },
    { key: "last_refill_date", label: "Last Refill Date" },
    { key: "last_refill_amount", label: "Last Refill Amount" },
    { key: "product_quantity", label: "Stock Qty" },
    { key: "product_max_quantity", label: "Max Qty" },
    { key: "need_refill_amount", label: "Need Refill Qty" },
    { key: "stock_percentage", label: "SOH %" },
  ];

  const exportReport = (type) => {
    if (selectedMachineIds.length == 0) return;
    let getDataArray = (array, keys) => array?.map((item) => keys.map((key) => item?.[key] || ""));
    let foundElements = Array.isArray(stockReportData?.data)
      ? stockReportData?.data.filter((item) => item && selectedMachineIds?.includes(item?.id))
      : stockReportData?.data &&
        Object.values(stockReportData?.data)
          .flat()
          .filter((item) => item && selectedMachineIds?.includes(item?.id));
    let dataKeys = ["aisle_number", "category_id", "product_id", "product_name", "last_refill_date", "last_refill_amount", "product_quantity", "product_max_quantity", "need_refill_amount", "stock_percentage"];
    let data = getDataArray(foundElements, dataKeys);
    console.log("type", type);
    console.log("data", data);
    if (type.value === "XLS") handleExcelData({ data });
    else handlePDFData({ data });
  };

  const handleExcelData = ({ data }) => {
    const sampleData = [["Aisle No.", "Category", "Product ID", "Product Name", "Last Refill Date", "Last Refill Amount", "Stock Qty", "Max Qty", "Need Refill Qty", "SOH %"], ...data];
    exportToExcel(sampleData, "Stock-Level-Report");
  };
  const handlePDFData = ({ data }) => {
    const doc = new jsPDF();
    const transactions = [["Aisle No.", "Category", "Product ID", "Product Name", "Last Refill Date", "Last Refill Amount", "Stock Qty", "Max Qty", "Need Refill Qty", "SOH %"], ...data];

    doc.autoTable({
      head: transactions.slice(0, 1),
      body: transactions.slice(1),
      startY: 10,
    });
    doc.save("Stock-Level-Report.pdf");
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
    <div className="w--full d--flex flex--column gap--md reOrderPage  h--full">
      {isFetching && <FullScreenLoader />}
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Stock Level Report</div>
          </div>

          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <SearchSelect
              key={"reportStockType"}
              {...{
                selectedOption: selectedType,
                handleChange: handleTypeChange,
                uniqueKey: "reportStockTypes",
                placeholder: "Select type",
                options: REPORT_STOCK_TYPE_LIST?.map((item) => ({
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
      <div className="w--full  bg--white p--sm radius--md d--flex flex--column gap--sm">
        <div className="w--full h--full d--flex justify-content--end">
          <div className="d--flex gap--sm justify-content--end w--full w-max--400">
            <div className="bg--black-100 radius--sm dropdownNoPadding p-r--sm ">
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
      <CommonReportTable
        data={stockReportData}
        columnsList={columns}
        handlePageChange={handlePageChange}
        totalRecords={stockReportData?.pagination?.total}
        setLength={setLength}
        length={length}
        isExpandAll={isExpandAll}
        selectedMachineIds={selectedMachineIds}
        setMachineIds={setMachineIds}
        additionalConditionsArr={[
          REPORT_TYPE_CONST.MACHINE,
              REPORT_TYPE_CONST.EMPLOYEE,
              REPORT_TYPE_CONST.PRODUCT,
              REPORT_TYPE_CONST.LOW_STOCK_PRODUCTS,
              REPORT_TYPE_CONST.CATEGOREY,
        ].includes(selectedType.value)}
        isFetching={isFetching}
      />
    </div>
  );
}
