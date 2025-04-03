import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 updateProductData: null,
 operationType: null,
 productClient: null
};

export const productSlice = createSlice({
 name: 'Productslice',
 initialState,
 reducers: {
  setProudctData: (state, action) => {
   state.updateProductData = action?.payload ?? null;
  },

  setOperationType: (state, action) => {
   state.operationType = action?.payload ?? null;
  },

  selectedClientName: (state, action) => {
   state.productClient = action?.payload ?? null;

  }
 },


});

export const { setProudctData, setOperationType, selectedClientName } = productSlice.actions;
export default productSlice.reducer;
