import { apiClient } from "../../Helpers/axios";
import {  VEND_RUN_API_ROUTES } from "./route";

export const getVendRunReport = (payload) => {
  return apiClient({
    method: VEND_RUN_API_ROUTES.SALES_REPORT.METHOD,
    url: VEND_RUN_API_ROUTES.SALES_REPORT.URL,
    data: payload,
  });
}