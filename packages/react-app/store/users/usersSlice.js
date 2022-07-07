import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUser: (state, action) => {},
    getUserSuccess: (state, action) => {
      state.users = [...state.users, action.payload];
    },
  },
});

export const { getUser, getUserSuccess } = usersSlice.actions;

export default usersSlice.reducer;
