import { apiClient } from "../../Helpers/axios";
import { DASHBOAR_ROUTES } from "./route";

export const machineList = (payload, extraParams) => {

  return apiClient({
    method: extraParams ? DASHBOAR_ROUTES.MACHINE_LIST.METHOD : DASHBOAR_ROUTES.MACHINE_LIST.METHOD_GET,
    url: DASHBOAR_ROUTES.MACHINE_LIST.URL,
    data: payload,
  });
};

export const dashboardInfo = (payload) => {

  return apiClient({
    method: DASHBOAR_ROUTES.DASHBOARD_INFO.METHOD,
    url: DASHBOAR_ROUTES.DASHBOARD_INFO.URL,
    data: payload,
  });
};
