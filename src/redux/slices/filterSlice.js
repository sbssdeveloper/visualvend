import { createSlice } from '@reduxjs/toolkit';

import moment from 'moment';


const initialState = {

    commonDateFilter: moment().subtract(1, "days").local().format("YYYY-MM-DD HH:MM"),
    commonEndDate: moment().local().format("YYYY-MM-DD HH:MM"),
    commonShowingDate: "Today",
    commonMachineIdFilter: "",
    commonMachineName: "All Machine",
    customDates: null,
};

export const filterSlice = createSlice({
    name: 'commonFilter',
    initialState,
    reducers: {
        setCommonDateFilter: (state, action) => {
            const { dateKey, showingDateKey, dateValue, endDateKey, showDateValue, endDateValue } = action.payload;
            state[dateKey] = dateValue;
            state[showingDateKey] = showDateValue;
            state[endDateKey] = endDateValue;
        },

        setCommonMachineFilter: (state, action) => {
            const { idKey, nameKey, idValue, nameValue } = action.payload;
            state[nameKey] = nameValue;
            state[idKey] = idValue;
        },

        setCustomDates: (state, action) => {
            state.customDates = action.payload ?? null;
        },


    },
});

export const { setCommonDateFilter, setCommonMachineFilter, setCustomDates, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;