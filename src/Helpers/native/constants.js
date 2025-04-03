import moment from "moment";
// import { Dimensions } from "react-native";
import * as Yup from "yup";
import { SelectRoundBox, UnSelectedRoundBox } from "../../Assets/native/images";

const buildType = "Dev"; // Live / Dev

export const apiBaseURL = buildType === "Dev" ? "http://162.252.85.40:8445/api/" : "http://162.252.85.40:8445/api/";

export const apiErrorMessage = "Seems connection error. Please try again after some time or check internet connection.";

export const navigationKeys = {
  signin: "Signin",
  home: "Home",
  appDrawer: "AppDrawer",
  topTabNavigator: "TopTabNavigator",
  payments: "Payments",
  mobilepayment: "mobilepayment",
  setting: "Setting",
  stocks: "Stock Level",
  operations: "Operations",
  assets: "Assets",
  marketing: "Marketing",
  alerts: "Alerts",
  refill: "Refill",
  products: "Products",
  reoder: "Reorder",
  layout: "Layout",
  reports: "Reports",
  vendrun: "VendRun",
  reportslist: "ReportList",
  salesreport: "SalesReport",
  salesrefill: "SalesRefill",
  salesrefillreportslist: "RefillReportList",
  salesstocklevelreport: "SalesStocklevelReports",
  salesvendactive: "SalesVendActive",
  salevendactivelist: "SaleVendActiveList",
  saleproductexpiryreports: "SalesProductExpiryReports",
  venderrorfeedback: "VendErrorFeedback",
  clientfeedback: "ClientFeedback",
  mediaAd: "MediaAd",
  staff: "Staff",
  service: "Service",
  customer: "Customer",
  erecipt: "Erecipt",
  giftVend: "GiftVend",
  salesreportspayment: "SalesReportsPayments",
  salesreportspaymentlist: "SalesReportsPaymentsList",
  commonlist: "CommonList",
  productstack: "ProductStack",
};

export const machineNavigationKeys = {
  planogramlist: "PlanogramList",
  machineupsert: "MachineUpsert",
  planogram: "Planogram",
  resetplanogram: "ResetPlanogram",
  clonemachine: "CloneMachine",
  uploadplanogram: "UploadPlanogram",
  commonmahcineList: "CommonMachineList",
  updatePlanogram: "Update Planogram",
  machinestack: "Machine Stack",
  initialsetup: "Initial Setup",
};

export const machineConfigNavigationKeys = {
  machineStack: "MachineStack",
  machineSettings: "Machine Settings",
  mediaSetting: "Media Setting",
  displaySetting: "Display Setting",
  contentManagement: "Content Settings",
  vendCommunicationSetting: "Vend  Settings",
  notificationSetting: "Notification Settings",
  mahcineLogo: "Machine Logo",
  inputSettings: "Input Settings",
};

export const productNavigationKeys = {
  productdetails: "Details",
  productpricing: "Pricing",
  productmoredetails: "More Details",
  limitedaccess: "Limited Access",
  content: "Content",
  stock: "Stock",
  productImage: "Images",
  productinformation: "Information",
};

export const reoderNavigationKeys = {
  supplyorder: "Supply Oreder",
  picklist: "Pick List",
  recentorder: "Recent Order",
  pastorder: "Past Order",
  suppilers: "Suppliers",
  content: "Content",
};

export const reportsNavigationKeys = {
  topseller: "Top Selling Products",
  slowseller: "Slowest Selling Products",
  paymentsummery: "Payments Summary",
  paymentstatus: "Payments Failed/Refunds",
  toprefillingproducts: "Top Refilling Products",
  slowestrefillingproducts: "Slowest Refilling Products",
};

export const currencyDropDown = [
  { id: 1, keyName: "AUD", value: "AUD" },
  { id: 2, keyName: "USD", value: "USD" },
];

export const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,}$/;
export const nameRegExp = /^[A-Za-z0-9 _]*$/;
export const IPRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:(?:[0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})?|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

export const AVATAR_COLORS = ["232, 19, 19", "135, 144, 155", "47, 71, 27", "97, 106, 117"];

export const AVATAR_OPACITY = 1.0;

export const dateTimeMap = {
  "4h": moment().subtract(4, "hours").format("YYYY-MM-DD HH:MM"),
  t: moment().subtract(1, "days").format("YYYY-MM-DD HH:MM"),
  "1d": moment().subtract(1, "days").format("YYYY-MM-DD HH:MM"),
  "2d": moment().subtract(2, "days").format("YYYY-MM-DD HH:MM"),
  "3d": moment().subtract(3, "days").format("YYYY-MM-DD HH:MM"),
  "7d": moment().subtract(7, "days").local().format("YYYY-MM-DD HH:MM"),
  "14d": moment().subtract(14, "days").format("YYYY-MM-DD HH:MM"),
  "21d": moment().subtract(21, "days").format("YYYY-MM-DD HH:MM"),
  m: moment().subtract("months").format("YYYY-MM-DD HH:MM"),
  "3m": moment().subtract(3, "months").format("YYYY-MM-DD HH:MM"),
  "6m": moment().subtract(6, "months").format("YYYY-MM-DD HH:MM"),
  "1y": moment().subtract(1, "year").format("YYYY-MM-DD HH:MM"),
  random: moment().format("YYYY-MM-DD HH"),
  ytd: moment().startOf("year").format("YYYY-MM-DD HH:MM"),
  ttlm: moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD HH:MM"),
  ttlq: moment().subtract(1, "quarter").startOf("quarter").format("YYYY-MM-DD HH:MM"),
};

const selectClientValidation = Yup.mixed();

const onlyLettersAndSpaces = Yup.string()
  // .matches(/^[A-Za-z\s]+$/, "This field must contain only letters and spaces")
  .required("This field is required");

const onlyNumbers = Yup.number().typeError("This field must be a number").required("This field is required").positive("This field must be a positive number");

const stringOrNumber = Yup.mixed().test("is-valid-type", "Value must be a valid number or string", (value) => {
  return typeof value === "string" || typeof value === "number";
});

export const productDetailsvalidationSchema = Yup.object().shape({
  product_name: Yup.string().required("Product Name is required"),
  product_category: Yup.mixed(),
  client_id: selectClientValidation,
  product_id: Yup.string().required("Product ID is required"),
  product_description: Yup.string().required("Product Description is required"),
  product_price: Yup.number().typeError("This field must be a number").required("This field is required"),
  discount_price: Yup.number().typeError("This field must be a number"),
  product_discount_code: Yup.string(),
  bundle_price: Yup.number().typeError("This field must be a number"),
  // product_description: onlyLettersAndSpaces,
  more_info_text: Yup.string(),
  promo_text: Yup.string(),
});

export const MACHINEVALIDATIONSCHEMA = Yup.object().shape({
  machine_client_id: Yup.mixed().required("this field is required"),
  machine_is_single_category: Yup.mixed().required("Category is required"),
  machine_name: Yup.string().required("Machine name is required"),
  machine_username: Yup.mixed().required("Machine username is required"),
  machine_row: Yup.number().integer("Machine row must be an integer").typeError("Machine row must be a number").required("Machine row is required"),
  machine_column: Yup.number().integer("Machine column must be an integer").typeError("Machine column must be a number").required("Machine column is required"),
  machine_address: Yup.string().required("Machine address is required"),
  machine_latitude: Yup.number().typeError("Latitude must be a number").required("Latitude is required"),
  machine_longitude: Yup.number().typeError("Longitude must be a number").required("Longitude is required"),
});

export const PLANOGRAM_VALIDATION_SCHEMA = Yup.object().shape({
  machine_name: Yup.mixed().required("Machine name is required"),
  product_location: Yup.mixed().required("This field is required"),
  product: Yup.mixed().required("Product field is required"),
  product_quantity: Yup.mixed().required("product quantity field is required"),
  product_max_quantity: Yup.mixed().required("Capacity field is required"),
});

export const MACHINECLONESCHEMA = Yup.object().shape({
  client_id: Yup.number().required("Client selection is required"),
  machine_name: Yup.string().required("Machine name is required"),
  machine_latitude: Yup.number().typeError("Latitude must be a number").required("Latitude is required"),
  machine_longitude: Yup.number().typeError("Longitude must be a number").required("Longitude is required"),
});

export const stockListArray = [
  { text: "Row", id: 1, color: "#222222" },
  { text: "Reset", id: 7, color: "#149CBE" },
  { text: "Refill", id: 8, color: "#149CBE" },
];

// export const getDimensions = () => {
//   const height = Dimensions.get('window').height;
//   const width = Dimensions.get('window').width;
//   const screenHeight = Dimensions.get('screen').height;
//   const scaleFactor = Math.min(width, height) / 375;
//   const tabletDim = 600;
//   const isTablet = width >= tabletDim;
//   return { height, width, scaleFactor, isTablet, screenHeight };
// };

// MAKE SURE ID KEY INSIDE SHOULD BE AT LAST INDEX OF KEYARRAY
const keyArray = ["machine_id", "product_id", "employee_id", "status", "id"];
export const matchKey = (key, array = keyArray) => (array.includes(key) ? key : undefined);

export const planogramFilter = [
  { name: "Machine", keyname: "machine_name", icon: <SelectRoundBox height={20} width={20} />, id: "machine", unSelect: <UnSelectedRoundBox height={20} width={20} /> },
  { name: "Status", keyname: "status", icon: <UnSelectedRoundBox height={20} width={20} />, id: "status", unSelect: <UnSelectedRoundBox height={20} width={20} /> },
];
