import React, { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getVendRunReport } from "../action";
import { REPORT_VEND_RUN_LIST } from "../constant";
import CommonReportTable from "../../../Widgets/web/CommonReportsTable";
import { REPORT_TYPE_CONST } from "../../Reports/constant";
import FormInput from "../../../Widgets/web/FormInput";
import useIcons from "../../../Assets/web/icons/useIcons";
import Button from "../../../Widgets/web/Button";
import CommonDateFilter from "../../../Widgets/web/CommonDateFilter";
import { machineList } from "../../Dashboard/action";
import { ALL_MACHINES_CONST } from "../../../Helpers/constant";
import { setCommonMachineFilter } from "../../../redux/slices/common-filter-slice";
import SearchSelect from "../../../Widgets/web/SearchSelect";
import useDebounce from "../../../Hooks/useDebounce";
import FullScreenLoader from "../../../Widgets/web/FullScreenLoader";
import Dropdown from "../../../Widgets/web/Dropdown";
import { exportToExcel } from "../../../Helpers/web/commonFn";

export default function VendRun() {
  const { SearchIcon, ExportIcon, CalendarIcon, CaretIcon, TrashIcon, FullScreenIcon } = useIcons();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const commonMachineIdFilter = useSelector((state) => state.commonFilter.commonMachineIdFilter);
  const [selectedOption, setSelectedOption] = useState(commonMachineIdFilter);
  const [selectedType, setSelectedType] = useState({
    label: REPORT_VEND_RUN_LIST[0].name,
    value: REPORT_VEND_RUN_LIST[0].id,
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
    data: _vendRunReport,
    isFetching,
  } = useQuery({
    queryKey: ["saleReportInfo", search, selectedOption, edates, sdates, selectedType, page, length],
    queryFn: () =>
      getVendRunReport({
        search,
        start_date: sdates,
        end_date: edates,
        type: selectedType.value,
        page: 1,
        length: length * page,
        machine_id: selectedOption?.value === "All machines" ? "" : selectedOption?.value || "",
      }),
    onSuccess: (data) => {},
    select: (data) => {
      return data.data;
    },
    enabled: sdates && edates ? true : false,
  });

  const vendRunReportData = useMemo(() => {
    if (_vendRunReport) {
      _data.current = _vendRunReport;
    }
    return _data.current;
  }, [_vendRunReport]);

  const handlePageChange = () => {
    setPage(page + 1);
  };

  const columns = [
    { key: "machine_name", label: "Machine" },
    { key: "id", label: "Vend ID" },
    { key: "vend_id", label: "Tx#" },
    { key: "customer_name", label: "Name" },
    { key: "aisle_number", label: "Aisle" },
    { key: "product_name", label: "Product" },
    { key: "timeOfCreation", label: "Date/Time" },
    { key: "status", label: "Status#" },
    { key: "updated_at", label: "Time in Q" },
  ];

  const exportReport = (type) => {
    if (selectedMachineIds.length == 0) return;
    let getDataArray = (array, keys) => array?.map((item) => keys.map((key) => item?.[key] || ""));

    let foundElements = Array.isArray(vendRunReportData?.data)
      ? vendRunReportData?.data.filter((item) => item && selectedMachineIds?.includes(item?.id))
      : vendRunReportData?.data &&
        Object.values(vendRunReportData?.data)
          .flat()
          .filter((item) => item && selectedMachineIds?.includes(item?.id));

    let dataKeys = ["machine_name", "id", "vend_id", "customer_name", "aisle_number", "product_name", "timeOfCreation", "status", "updated_at"];
    let data = getDataArray(foundElements, dataKeys);
    if (type.value === "XLS") handleExcelData({ data });
    else handlePDFData({ data });
  };

  const handleExcelData = ({ data }) => {
    const sampleData = [["Machine", "Vend ID", "Tx#", "Name", "Aisle", "Product", "Date/Time", "Status#", "Timestamp", "Time in Q"], ...data];
    exportToExcel(sampleData, "Remote-Vend-Queue​");
  };
  const handlePDFData = ({ data }) => {
    const doc = new jsPDF();

    const transactions = [["Machine", "Vend ID", "Tx#", "Name", "Aisle", "Product", "Date/Time", "Status#", "Timestamp", "Time in Q"], ...data];

    doc.autoTable({
      head: transactions.slice(0, 1),
      body: transactions.slice(1),
      startY: 10,
    });
    doc.save("Remote-Vend-Queue.pdf");
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
                options: REPORT_VEND_RUN_LIST?.map((item) => ({
                  label: item?.name,
                  value: item.id,
                })),
              }}
            />
            <div className="w--full w-max--250 position--relative">
              <FormInput
                placeholder="Search"
                onKeyUp={(event) => handleSearchFilter(event.target.value)}
                icon={
                  <div className="d--flex position--absolute left--10 top--5 text--black-400">
                    <SearchIcon width={15} />
                  </div>
                }
              />
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

      <div className="w--full h--full bg--white p--sm radius--md d--flex flex--column gap--sm">
        <div className="w--full h--full d--flex justify-content--between">
          <div className="d--flex gap--sm justify-content--end w--full w-max--200">
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
      <CommonReportTable data={vendRunReportData} columnsList={columns} handlePageChange={handlePageChange} totalRecords={vendRunReportData?.pagination?.total} setLength={setLength} length={length} isExpandAll={isExpandAll} selectedMachineIds={selectedMachineIds} setMachineIds={setMachineIds} additionalConditionsArr={[REPORT_TYPE_CONST.MACHINE, REPORT_TYPE_CONST.PRODUCT, REPORT_TYPE_CONST.NAME, REPORT_TYPE_CONST.PAY_TYPE, REPORT_TYPE_CONST.QUEUE_STATUS].includes(selectedType.value)} isFetching={isFetching} />
    </div>
  );
}
