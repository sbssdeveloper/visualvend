import { apiClient } from "../../Helpers/axios";
import { PAYMENT_ROUTES } from "./route";

export const paymentList = (payload) => {
  return apiClient({
    method: PAYMENT_ROUTES.PAYMENT_LIST.METHOD,
    url: PAYMENT_ROUTES.PAYMENT_LIST.URL,
    data: payload,
  });
};
