import { createSlice } from "@reduxjs/toolkit";
import { DATE_FILTERS_LIST } from "../../Helpers/resource";
import { ALL_MACHINES_CONST } from "../../Helpers/constant";

const initialState = {
  commonDateFilter: DATE_FILTERS_LIST[1],
  commonMachineIdFilter: ALL_MACHINES_CONST.id,
  customDates: null,
};

export const commonFilterSlice = createSlice({
  name: "commonFilter",
  initialState,
  reducers: {
    setCommonDateFilter: (state, action) => {
      state.commonDateFilter = action?.payload ?? null;
    },
    setCommonMachineFilter: (state, action) => {
      state.commonMachineIdFilter = action.payload ?? null;
    },
    setCustomDates: (state, action) => {
      state.customDates = action.payload ?? null;
    },
    resetDateFilter: () => initialState,
  },
});

export const { setCommonDateFilter, setCommonMachineFilter, setCustomDates, resetDateFilter } =
  commonFilterSlice.actions;
export default commonFilterSlice.reducer;
