import React, { useEffect, useState } from "react";
import SearchSelect from "../SearchSelect";
import {
  DATE_FILTERS_CONST,
  DATE_FILTERS_LIST,
} from "../../../Helpers/resource";
import {
  setCommonDateFilter,
  setCustomDates,
} from "../../../redux/slices/common-filter-slice";
import { useDispatch, useSelector } from "react-redux";
import calculateDateRange from "../../../Helpers/moment";
import DatePicker from "react-datepicker";
import moment from "moment";

const CommonDateFilter = (props) => {
  const dispatch = useDispatch();
  const commonDateFilter = useSelector(
    (state) => state.commonFilter.commonDateFilter
  );
  const commonCustomDates = useSelector(
    (state) => state.commonFilter.customDates
  );

  const [dateFilter, setDateFilter] = useState({
    label: commonDateFilter.name,
    value: JSON.stringify(commonDateFilter),
  });
  const [dateRange, setDateRange] = useState([
    commonCustomDates?.start,
    commonCustomDates?.end,
  ]);
  const [customStartDate, customEndDate] = dateRange;
  const [start_date, setStartDate] = useState(
    commonDateFilter.type == DATE_FILTERS_CONST.CUSTOM
      ? commonCustomDates?.start
      : calculateDateRange(commonDateFilter)?.startDate?.format(
          "YYYY-MM-DD HH:mm:ss"
        )
  );
  const [end_date, setEndDate] = useState(
    commonDateFilter.type == DATE_FILTERS_CONST.CUSTOM
      ? commonCustomDates?.end
      : calculateDateRange(commonDateFilter)?.endDate?.format(
          "YYYY-MM-DD HH:mm:ss"
        )
  );

  const handleDayFilter = (option) => {
    let value = JSON.parse(option);
    dispatch(setCommonDateFilter(JSON.parse(option)));
    if (value.type != DATE_FILTERS_CONST.CUSTOM) {
      setDateRange([]);
      dispatch(setCustomDates({ start: null, end: null }));
      const { startDate, endDate } = calculateDateRange(JSON.parse(option));
      setStartDate(startDate.format("YYYY-MM-DD HH:mm:ss"));
      setEndDate(endDate.format("YYYY-MM-DD HH:mm:ss"));
    } else {
      let today = moment().toDate();
      let threeMonthsAgo = moment().subtract(3, "months").toDate();
      setDateRange([threeMonthsAgo, today]);
      dispatch(setCustomDates({ start: threeMonthsAgo, end: today }));
      setStartDate(moment(threeMonthsAgo).format("YYYY-MM-DD HH:mm:ss"));
      setEndDate(moment(today).format("YYYY-MM-DD HH:mm:ss"));
    }
  };

  const handleDateFilterChange = (selectedOption) => {
    setDateFilter(selectedOption);
    handleDayFilter(selectedOption.value);
  };

  const onDateRangeChange = (dates) => {
    // console.log("dates", dates);
    setDateRange(dates);
    const [start, end] = dates;
    if (end) {
      dispatch(setCustomDates({ start: start, end: end }));
      setStartDate(moment(start).format("YYYY-MM-DD HH:mm:ss"));
      setEndDate(moment(end).format("YYYY-MM-DD HH:mm:ss"));
    }
  };

  useEffect(() => {
    if (start_date && end_date) {
      props.setSDates(start_date);
      props.setEDates(end_date);
    }
  }, [start_date, end_date]);

  return (
    <>
      <SearchSelect
        {...{
          selectedOption: dateFilter,
          handleChange: handleDateFilterChange,
          placeholder: "Select date",
          options: DATE_FILTERS_LIST?.map((item) => ({
            label: item?.name,
            value: JSON.stringify(item),
          })),
        }}
      />

      {dateFilter.label == DATE_FILTERS_CONST.CUSTOM && (
        <div className="w--full w-max--170">
          <DatePicker
            selectsRange={true}
            startDate={customStartDate}
            endDate={customEndDate}
            onChange={onDateRangeChange}
          />
        </div>
      )}
    </>
  );
};

export default CommonDateFilter;
