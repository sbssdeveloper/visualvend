import { apiClient } from "../../Helpers/axios";
import { ALL_PRODUCT_LIST_ROUTES } from "./route";

export const productList = (data) => {
  return apiClient({
    method: ALL_PRODUCT_LIST_ROUTES.ALL_PRODUCT_LIST.METHOD,
    url: ALL_PRODUCT_LIST_ROUTES.ALL_PRODUCT_LIST.URL,
    data: data,
  });
};

export const deleteProduct = (data) => {
  return apiClient({
    method: ALL_PRODUCT_LIST_ROUTES.DELETE_PRODUCT.METHOD,
    url:ALL_PRODUCT_LIST_ROUTES.DELETE_PRODUCT.URL,
    data,
  });
};

export const getProductCategoriesProduct = (data) => {
  return apiClient({
    method: ALL_PRODUCT_LIST_ROUTES.CATEGORIES_LIST.METHOD,
    url:ALL_PRODUCT_LIST_ROUTES.CATEGORIES_LIST.URL,
    data,
  });
};

export const productListDropDown = (payload) => {
  return apiClient({
    method: ALL_PRODUCT_LIST_ROUTES.ALL_PRODUCT_LIST_DROPDOWN.METHOD,
    url: ALL_PRODUCT_LIST_ROUTES.ALL_PRODUCT_LIST_DROPDOWN.URL,
    params: payload,
  });
};


export const updatePlanogram = (data) => {
  return apiClient({
    method: ALL_PRODUCT_LIST_ROUTES.UPDATE_PALANOGRAM.METHOD,
    url: ALL_PRODUCT_LIST_ROUTES.UPDATE_PALANOGRAM.URL,
     data,
  });
};





