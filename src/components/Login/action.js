import { apiClient } from "../../Helpers/axios";
import { AUTH_ROUTES } from "./route";

export const login = (payload) => {

  return apiClient({
    method: AUTH_ROUTES.LOGIN.METHOD,
    url: AUTH_ROUTES.LOGIN.URL,
    data: payload,
  });
};
