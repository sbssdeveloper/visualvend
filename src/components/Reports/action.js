import { apiClient } from "../../Helpers/axios";
import { REPORT_API_ROUTES } from "./route";

export const getSalesReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.SALES_REPORT.METHOD,
    url: REPORT_API_ROUTES.SALES_REPORT.URL,
    data: payload,
  });
}

export const getRefillReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.REFILL_REPORT.METHOD,
    url: REPORT_API_ROUTES.REFILL_REPORT.URL,
    data: payload,
  });
}

export const getStockReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.STOCK_REPORT.METHOD,
    url: REPORT_API_ROUTES.STOCK_REPORT.URL,
    data: payload,
  });
}
export const getVendActivityReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.VEND_ACTIVITY_REPORT.METHOD,
    url: REPORT_API_ROUTES.VEND_ACTIVITY_REPORT.URL,
    data: payload,
  });
}
export const getExpiryProductReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.EXPIRY_PRODUCT_REPORT.METHOD,
    url: REPORT_API_ROUTES.EXPIRY_PRODUCT_REPORT.URL,
    data: payload,
  });
}

export const getVendErrorReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.MACHINE_STATUS_REPORT.METHOD,
    url: REPORT_API_ROUTES.MACHINE_STATUS_REPORT.URL,
    data: payload,
  });
}

export const getClientFeedbackReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.CLIENT_FEEDBACK_REPORT.METHOD,
    url: REPORT_API_ROUTES.CLIENT_FEEDBACK_REPORT.URL,
    data: payload,
  });
}

export const getMediaAdReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.MEDIA_AD_REPORT.METHOD,
    url: REPORT_API_ROUTES.MEDIA_AD_REPORT.URL,
    data: payload,
  });
}

export const getStaffReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.STAFF_REPORT.METHOD,
    url: REPORT_API_ROUTES.STAFF_REPORT.URL,
    data: payload,
  });
}

export const getServiceReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.SERVICE_REPORT.METHOD,
    url: REPORT_API_ROUTES.SERVICE_REPORT.URL,
    data: payload,
  });
}

export const getCustomarReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.CUSTOMER_REPORT.METHOD,
    url: REPORT_API_ROUTES.CUSTOMER_REPORT.URL,
    data: payload,
  });
}

export const getGiftReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.GIFT_REPORT.METHOD,
    url: REPORT_API_ROUTES.GIFT_REPORT.URL,
    data: payload,
  });
}

export const getPaymentReport = (payload) => {
  return apiClient({
    method: REPORT_API_ROUTES.PAYMENT_REPORT.METHOD,
    url: REPORT_API_ROUTES.PAYMENT_REPORT.URL,
    data: payload,
  });
}


//ADDITIONALLY ADDED METHOD  (MOBILE ONLY) //



export const getMobileSalesReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.SALES_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES?.SALES_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES?.SALES_REPORT_MOBILE.URL,
    data: payload,
  });
}


export const getMobileRefillReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.REFILL_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES.REFILL_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES?.REFILL_REPORT_MOBILE.URL,
    data: payload,
  });
}

export const getMobileStockReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.STOCK_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES?.STOCK_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES?.STOCK_REPORT_MOBILE.URL,
    data: payload,
  });
}

export const getMobileVendActivityReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.VEND_ACTIVITY_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES?.VEND_ACTIVITY_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES?.VEND_ACTIVITY_REPORT_MOBILE.URL,
    data: payload,
  });
}

export const getMobileExpiryProductReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.EXPIRY_PRODUCT_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES?.EXPIRY_PRODUCT_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES?.EXPIRY_PRODUCT_REPORT_MOBILE.URL,
    data: payload,
  });
}

export const getMobileVendErrorReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.MACHINE_STATUS_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES?.MACHINE_STATUS_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES?.MACHINE_STATUS_REPORT_MOBILE.URL,
    data: payload,
  });
}

export const getMobileClientFeedbackReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.CLIENT_FEEDBACK_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES.CLIENT_FEEDBACK_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES.CLIENT_FEEDBACK_REPORT_MOBILE.URL,
    data: payload,
  });
}

export const getMobileMediaAdReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.MEDIA_AD_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES?.MEDIA_AD_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES?.MEDIA_AD_REPORT_MOBILE.URL,
    data: payload,
  });
}

export const getMobileStaffReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.STAFF_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES?.STAFF_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES.STAFF_REPORT_MOBILE.URL,
    data: payload,
  });
}

export const getMobileServiceReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.SERVICE_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES?.SERVICE_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES?.SERVICE_REPORT_MOBILE.URL,
    data: payload,
  });
}

export const getMobileCustomerReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.CUSTOMER_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES.CUSTOMER_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES.CUSTOMER_REPORT_MOBILE.URL,
    data: payload,
  });
}

export const getMobileGiftReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.GIFT_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES.GIFT_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES.GIFT_REPORT_MOBILE.URL,
    data: payload,
  });
}

export const getMobilePaymentReport = (payload, fetchForInnerList) => {
  return apiClient({
    method: REPORT_API_ROUTES.PAYMENT_REPORT.METHOD,
    url: fetchForInnerList ? REPORT_API_ROUTES?.PAYMENT_REPORT_DATA_MOBILE.URL : REPORT_API_ROUTES.PAYMENT_REPORT_MOBILE.URL,
    data: payload,
  });
}




