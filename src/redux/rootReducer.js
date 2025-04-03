import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import commonFilterSlice from './slices/common-filter-slice';

const rootReducer = combineReducers({
  auth: authSlice,
  commonFilter: commonFilterSlice,
});

export default rootReducer;
