import { apiClient } from "../../Helpers/axios";
import { STOCK_API_ROUTES } from "./route";

export const stockList = (payload) => {
  return apiClient({
    method: STOCK_API_ROUTES.STOCK_LIST.METHOD,
    url: STOCK_API_ROUTES.STOCK_LIST.URL,
    data: payload,
  });
};


export const resetStock = (payload) => {
  return apiClient({
    method: STOCK_API_ROUTES.RESET_STOCK.METHOD,
    url: STOCK_API_ROUTES.RESET_STOCK.URL,
    data: payload,
  });
};

export const refillStock = (payload) => {
  return apiClient({
    method: STOCK_API_ROUTES.REFILL_STOCK.METHOD,
    url: STOCK_API_ROUTES.REFILL_STOCK.URL,
    data: payload,
  });
};

export const machineProductList = (payload) => {
  return apiClient({
    method: STOCK_API_ROUTES.MACHINE_PRODUCTS_LIST.METHOD,
    url: STOCK_API_ROUTES.MACHINE_PRODUCTS_LIST.URL,
    data: payload,
  });
};

