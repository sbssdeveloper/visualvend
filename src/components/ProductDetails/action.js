import axios from "axios";
import { apiClient } from "../../Helpers/axios";
import { createFormData } from "./consts";
import { PRODUCT_API_ROUTES } from "./route";

export const addProduct = (payload) => {
  // const data = createFormData(payload);
  return apiClient({
    // headers: { 'Content-Type': 'multipart/form-data' },
    method: PRODUCT_API_ROUTES.ADD_PRODUCT.METHOD,
    url: PRODUCT_API_ROUTES.ADD_PRODUCT.URL,
    data: payload,
  });
};

export const updateProduct = (payload) => {
  return apiClient({
    method: PRODUCT_API_ROUTES.UPDATE_PRODUCT.METHOD,
    url: PRODUCT_API_ROUTES.UPDATE_PRODUCT.URL,
    data: payload,
  });
};

export const productCategoreyList = (payload) => {
  return apiClient({
    method: PRODUCT_API_ROUTES.PRODUCT_CATEGOREY_LIST.METHOD,
    url: PRODUCT_API_ROUTES.PRODUCT_CATEGOREY_LIST.URL + `?cid=${payload.cid}`,
    data: payload,
  });
};

export const getClientList = (payload) => {
  return apiClient({
    method: PRODUCT_API_ROUTES.CLIENT_LIST.METHOD,
    url: PRODUCT_API_ROUTES.CLIENT_LIST.URL,
    data: payload,
  });
};

export const updateProductImage = (payload) => {
  const data = createFormData(payload);
  return apiClient({
    headers: { 'Content-Type': 'multipart/form-data' },
    method: PRODUCT_API_ROUTES.PRODUCT_IMAGE_UPDATE.METHOD,
    url: PRODUCT_API_ROUTES.PRODUCT_IMAGE_UPDATE.URL,
    data: data,
  });
};

export const getProductById = (payload) => {
  return apiClient({
    method: PRODUCT_API_ROUTES.PRODUCT_INFO_BY_ID.METHOD,
    url: PRODUCT_API_ROUTES.PRODUCT_INFO_BY_ID.URL,
    data: payload,
  });
};

export const getBucketUrl = (payload) => {
  return apiClient({
    method: PRODUCT_API_ROUTES.GETBUKET_URL.METHOD,
    url: PRODUCT_API_ROUTES.GETBUKET_URL.URL,
    data: payload,
  });
}

export const getBucketUri = (payload) => {
  return apiClient({
    method: PRODUCT_API_ROUTES.GETBUKET_URI.METHOD,
    url: PRODUCT_API_ROUTES.GETBUKET_URI.URL,
    data: payload,
  });
}

export const uploadImageToBucket = (uri, payload) => {
  return apiClient({
    method: "PUT",
    url: PRODUCT_API_ROUTES.GETBUKET_URL.URL,
    data: payload,
  });
}


export const uploadFile = async (payload) => {

  const { uri, file } = payload
  try {
    const uploadResponse = await axios.put(uri, file, {
      headers: { 'Content-Type': 'application/octet-stream',},
    });
    if (uploadResponse?.status === 200) return true
    else return false;
  } catch (error) {
    return false

  }
}

