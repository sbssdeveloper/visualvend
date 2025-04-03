import React, { useEffect, useMemo, useRef, useState } from "react";
import FormInput from "../../../../Widgets/web/FormInput";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import { useDispatch, useSelector } from "react-redux";
import { REPORT_TYPE_CONST, REPORT_VEND_ERROR_LIST } from "../../constant";
import { setCommonMachineFilter } from "../../../../redux/slices/common-filter-slice";
import { useQuery } from "@tanstack/react-query";
import { getVendErrorReport } from "../../action";
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

export default function VendErrorReport() {
  const { SearchIcon, ExportIcon, TrashIcon, FullScreenIcon, AngleDownIcon, CaretIcon } = useIcons();
  const dispatch = useDispatch();
  const commonMachineIdFilter = useSelector((state) => state.commonFilter.commonMachineIdFilter);
  const [selectedOption, setSelectedOption] = useState(commonMachineIdFilter);
  const [selectedType, setSelectedType] = useState({
    label: REPORT_VEND_ERROR_LIST[REPORT_VEND_ERROR_LIST.length - 1].name,
    value: REPORT_VEND_ERROR_LIST[REPORT_VEND_ERROR_LIST.length - 1].id,
  });
  const [sdates, setSDates] = useState(null);
  const [edates, setEDates] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMachineIds, setMachineIds] = useState([]);
  const [isExpandAll, setExpandAll] = useState(false);
  const [length, setLength] = useState(50);
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
    data: _vendError,
    isFetching,
  } = useQuery({
    queryKey: ["refillReportInfo", search, selectedOption, edates, sdates, selectedType, page, length],
    queryFn: () =>
      getVendErrorReport({
        search,
        start_date: sdates,
        end_date: edates,
        type: selectedType.value,
        page,
        length: length * page,
        machine_id: selectedOption?.value === "All machines" ? "" : selectedOption?.value || "",
      }),
    onSuccess: (data) => {},
    select: (data) => {
      return data.data;
    },
    enabled: sdates && edates ? true : false,
  });

  const stockReportData = useMemo(() => {
    if (_vendError) {
      _data.current = _vendError;
    }
    return _data.current;
  }, [_vendError]);

  const handlePageChange = () => {
    setPage(page + 1);
  };

  const columns = [
    { key: "defect_id", label: "Defect Id" },
    { key: "machine_name", label: "Machine Name" },
    { key: "product_name", label: "Product Name" },
    { key: "defective_location", label: "Aisle#" },
    { key: "error_code", label: "Error Code" },
    { key: "status", label: "Status" },
    { key: "timestamp", label: "Timestamp" },
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

    let dataKeys = ["defect_id", "machine_name", "product_name", "defective_location", "error_code", "status", "timestamp"];
    let data = getDataArray(foundElements, dataKeys);
    if (type.value === "XLS") handleExcelData({ data });
    else handlePDFData({ data });
  };

  const handleExcelData = ({ data }) => {
    const sampleData = [["Defect Id", "Machine Name", "Product Name", "Aisle#", "Error Code", "Status", "Timestamp"], ...data];
    exportToExcel(sampleData, "Stock-Level-Report");
  };
  const handlePDFData = ({ data }) => {
    const doc = new jsPDF();
    const transactions = [["Defect Id", "Machine Name", "Product Name", "Aisle#", "Error Code", "Status", "Timestamp"], ...data];

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
            <div className="font--lg font--900">Machine Status Reports</div>
          </div>

          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <SearchSelect
              key={"reportStockType"}
              {...{
                selectedOption: selectedType,
                handleChange: handleTypeChange,
                uniqueKey: "reportStockTypes",
                placeholder: "Select type",
                options: REPORT_VEND_ERROR_LIST?.map((item) => ({
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

      {/* <div className="w--full d--flex justify-content--end bg--white p--md radius--md">
        
      </div> */}
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

      <CommonReportTable data={stockReportData} columnsList={columns} handlePageChange={handlePageChange} totalRecords={stockReportData?.pagination?.total} setLength={setLength} length={length} isExpandAll={isExpandAll} selectedMachineIds={selectedMachineIds} setMachineIds={setMachineIds} additionalConditionsArr={[REPORT_TYPE_CONST.MACHINE, REPORT_TYPE_CONST.SUMMARY, REPORT_TYPE_CONST.ALL_ERRORS].includes(selectedType.value)} isFetching={isFetching} />
    </div>
  );
}
