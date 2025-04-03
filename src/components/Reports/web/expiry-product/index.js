import React, { useEffect, useMemo, useRef, useState } from "react";
import FormInput from "../../../../Widgets/web/FormInput";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import { useDispatch, useSelector } from "react-redux";
import { EXPIRY_PRODUCT_TYPE_LIST, REPORT_TYPE_CONST } from "../../constant";
import { setCommonMachineFilter } from "../../../../redux/slices/common-filter-slice";
import { useQuery } from "@tanstack/react-query";
import { getExpiryProductReport } from "../../action";
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

export default function ExpireyProductReport() {
  const { SearchIcon, ExportIcon, CaretIcon, FullScreenIcon, AngleDownIcon } = useIcons();
  const dispatch = useDispatch();
  const commonMachineIdFilter = useSelector((state) => state.commonFilter.commonMachineIdFilter);
  const [selectedOption, setSelectedOption] = useState(commonMachineIdFilter);
  const [selectedType, setSelectedType] = useState({
    label: EXPIRY_PRODUCT_TYPE_LIST[0].name,
    value: EXPIRY_PRODUCT_TYPE_LIST[0].id,
  });
  const [sdates, setSDates] = useState(null);
  const [edates, setEDates] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [length, setLength] = useState(50);
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
    data: _expiry,
    isFetching,
  } = useQuery({
    queryKey: ["refillReportInfo", search, selectedOption, edates, sdates, selectedType, page, length],
    queryFn: () =>
      getExpiryProductReport({
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

  const stockReportData = useMemo(() => {
    if (_expiry) {
      _data.current = _expiry;
    }
    return _data.current;
  }, [_expiry]);

  const handlePageChange = () => {
    setPage(page + 1);
  };

  const columns = [
    { key: "updated_at", label: "Date/Time" },
    { key: "machine_id", label: "Machine ID" },
    { key: "product_id", label: "Product ID" },
    { key: "product_name", label: "Product Name" },
    { key: "employee_name", label: "Batch#" },
    { key: "product_quantity", label: "Qty" },
    { key: "product_batch_expiray_date", label: "Expiry Date" },
    { key: "aisles", label: "Aisle(s)" },
    { key: "product_discount_type", label: "Disc Type" },
    { key: "product_quantity", label: "Disc Date" },
    { key: "product_discount_code", label: "Qty Now" },
    { key: "product_price", label: "Price" },
    { key: "days_remaining", label: "Days2sell" },
    { key: "status", label: "Status" },
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
    let dataKeys = ["updated_at", "machine_id", "product_id", "product_name", "employee_name", "product_quantity", "product_batch_expiray_date", "aisles", "product_discount_type", "product_discount_code", "product_price", "days_remaining"];
    let data = getDataArray(foundElements, dataKeys);

    if (type.value === "XLS") handleExcelData({ data });
    else handlePDFData({ data });
  };

  const handleExcelData = ({ data }) => {
    const sampleData = [["Date/Time", "Machine ID", "Product ID", "Product Name", "Batch#", "Qty", "Expiry Date", "Aisle(s)", "	Disc Type", "Disc Date", "Price", "Days2sell", "Status"], ...data];
    exportToExcel(sampleData, "Stock-Level-Report");
  };
  const handlePDFData = ({ data }) => {
    const doc = new jsPDF();
    const transactions = [["Date/Time", "Machine ID", "Product ID", "Product Name", "Batch#", "Qty", "Expiry Date", "Aisle(s)", "	Disc Type", "Disc Date", "Price", "Days2sell", "Status"], ...data];

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
            <div className="font--lg font--900">Expiry Product Reports</div>
          </div>

          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <SearchSelect
              key={"reportStockType"}
              {...{
                selectedOption: selectedType,
                handleChange: handleTypeChange,
                uniqueKey: "reportStockTypes",
                placeholder: "Select type",
                options: EXPIRY_PRODUCT_TYPE_LIST?.map((item) => ({
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
        <div className="w--full h--full d--flex justify-content--between">
          <div className="d--flex gap--sm  w-max--200">
            <Button variant="primary" color="white" btnClasses="btn white-space--nowrap gap--sm">
              <ExportIcon width={18} />
              Export All Report
            </Button>
          </div>
          <div className="d--flex gap--sm justify-content--end w--full w-max--400">
            <div className="bg--black-100 radius--sm dropdownNoPadding p-r--sm ">
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

      {stockReportData && stockReportData?.data && <CommonReportTable data={stockReportData} columnsList={columns} handlePageChange={handlePageChange} totalRecords={stockReportData?.pagination?.total} setLength={setLength} length={length} isExpandAll={isExpandAll} selectedMachineIds={selectedMachineIds} setMachineIds={setMachineIds} additionalConditionsArr={[REPORT_TYPE_CONST.MACHINE, REPORT_TYPE_CONST.EXPIRY, REPORT_TYPE_CONST.PRODUCT].includes(selectedType.value)} isFetching={isFetching} />}
    </div>
  );
}
