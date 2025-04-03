import moment from "moment";
import { DATE_FILTERS_CONST } from "./resource";

const calculateDateRange = (option) => {
  const currentDate = moment();
  let startDate, endDate;

  switch (option.name) {
    case DATE_FILTERS_CONST.FOUR_HOURS:
      startDate = currentDate.clone().subtract(option.value, option.type);
      endDate = currentDate;
      break;
    case DATE_FILTERS_CONST.TODAY:
      startDate = currentDate.clone().startOf(option.type);
      endDate = currentDate.clone().endOf(option.type);
      break;
    case DATE_FILTERS_CONST.ONE_DAY:
    case DATE_FILTERS_CONST.TWO_DAY:
    case DATE_FILTERS_CONST.THREE_DAY:
    case DATE_FILTERS_CONST.LAST_2_Week:
    case DATE_FILTERS_CONST.WEEK:
    case DATE_FILTERS_CONST.LAST_3_Week:
      startDate = currentDate.clone().subtract(option.value, option.type);
      endDate = currentDate;
      break;
    case DATE_FILTERS_CONST.LAST_MONTH:
      startDate = currentDate
        .clone()
        .subtract(option.value, option.type)
        .startOf(option.type)
        ;
      endDate = currentDate
        .clone()
        .subtract(option.value, option.type)
        .endOf(option.type)
        ;
      break;
    default:
      startDate = null;
      endDate = null;
      break;
  }

  return { startDate, endDate };
};

export default calculateDateRange;

export const formatDate = (date, format) => {
  return moment(date).format(format);
};
