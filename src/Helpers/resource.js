import moment from "moment";

export function getrRangeWidth(maxWidth, percentage) {
  const calculatedWidth = (percentage / 100) * maxWidth;
  return calculatedWidth;
}

export const DATE_FILTERS_CONST = {
  FOUR_HOURS: "4 hours",
  TODAY: "Today",
  ONE_DAY: "1 day (last 24 hrs)",
  TWO_DAY: "2 day (last 48 hrs)",
  THREE_DAY: "3 days",
  WEEK: "Week",
  LAST_2_Week: "Last 2 weeks",
  LAST_3_Week: "Last 3 weeks",
  LAST_MONTH: "Last month",
  CUSTOM: "Custom",
};

export const PAYMENT_OPTION_CONST = {
  GPAY: "GPAY",
  APPLE: "Apple",
  AFTERPAY: "Afterpay",
  PAYPAL: "Paypal",
};

export const PAYMENT_OPTIONS_CARD_CONST = {
  VISA: "Visa",
  DEBIT_CARD: "Debit card",
  MASTER_CARD: "Mastercard",
  AMEX: "Amex",
};

export const PAYMENT_OPTION_LIST = [
  {
    uuid: 0,
    name: "All pay methods",
    value: "",
  },
  {
    uuid: 1,
    name: PAYMENT_OPTION_CONST.GPAY,
    value: "google_pay",
  },
  {
    uuid: 2,
    name: PAYMENT_OPTION_CONST.APPLE,
    value: "apple_pay",
  },
  {
    uuid: 3,
    name: PAYMENT_OPTION_CONST.AFTERPAY,
    value: "afterpay",
  },
  {
    uuid: 4,
    name: PAYMENT_OPTION_CONST.PAYPAL,
    value: "paypal",
  },
];

export const CARD_PAYMENT_OPTION_LIST = [
  {
    uuid: 1,
    name: "All pay methods",
    value: "",
  },
  {
    uuid: 2,
    name: PAYMENT_OPTIONS_CARD_CONST.VISA,
    value: "VISA",
  },
  {
    uuid: 3,
    name: PAYMENT_OPTIONS_CARD_CONST.MASTER_CARD,
    value: "MASTERCARD",
  },
  {
    uuid: 4,
    name: PAYMENT_OPTIONS_CARD_CONST.AMEX,
    value: "AMEX",
  },
];

export const DATE_FILTERS_LIST = [
  {
    uuid: 1,
    name: DATE_FILTERS_CONST.FOUR_HOURS,
    value: 4,
    type: "hours",
  },
  {
    uuid: 2,
    name: DATE_FILTERS_CONST.TODAY,
    value: 1,
    type: "day",
  },
  {
    uuid: 3,
    name: DATE_FILTERS_CONST.ONE_DAY,
    value: 1,
    type: "day",
  },
  {
    uuid: 4,
    name: DATE_FILTERS_CONST.TWO_DAY,
    value: 2,
    type: "days",
  },
  {
    uuid: 5,
    name: DATE_FILTERS_CONST.THREE_DAY,
    value: 3,
    type: "days",
  },
  {
    uuid: 6,
    name: DATE_FILTERS_CONST.WEEK,
    value: 1,
    type: "week",
  },
  {
    uuid: 7,
    name: DATE_FILTERS_CONST.LAST_2_Week,
    value: 2,
    type: "weeks",
  },
  {
    uuid: 8,
    name: DATE_FILTERS_CONST.LAST_3_Week,
    value: 3,
    type: "weeks",
  },
  {
    uuid: 9,
    name: DATE_FILTERS_CONST.LAST_MONTH,
    value: 1,
    type: "month",
  },
  {
    uuid: 10,
    name: DATE_FILTERS_CONST.CUSTOM,
    value: 1,
    type: DATE_FILTERS_CONST.CUSTOM,
  },
];

export function getPercentage(number, totalNumber) {
  if (typeof number !== 'number' || typeof totalNumber !== 'number' || totalNumber === 0) {
    return 0;
  }
  return +((number / totalNumber) * 100).toFixed(1);
}

export const PAYEMENT_EVENT_FILTERS_LIST = [
  { title: "All Payment Status", uuid: "1", value: "all" },
  { title: "Successfull Payments", uuid: "2", value: "success" },
  { title: "Failed Payments", uuid: "3", value: "error" },
];

export const STRING_FORMATING_TYPE = {
  UNDER_SCORE: "remove underascore",
  UTC_TO_LOCAL: "utc to local",
};
export function removeUnderScore(str) {
  const words = str.split("_");
  const formattedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  return formattedWords.join(" ");
}

export function utcToLocalDate(value) {
  let convertToUTCString = moment(new Date(value).toUTCString()).format("YYYY-MM-DD HH:mm:ss");
  let toUtcFormat = moment.utc(convertToUTCString).toDate();

  return moment(toUtcFormat).local().format("YYYY-MM-DD hh:mm:ss a");
}

export function stringFormating(value, type) {
  switch (type) {
    case STRING_FORMATING_TYPE.UNDER_SCORE:
      return removeUnderScore(value);
    case STRING_FORMATING_TYPE.UTC_TO_LOCAL:
      return utcToLocalDate(value);
    default:
      break;
  }
}


export const chunkArray = (array, chunkSize, checkRow) => {


  const totalCells = checkRow * chunkSize;
  const placeholdersNeeded = totalCells - array?.length;

  // Add placeholder objects to the data if needed
  for (let i = 0; i < placeholdersNeeded; i++) {
    array.push({ noRecord: true });
  }

  const result = [];
  let aisleIndex = 1;

  for (let rowIndex = 0; rowIndex < checkRow; rowIndex++) {
    const startAisle = aisleIndex;
    const endAisle = startAisle + chunkSize - 1;
    const currentRow = [];

    // Map aisle numbers to their index in the current row
    for (let j = startAisle; j <= endAisle; j++) {
      const item = array.find(obj => parseInt(obj.aisle_no, 10) === j);
      if (item) {
        currentRow.push(item);
      } else {
        currentRow.push({ aisle_no: j.toString(), noRecord: true });
      }
    }

    // Add the current row to the result
    result.push(currentRow);
    aisleIndex += chunkSize;
  }

  // Ensure the correct number of rows by adding rows filled with noRecord if needed
  while (result.length < checkRow) {
    const row = [];
    for (let i = 0; i < chunkSize; i++) {
      row.push({ aisle_no: (aisleIndex + i).toString(), noRecord: true });
    }
    result.push(row);
    aisleIndex += chunkSize;
  }

  return result;
};
