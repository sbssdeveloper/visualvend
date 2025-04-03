import { STRING_FORMATING_TYPE } from "./resource";


export const TASK_TABLE_COLUMNS = [
  {
    name: "Vend Name",
    key: "vend_name",
  },
  {
    name: "Product Name",
    key: "product_name",
  },
  {
    name: "Company Name",
    key: "company_name",
  },
];

export const VEND_RUN_TABLE_COLUMNS = [
  {
    name: "Client",
    key: "client_name",
  },
  {
    name: "Machine",
    key: "machine_name",
  },
  {
    name: "Product",
    key: "product_name",
  },
  {
    name: "Price",
    key: "product_price",
  },
];

export const REFILL_TABLE_COLUMNS = [
  {
    name: "Client",
    key: "client_name",
  },
  {
    name: "Machine",
    key: "machine_name",
  },
  {
    name: "Product",
    key: "product_name",
  },
  {
    name: "Aisle",
    key: "aisle_no",
  },
  {
    name: "Count",
    key: "refill",
  },
];

export const RECENT_FEED_TABLE_COLUMNS = [
  {
    name: "Created On",
    key: "created_on",
  },
  {
    name: "Feed",
    key: "feed",
  },
  {
    name: "Machine ",
    key: "machine_name",
  },
];

export const ALL_MACHINES_CONST = {
  id: "All machines",
  machine_name: "All machines",
};

export const PAYEMNT_PAGE_TYPE = {
  CARD: "all-card-payments",
  MOBILE: "all-mobile-payments",
};


export const PAYMENT_TYPE_CONST = {
  VISA: "VISA",
  GPAY: "google_pay",
  APPLE_PAY: "apple_pay",
  PAYPAL: "paypal",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

// export const API_BASE_URL = "https://visualvend.com:8445/";
// export const MEDIA_BASE_URL = "https://visualvend.com:8445/s3/media/image/";
// export const MEDIA_BASE_URL_2 = "https://vv.vendportal.com/";
// export const VISUAL_API_BASE_URL = "https://visualvend.com/index.php/";
// export const VEND_PORTAL_URL = "https://vv.vendportal.com/";


export const API_BASE_URL = "http://162.252.85.40:8445/";
export const MEDIA_BASE_URL = "http://162.252.85.40:8445/s3/media/image/";
export const MEDIA_BASE_URL_2 = "http://162.252.85.40/";
export const VISUAL_API_BASE_URL = "https://visualvend.com/index.php/";
export const VEND_PORTAL_URL = "http://162.252.85.40/";

// utils/environment.js

export const getEnvironment = (() => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return () => ({ PLATFORM: "WEB" });
  } else {
    return () => ({ PLATFORM: "NATIVE" });
  }
})();

export const VEND_STATUS_CONST = {
  CREATED: "0",
  INITIATE: "1",
  SUCCESS: "2",
  SERIAL_ERROR: "3",
  AISLE_ERROR: "4",
  MOTOR_ERROR: "5",
  OUT_OF_STOCK: "6",
  PRIORITY: "7",
  DROP_ERROR: "8",
  VENDING: "11",
  CANCEL: "00",
};

const statusMapping = {
  "0": { status: "INPROGRESS", color: "#f1c40f" },
  "1": { status: "INPROGRESS", color: "#f1c40f" },
  "2": { status: "SUCCESS", color: "#19b067" },
  "3": { status: "SERIAL_ERROR", color: "#DC405C" },
  "4": { status: "AISLE_ERROR", color: "#DC405C" },
  "5": { status: "MOTOR_ERROR", color: "#DC405C" },
  "6": { status: "OUT_OF_STOCK", color: "#f1c40f" },
  "7": { status: "INPROGRESS", color: "#f1c40f" },
  "8": { status: "DROP_ERROR", color: "#DC405C" },
  "11": { status: "INPROGRESS", color: "#f1c40f" },
  "22": { status: "MAXIMUM", color: "#f1c40f" },
  "00": { status: "CANCEL", color: "#DC405C" },
  "22": { status: "PAYMENT_ERROR", color: "#DC405C" },
};

export const getStatusDetails = (status) => {

  return statusMapping[status] || {}
};


export function getPercentageData(number, totalNumber) {
  if (typeof number !== 'number' || typeof totalNumber !== 'number' || totalNumber === 0) {
    return 0;
  }
  return +((number / totalNumber) * 100).toFixed(1);
}

export const defaultFunction  =() => null






