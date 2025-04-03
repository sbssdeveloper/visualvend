import React, { useEffect, useMemo, useRef, useState } from "react";
import FormInput from "../../../../Widgets/web/FormInput";
import useIcons from "../../../../Assets/web/icons/useIcons";
import Button from "../../../../Widgets/web/Button";
import SearchSelect from "../../../../Widgets/web/SearchSelect";
import CommonDateFilter from "../../../../Widgets/web/CommonDateFilter";
import { machineList } from "../../../Dashboard/action";
import { useDispatch, useSelector } from "react-redux";
import { REPORT_TYPE_CONST, REPORT_TYPE_LIST } from "../../constant";
import { ALL_MACHINES_CONST } from "../../../../Helpers/constant";
import { setCommonMachineFilter } from "../../../../redux/slices/common-filter-slice";
import useDebounce from "../../../../Hooks/useDebounce";
import { getVendActivityReport } from "../../action";
import { useQuery } from "@tanstack/react-query";
import FullScreenLoader from "../../../../Widgets/web/FullScreenLoader";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Dropdown from "../../../../Widgets/web/Dropdown";
import CommonReportTable from "../../../../Widgets/web/CommonReportsTable";
import { exportToExcel } from "../../../../Helpers/web/commonFn";

export default function VendActivityReport() {
  const { SearchIcon, ExportIcon, CalendarIcon, RightCornerIcon, LeftCornerIcon, FullScreenIcon, AngleDownIcon, CaretIcon } = useIcons();

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
    data: _vend,
    isFetching,
  } = useQuery({
    queryKey: ["vendActivityReportInfo", search, selectedOption, edates, sdates, selectedType, page, length],
    queryFn: () =>
      getVendActivityReport({
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

  const vendActivityReport = useMemo(() => {
    if (_vend) {
      _data.current = _vend;
    }
    return _data.current;
  }, [_vend]);

  const handlePageChange = () => {
    setPage(page + 1);
  };

  const columns = [
    { key: "transaction_id", label: "Trans ID" },
    { key: "product_id", label: "Product ID" },
    { key: "product_name", label: "Product Name" },
    { key: "price", label: "Price" },
    { key: "machine_id", label: "Machine ID" },
    { key: "vend_state", label: "Vend State" },
    { key: "aisle_no", label: "Aisle#" },
    { key: "errror_code", label: "Error Code" },
    { key: "status", label: "Status" },
    { key: "product_quantity", label: "Qty" },
    { key: "product_max_quantity", label: "Qty Now" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const exportReport = (type) => {
    if (selectedMachineIds.length == 0) return;
    let getDataArray = (array, keys) => array?.map((item) => keys.map((key) => item?.[key] || ""));
    let foundElements = Array.isArray(vendActivityReport?.data)
      ? vendActivityReport?.data.filter((item) => item && selectedMachineIds?.includes(item?.id))
      : vendActivityReport?.data &&
        Object.values(vendActivityReport?.data)
          .flat()
          .filter((item) => item && selectedMachineIds?.includes(item?.id));

    let dataKeys = ["transaction_id", "product_id", "product_name", "price", "machine_id", "vend_state", "aisle_no", "errror_code", "status", "product_quantity", "product_max_quantity", "timestamp"];
    let data = getDataArray(foundElements, dataKeys);
    if (type.value === "XLS") handleExcelData({ data });
    else handlePDFData({ data });
  };

  const handleExcelData = ({ data }) => {
    const sampleData = [["Total Vends"], [vendActivityReport?.pagination?.total], [], ["Total Sales"], [vendActivityReport?.sales], [], ["Failed Vends"], [vendActivityReport?.failed], [], ["Transactions Cancelled"], [vendActivityReport?.cancelled], [], ["Trans ID", "Product ID", "Product Name", "Price", "Machine ID", "Vend State", "Aisle#", "Error Code", "Status", "Qty", "Qty Now", "Timestamp"], ...data];
    exportToExcel(sampleData, "Vend-Activity-Reports");
  };
  const handlePDFData = ({ topSelling, leastSelling, data }) => {
    const doc = new jsPDF();
    const totalVends = [["Total Vends"], [vendActivityReport?.pagination?.total]];
    const totalSales = [["Total Sales"], [vendActivityReport?.sales]];
    const failedVends = [["Failed Vends"], [vendActivityReport?.failed]];
    const transactionCancelled = [["Transactions Cancelled"], [vendActivityReport?.cancelled]];

    const transactions = [["Trans ID", "Product ID", "Product Name", "Price", "Machine ID", "Vend State", "Aisle#", "Error Code", "Status", "Qty", "Qty Now", "Timestamp"], ...data];
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
      head: failedVends.slice(0, 1),
      body: failedVends.slice(1),
      startY: doc.previousAutoTable.finalY + 10,
    });

    doc.autoTable({
      head: transactionCancelled.slice(0, 1),
      body: transactionCancelled.slice(1),
      startY: doc.previousAutoTable.finalY + 10,
    });

    doc.autoTable({
      head: transactions.slice(0, 1),
      body: transactions.slice(1),
      startY: doc.previousAutoTable.finalY + 10,
    });
    doc.save("Vend-Activity-Reports.pdf");
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
            <div className="font--lg font--900">Vend Activity Reports</div>
          </div>

          <div className="d--flex align-items--center justify-content--end gap--sm w--full">
            <SearchSelect
              key={"reportRefillType"}
              {...{
                selectedOption: selectedType,
                handleChange: handleTypeChange,
                uniqueKey: "reportRefillTypes",
                placeholder: "Select type",
                options: REPORT_TYPE_LIST?.map((item) => ({
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
      {/* <div className="w--full h--full d--flex justify-content--end bg--white p--md radius--md">
        
      </div> */}
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
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Vends</div>

              <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{vendActivityReport?.pagination?.total}</div>
            </div>
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--primary right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--primary left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Total Sales</div>

              <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{vendActivityReport?.sales}</div>
            </div>

            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--primary right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--primary left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Failed Vends</div>

              <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{vendActivityReport?.failed}</div>
            </div>
            <div className="bg--white box-shadow--xs radius--md d--flex flex--column p--md gap--sm  topBoxItem position--relative w--full ">
              <div className="position--absolute text--primary right---5 top---4 ">
                <RightCornerIcon width={30} height={30} />
              </div>
              <div className="position--absolute text--primary left---4 bottom---10 ">
                <LeftCornerIcon width={30} height={30} />
              </div>
              <div className="font--md font--500 p-b--sm m-b--sm h-min--36 border-bottom--black-100 text--black">Transactions Cancelled</div>

              <div className="font--2xl font--600 text--primary gap--sm d--flex align-items--center justify-content--center w--full h-min--85 h--full">{vendActivityReport?.cancelled}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w--full h--full bg--white p--sm radius--md d--flex flex--column gap--sm">
        <div className="w--full h--full d--flex justify-content--between">
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

      <CommonReportTable data={vendActivityReport} columnsList={columns} handlePageChange={handlePageChange} totalRecords={vendActivityReport?.pagination?.total} setLength={setLength} length={length} isExpandAll={isExpandAll} selectedMachineIds={selectedMachineIds} setMachineIds={setMachineIds} additionalConditionsArr={[REPORT_TYPE_CONST.MACHINE, REPORT_TYPE_CONST.EMPLOYEE, REPORT_TYPE_CONST.PRODUCT].includes(selectedType.value)} isFetching={isFetching} />
    </div>
  );
}
