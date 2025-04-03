import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  _client_id: null,
  roleBaseDetails: null

};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action?.payload ?? null;
    },
    reset: () => initialState,
    setToken: (state, action) => {
      state.token = action.payload
    },
    setClient: (state, action) => {
      state._client_id = action.payload
    },
    setRoleBaseDetails: (state, action) => {
      state.roleBaseDetails = action.payload
    }
  },
});

export const { setUser, reset, setToken, setClient, setRoleBaseDetails } = authSlice.actions;
export default authSlice.reducer;
