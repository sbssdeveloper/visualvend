import { apiClient } from "../../Helpers/axios";
import { CATEGORY_API_ROUTES } from "./route";

export const addCategory = (payload) => {
    return apiClient({
      method: CATEGORY_API_ROUTES.ADD_CATEGORY.METHOD,
      url: CATEGORY_API_ROUTES.ADD_CATEGORY.URL,
      data: payload,
    });
  };
  