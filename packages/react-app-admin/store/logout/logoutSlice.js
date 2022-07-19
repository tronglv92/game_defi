import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logout: false,
};
export const logoutSlice = createSlice({
  name: "logout",
  initialState,
  reducers: {
    setLogout: (state, action) => {
      state.logout = action.payload;
    },
  },
});

export const { setLogout } = logoutSlice.actions;

export default logoutSlice.reducer;
