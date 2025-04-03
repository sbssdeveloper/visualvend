import { apiClient } from "../../Helpers/axios";
import { PAYMENT_ACTIVITY_ROUTES } from "./route";

export const paymentActivities = (payload) => {
  return apiClient({
    method: PAYMENT_ACTIVITY_ROUTES.PAYMENT_ACTIVITIES.METHOD,
    url: PAYMENT_ACTIVITY_ROUTES.PAYMENT_ACTIVITIES.URL,
    data: payload,
  });
};
