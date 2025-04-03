
export const SCHEDULE_ITEM_REPORT_TABLE_COLUMNS = [
  {
    name: "Client Name",
    key: "client_name",
  },
  {
    name: "Email",
    key: "email",
  },
  {
    name: "Frequency",
    key: "frequency",
  },
];

export const SALES_COUNT_TABLE_COLUMNS = [
  {
    name: "Machine",
    key: "machine_name",
  },
  {
    name: "Product",
    key: "product_name",
  },
  {
    name: "Count",
    key: "count",
  },
];


export const SLOWEST_FASTEST_SELLING_COLUMN = [
  { text: 'Machine', key: 'machine_name' },
  { text: ' Product', key: 'product_name' },
  { text: 'Count', key: 'count' },
];



export const REPORT_TYPE_CONST = {
  MACHINE: "machine",
  EMPLOYEE: "employee",
  PRODUCT: "product",
  PICKUP: "pickup",
  RETURN: "return",
  SUMMARY: "summary",
  EMPTY_ASILE: "empty_aisles",
  LOW_STOCK_ASILE: "low_stock_aisles",
  ASILE: "aisles",
  ASILE_PART_FULL: "part_full_aisles",
  FULL_ASILE: "aisles_full",
  CATEGOREY: "category",
  EMPTY_ITEMS: "empty_items",
  LOW_STOCK_PRODUCTS: "low_stock_products",
  NO_REFILL_REQUIRED: "no_refill_required",
  DATE: "date",
  RECENT_REFILL: "recent_refills",
  RECENT_LOW_STOCK: "recent_low_stock",
  RECENT_EMPTY_STOCK: "recent_empty_stock",
  NEWLY_ADDED_STOCK: "newly_added_stock",
  MAX_QTY_CHANGED: "max_qty_changed",
  EXPIRY: "expiry",
  STATUS: "status",
  QUANTITY: "quantity",
  LOCATION: "location",
  VEND_RUN: "vend_run",
  MOTOR_ERROR: "Motor Error",
  CONTROLLER_ERROR: "Controller Error",
  NEED_SERVICE: "Need Service",
  INVALID_ASILE: "Invalid Aisle",
  PRICE_MISMATCH: "Price Mismatch",
  VEND_DROP_ERROR: "Vend Drop Error",
  PRODUCT_FAULTS: "product_faults",
  ALL_ERRORS: "all_errors",
  FEEDBACK_TYPE: "feedback_type",
  CUSTOMER: "customer",
  TIME_PAST: "time_past",
  RECENT: "recent",
  ALL_FEEDBACK_LIST: "all_feedback_list",
  TYPE: "type",
  FREQUENCY: "frequency",
  GROUP: "group",
  NO_USE: "non_use",
  BEHAVIOUR_DIFFER: "behavior_differ",
  ALL_ACTIVITIES: "all_activities",
  PAYMENT_TYPE: "payment_type",
  NAME: "name",
  PAY_TYPE: "pay_type",
  QUEUE_STATUS: "queue_status"
};

// ADDED EXTRA KEY AS (keyname)
export const REPORT_TYPE_LIST = [
  { id: REPORT_TYPE_CONST.MACHINE, name: "By machine", keyname: "machine_name", selectedId: "machine_id" },
  { id: REPORT_TYPE_CONST.EMPLOYEE, name: "By employee", keyname: "employee_name", selectedId: "employee_id" },
  { id: REPORT_TYPE_CONST.PRODUCT, name: "By product", keyname: "product_name", selectedId: "product_id" },
  { id: REPORT_TYPE_CONST.PICKUP, name: "By pickups", keyname: "pickup_or_return" },
  { id: REPORT_TYPE_CONST.RETURN, name: "By returned items", keyname: "pickup_or_return" },
];

export const SALES_TABLE_TABS_TYPE = {
  TOP: "top",
  SLOWEST: "slowest",
};
// ADDED EXTRA KEY AS (keyname)

export const REPORT_REFILL_TYPE_LIST = [
  { id: REPORT_TYPE_CONST.SUMMARY, name: "Summary" },
  { id: REPORT_TYPE_CONST.EMPTY_ASILE, name: "Empty Aisles" },
  { id: REPORT_TYPE_CONST.LOW_STOCK_ASILE, name: "Low Stock" },
  { id: REPORT_TYPE_CONST.ASILE, name: "Aisle" },
  { id: REPORT_TYPE_CONST.ASILE_PART_FULL, name: "Aisles Part Full" },
  { id: REPORT_TYPE_CONST.FULL_ASILE, name: "Aisle Full" },
  { id: REPORT_TYPE_CONST.PRODUCT, name: "By Product", keyname: "product_name", selectedId: "product_id" },
  { id: REPORT_TYPE_CONST.MACHINE, name: "By Machine", keyname: "machine_name", selectedId: "machine_id" },
  { id: REPORT_TYPE_CONST.CATEGOREY, name: "By Category", keyname: "quantity" },
];

export const REFILL_TYPE_CONST = {
  SALE: "sale",
  PLANOGRAM: "planogram",
};

export const REFILL_TYPES_List = [
  {
    name: "Vended",
    type: REFILL_TYPE_CONST.SALE,
  },
  {
    name: "Current",
    type: REFILL_TYPE_CONST.PLANOGRAM,
  },
];
// ADDED EXTRA KEY AS (keyname)

export const REPORT_STOCK_TYPE_LIST = [
  { id: REPORT_TYPE_CONST.MACHINE, name: "By machine", keyname: "machine_name", selectedId: "machine_id" },
  { id: REPORT_TYPE_CONST.EMPTY_ITEMS, name: "By Empty Items", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.EMPTY_ASILE, name: "By Empty Aisles", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.LOW_STOCK_ASILE, name: "By Low Stock Aisles", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.LOW_STOCK_PRODUCTS, name: "By Low Stock Product(S)", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.NO_REFILL_REQUIRED, name: "By No Refill Required", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.PRODUCT, name: "By Product", keyname: "product_name", selectedId: "product_id" },
  { id: REPORT_TYPE_CONST.CATEGOREY, name: "By Category", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.ASILE, name: "By Aisles", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.DATE, name: "By Date", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.RECENT_REFILL, name: "By Recent Refills", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.RECENT_LOW_STOCK, name: "By Recent Low Stock", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.RECENT_EMPTY_STOCK, name: "By Recent Empty Stock", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.NEWLY_ADDED_STOCK, name: "By Newly Added Stock", keyname: "quantity" },
  { id: REPORT_TYPE_CONST.MAX_QTY_CHANGED, name: "By Max Qty Changed", keyname: "quantity" },
];
// ADDED EXTRA KEY AS (keyname)

export const EXPIRY_PRODUCT_TYPE_LIST = [
  { id: REPORT_TYPE_CONST.MACHINE, name: "By Machine", keyname: "machine_name", selectedId: "machine_id" },
  { id: REPORT_TYPE_CONST.PRODUCT, name: "By Product", keyname: "product_name", selectedId: "product_id" },
  { id: REPORT_TYPE_CONST.EXPIRY, name: "By Expiry", keyname: "product_batch_expiray_date" },
  { id: REPORT_TYPE_CONST.STATUS, name: "By Status" },
  { id: REPORT_TYPE_CONST.QUANTITY, name: "By Quantity", keyname: "product_quantity" },
  { id: REPORT_TYPE_CONST.LOCATION, name: "By Location" },
  { id: REPORT_TYPE_CONST.VEND_RUN, name: "By Vend Run" },
  { id: REPORT_TYPE_CONST.CATEGOREY, name: "By Category" },
];
// ADDED EXTRA KEY AS (keyname)

export const REPORT_VEND_ERROR_LIST = [
  { id: REPORT_TYPE_CONST.SUMMARY, name: "Summary" },
  { id: REPORT_TYPE_CONST.MOTOR_ERROR, name: "Motor Error" },
  { id: REPORT_TYPE_CONST.CONTROLLER_ERROR, name: "Controller Error" },
  { id: REPORT_TYPE_CONST.NEED_SERVICE, name: "Need Service" },
  { id: REPORT_TYPE_CONST.INVALID_ASILE, name: "Invalid Aisle" },
  { id: REPORT_TYPE_CONST.PRICE_MISMATCH, name: "Price Mismatch" },
  { id: REPORT_TYPE_CONST.VEND_DROP_ERROR, name: "Vend Drop Error" },
  { id: REPORT_TYPE_CONST.PRODUCT_FAULTS, name: "Product Faults" },
  { id: REPORT_TYPE_CONST.ALL_ERRORS, name: "All Errors" },
  { id: REPORT_TYPE_CONST.MACHINE, name: "By Machines", keyname: "machine_name", selectedId: "machine_id" },
];
// ADDED EXTRA KEY AS (keyname)

export const REPORT_CLIENT_FEEDBACK_LIST = [
  { id: REPORT_TYPE_CONST.SUMMARY, name: "Summary", keyname: "timestamp" },
  { id: REPORT_TYPE_CONST.FEEDBACK_TYPE, name: 'Feedback Type', keyname: "complaint" },
  { id: REPORT_TYPE_CONST.PRODUCT, name: "By Product", keyname: "product_name", selectedId: "product_id" },
  { id: REPORT_TYPE_CONST.LOCATION, name: 'By Location', keyname: "location" },
  { id: REPORT_TYPE_CONST.CUSTOMER, name: 'By Customer', keyname: "customer_name" },
  { id: REPORT_TYPE_CONST.TIME_PAST, name: 'By Time Past', keyname: "timestamp" },
  { id: REPORT_TYPE_CONST.RECENT, name: 'By Most Recent', keyname: "timestamp" },
  { id: REPORT_TYPE_CONST.ALL_FEEDBACK_LIST, name: 'By Feedback List', keyname: "timestamp" },
  { id: REPORT_TYPE_CONST.MACHINE, name: "By Machines", keyname: "machine_name", selectedId: "machine_id" },
];

export const LOAD_MORE_ITEM_COUNT = [{
  uuid: "1",
  name: 50,
  value: 50,
  type: "string",
},
{
  uuid: "2",
  name: 100,
  value: 100,
  type: "string",
},
{
  uuid: "3",
  name: 200,
  value: 200,
  type: "string",
},
{
  uuid: "4",
  name: 500,
  value: 500,
  type: "string",
},
{
  uuid: "5",
  name: 750,
  value: 750,
  type: "string",
},
{
  uuid: "6",
  name: 1000,
  value: 1000,
  type: "string",
},
]

export const REPORT_Media_AD_LIST = [
  { id: REPORT_TYPE_CONST.TYPE, name: "By type" },
  { id: REPORT_TYPE_CONST.FREQUENCY, name: 'By frequency' },
];
// ADDED EXTRA KEY AS (keyname)

export const REPORT_STAFF_LIST = [
  { id: REPORT_TYPE_CONST.MACHINE, name: "By Machine", keyname: "machine_name", selectedId: "machine_id" },
  { id: REPORT_TYPE_CONST.ALL_ACTIVITIES, name: "All Activities", keyname: "timestamp" },
  { id: REPORT_TYPE_CONST.EMPLOYEE, name: "By Employee", keyname: "employee_name", selectedId: "employee_id" },
  { id: REPORT_TYPE_CONST.GROUP, name: "By Group", keyname: "timestamp" },
  { id: REPORT_TYPE_CONST.PRODUCT, name: "By Product", keyname: "product_name", selectedId: "product_id" },
  { id: REPORT_TYPE_CONST.RECENT, name: 'Most Recent', keyname: "timestamp" },
  { id: REPORT_TYPE_CONST.DATE, name: 'By Date/Time', keyname: "timestamp" },
  { id: REPORT_TYPE_CONST.LOCATION, name: 'By Location', keyname: "timestamp" },
  { id: REPORT_TYPE_CONST.NO_USE, name: 'By Non Use', keyname: "timestamp" },
  { id: REPORT_TYPE_CONST.BEHAVIOUR_DIFFER, name: 'Behavior Differ', keyname: "timestamp" },
];

// ADDED EXTRA KEY AS (keyname)

export const COMMON_REPORT_LIST = [
  { id: REPORT_TYPE_CONST.MACHINE, name: "By machine", keyname: "machine_name", selectedId: "machine_id" },
  { id: REPORT_TYPE_CONST.PRODUCT, name: "By product", keyname: "product_name", selectedId: "product_id" }
];
// ADDED EXTRA KEY AS (keyname)

export const PRODUCT_REPORT_TYPE_LIST = [
  ...COMMON_REPORT_LIST,
  { id: REPORT_TYPE_CONST.PAYMENT_TYPE, name: "By payment type", keyname: "created_at" }
]

export const PAYMENTS_COUNT_TABLE_COLUMNS = [
  {
    name: "Payment Type",
    key: "pay_method",
  },
  {
    name: "Value($)",
    key: "ok_amount",
  },
  {
    name: "Ok(%)",
    key: "ok_qty",
  },
  {
    name: "Qty",
    key: "total_qty",
  },
  {
    name: "Rate",
    key: "rate",
  },
  {
    name: "Fail($)",
    key: "failed_amount",
  },
  {
    name: "Fail(%)",
    key: "failed_qty",
  },
  {
    name: "Fees",
    key: "fees",
  },
  {
    name: "Total",
    key: "total_amount",
  },
];

export const modalInitialValues = {
  id: 'machine',
  name: 'By machine',
  selectedId: "machine_id"
}