import axios from "axios";

import { API_BASE_URL, getEnvironment } from "./constant";

const { PLATFORM } = getEnvironment();
console.log("PLATFORM", PLATFORM)

let getToken = null;

if (PLATFORM === "WEB") {
  getToken = require("./web").getToken
} else {
  getToken = require("../Helpers/native/index").getToken;
}


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getToken();
    if (accessToken) {
      config.headers["X-Auth-Token"] = `${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error.response);
    return error?.response;
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      if (PLATFORM !== "NATIVE") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      } else {
      }
    }
    return Promise.reject(error.response);
    return error?.response;
  }
);


