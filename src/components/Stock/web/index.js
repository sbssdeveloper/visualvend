import React, { useCallback, useEffect, useState } from "react";
import FormInput from "../../../Widgets/web/FormInput";
import FormSelect from "../../../Widgets/web/FormSelect";
import Button from "../../../Widgets/web/Button";
import SearchSelect from "../../../Widgets/web/SearchSelect";
import {
  DATE_FILTERS_CONST,
  DATE_FILTERS_LIST,
  chunkArray,
} from "../../../Helpers/resource";
import calculateDateRange from "../../../Helpers/moment";
import {
  setCommonDateFilter,
  setCommonMachineFilter,
  setCustomDates,
} from "../../../redux/slices/common-filter-slice";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import moment from "moment";
import { machineList } from "../../Dashboard/action";
import { ALL_MACHINES_CONST } from "../../../Helpers/constant";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  machineProductList,
  refillStock,
  resetStock,
  stockList,
} from "../action";
import useMutationData from "../../../Hooks/useCommonMutate";
import { ACTION_TYPE } from "../const";
import { showErrorToast, showSuccessToast } from "../../../Helpers/web/toastr";
import useIcons from "../../../Assets/web/icons/useIcons";
import useInvalidateQuery from "../../../Hooks/useInvalidateQuery";
import CommonModal from "../../../Widgets/web/CommonModal";

export default function Stock() {
  const { BanIcon } = useIcons();
  const dispatch = useDispatch();
  const [selectedAisleNo, setSelectedAsileNo] = useState([]);
  const { invalidateQuery } = useInvalidateQuery();
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const commonMachineIdFilter = useSelector(
    (state) => state.commonFilter.commonMachineIdFilter
  );

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedAsile, setSelectedAsile] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actionType, setActionType] = useState(false);

  const [selectedOption, setSelectedOption] = useState(commonMachineIdFilter);

  const handleChange = (selectedOption) => {
    setSelectedAsileNo([]);
    setSelectedOption(selectedOption);
    dispatch(setCommonMachineFilter(selectedOption));
  };

  const { isLoading, data: stockLevelList } = useQuery({
    queryKey: ["stockInfo", selectedOption],
    queryFn: () =>
      stockList({
        machine_id: selectedOption?.value,
      }),
    select: (data) => {
      return data.data.data;
    },
    enabled: selectedOption?.value !== "All machines",
  });
  let chunkedData = [];
  if (stockLevelList) {
    chunkedData = chunkArray(
      stockLevelList.stock,
      stockLevelList.dimensions.machine_column,
      stockLevelList.dimensions.machine_row
    );
  }

  const { isLoading: isMachineProductLoading, data: productList } = useQuery({
    queryKey: ["selectedMachineProductList", selectedOption],
    queryFn: () =>
      machineProductList({
        machine_id: selectedOption?.value,
      }),
    select: (data) => {
      return data.data.data;
    },
    enabled: selectedOption?.value !== "All machines",
  });

  const onSelectAsileNo = (item) => {
    if (item.noRecord) return;
    let asileNoIndex = selectedAisleNo.findIndex((el) => el === item.aisle_no);
    if (asileNoIndex !== -1) {
      const newSelectedAsile = selectedAisleNo.filter(
        (el) => el !== item.aisle_no
      );
      setSelectedAsileNo(newSelectedAsile);
    } else {
      setSelectedAsileNo([...selectedAisleNo, item.aisle_no]);
    }
  };

  const checkSelection = (item) => {
    let asileNoIndex = selectedAisleNo.findIndex((el) => el === item.aisle_no);
    return asileNoIndex;
  };

  const getStockColorClass = (item) => {
    if (checkSelection(item) != -1) return "primary";
    else if (item.noRecord) return "danger";
    else if (!item.product_quantity) return "red";
    if (item.product_quantity === item.product_max_quantity) return "success";
    else if (item.product_quantity < item.product_max_quantity)
      return "warning";
  };

  const resetMachineStock = useMutationData(resetStock, (data) => {
    handleStockSuccess(data);
  });
  const refillMachineStock = useMutationData(refillStock, (data) => {
    handleStockSuccess(data);
  });

  function openConfirmationModa(type) {
    setConfirmationMessage(
      `Are you sure, you want to ${type.toLowerCase()} this asiles? This action cannot be undone!`
    );
    setActionType(type);
    setShowConfirmationModal(true);
  }

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  function handeResetRefillStock(type) {
    if (
      selectedAisleNo.length == 0 ||
      !selectedOption.value ||
      selectedOption?.value === "All machines"
    )
      return;

    let payload = {
      machine_id: selectedOption?.value,
      aisles: selectedAisleNo,
    };
    if (type == ACTION_TYPE.REFILL) refillMachineStock.mutate(payload);
    else resetMachineStock.mutate(payload);
  }

  const handleStockSuccess = (data) => {
    const status = data?.status;
    const responseData = data?.data;
    handleCloseConfirmationModal()
    if (status !== 200) {
      showErrorToast(responseData?.message);
      return;
    }
    showSuccessToast(responseData?.message);
    setSelectedAsileNo([]);
    setActionType(null);
    
    invalidateQuery("stockInfo");
  };

  const handleProductChange = (selectedOption) => {
    setSelectedProduct(selectedOption);
    let ids = [];
    stockLevelList.stock.forEach((el) => {
      if (el.product_name == selectedOption.value) {
        if (!selectedAisleNo.includes(el.aisle_no)) {
          ids.push(el.aisle_no);
        }
      }
    });

    setSelectedAsileNo([...selectedAisleNo, ...ids]);
  };

  const handleRowChange = (selectedOption) => {
    setSelectedRow(selectedOption);
    let rowData = chunkedData[selectedOption.value];
    let ids = [];
    rowData.forEach((el) => {
      if (!selectedAisleNo.includes(el.aisle_no) && !el.noRecord) {
        ids.push(el.aisle_no);
      }
    });

    setSelectedAsileNo([...selectedAisleNo, ...ids]);
    console.log("rowData", rowData);
  };
  const handleAsileChange = (selectedOption) => {
    setSelectedAsile(selectedOption);
    if (!selectedAisleNo.includes(selectedOption.value)) {
      setSelectedAsileNo([...selectedAisleNo, selectedOption.value]);
    }
  };

  return (
    <div className="w--full d--flex flex--column gap--md stockPage h--full">
      <div className="w--full">
        <div className="d--flex justify-content--between align-items--center h-min--36">
          <div className="w-max--400 w--full position--relative">
            <div className="font--lg font--900">Stock Levels</div>
          </div>
          <div className="d--flex align-items--center gap--sm w--full w-max--600 z-index--sm">
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
      <div className="w--full bg--white radius--sm p--md gap--md d--flex">
        <SearchSelect
          {...{
            selectedOption: selectedProduct,
            handleChange: handleProductChange,
            placeholder: "Select product",
            options: productList?.map((item) => ({
              label: item.product_name,
              value: item.product_name,
            })),
          }}
        />
        <SearchSelect
          {...{
            selectedOption: selectedRow,
            handleChange: handleRowChange,
            placeholder: "Select row",
            options: chunkedData?.map((item, index) => ({
              label: `Row ${index + 1}`,
              value: index,
            })),
          }}
        />
        <SearchSelect
          {...{
            selectedOption: selectedAsile,
            handleChange: handleAsileChange,
            placeholder: "Select row",
            options: stockLevelList?.stock?.map((item, index) => ({
              label: item.aisle_no,
              value: item.aisle_no,
            })),
          }}
        />
      </div>
      <div className="w--full h--full bg--white radius--sm p--md gap--md d--flex flex--column stockList overflow--auto">
        <div className="w--full d--flex align-items--center gap--md h-min--50 p-b--md border-bottom--black-100">
          <div className="font--sm text--black w-max--20 w-min--20"></div>
          <div className="font--sm text--black font--500 w-min--100">Row</div>
          <div className="font--sm text--black d--flex gap--xl w--full">
            <div className="font--sm text--danger border-bottom--danger d--flex align-items--center p-b--xs">
              Quarantined
            </div>
            <div className="font--sm text--red border-bottom--red d--flex align-items--center p-b--xs">
              Empty
            </div>
            <div className="font--sm text--warning border-bottom--warning d--flex align-items--center p-b--xs">
              Part Fill
            </div>
            <div className="font--sm text--success border-bottom--success d--flex align-items--center p-b--xs">
              Full
            </div>
          </div>
          <div className="w-max--200 w--full gap--sm d--flex justify-content--end">
            {selectedAisleNo.length != 0 && (
              <>
                {" "}
                <Button
                  variant="primary"
                  color="white"
                  btnClasses="btn w-max--100"
                  onClick={() => openConfirmationModa(ACTION_TYPE.RESET)}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  color="white"
                  btnClasses="btn w-max--100"
                  onClick={() => openConfirmationModa(ACTION_TYPE.REFILL)}
                >
                  Refill
                </Button>
              </>
            )}
          </div>
        </div>
        {chunkedData.map((row, rowIndex) => (
          <div
            className="w--full d--flex align-items--center gap--md h-min--50 p-b--md border-bottom--black-100 "
            key={rowIndex}
          >
            <div className="font--sm text--black w-max--20 w-min--20"></div>
            <div className="font--sm text--black-600 w-min--100">
              {rowIndex + 1}
            </div>
            <div className="d--flex gap--lg w--full">
              {row.map((item, colIndex) => (
                <div
                  className={`position--relative w--full w-min--75 h-min--40  h-max--40 d--flex align-items--center justify-content--center text--${
                    checkSelection(item) != -1 ? "white" : "black-600"
                  } bg--${
                    checkSelection(item) != -1 ? "primary" : "contrast"
                  } radius--xs font--sm border-full--${getStockColorClass(
                    item
                  )}`}
                  key={colIndex}
                  onClick={() => onSelectAsileNo(item)}
                >
                  <div
                    className={`w--full h-min--1 h-max--1 bg--${getStockColorClass(
                      item
                    )} w-max--50 position--absolute top---6`}
                  ></div>
                  {item.aisle_no}
                  {item.noRecord && (
                    <div className="position--absolute opacity--xs text--red-800 top--2">
                      <BanIcon width={35} height={35} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <CommonModal
          show={showConfirmationModal}
          onClose={handleCloseConfirmationModal}
          key={"deleteModal"}
          isShowCloseBtn={false}
        >
          <div className=" w--full w-max--300 w-min--300 d--flex flex--column gap--md p--xl">
            <div className="w--full p-t--md p-b--md">
              <div className="font--md text--c font--600 line-height--1-dot-5">
                {confirmationMessage}
              </div>
            </div>
            <div className="modal-foot h--full h-max--50 h-min--50 p-l--md p-r--md d--flex align-items--center justify-content--center  gap--sm">
              <Button
                variant="black-100"
                color="black-800 w-max--200"
                btnClasses="btn"
                type="button"
                onClick={() => handleCloseConfirmationModal()}
              >
                No
              </Button>
              <Button
                variant="primary"
                btnClasses="btn w-max--200"
                onClick={() => handeResetRefillStock(actionType)}
              >
                Yes
              </Button>
            </div>
          </div>
        </CommonModal>
      </div>
    </div>
  );
}
