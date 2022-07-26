import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  weapons: [],
  limit: 4,

  isLoading: false,

  error: null,

  count: 0,
};
export const myWeaponsSlice = createSlice({
  name: "myWeapons",
  initialState,
  reducers: {
    getMyWeapons: (state, action) => {},
    getMyWeaponsSuccess: (state, action) => {
      const { items } = action.payload;

      const { rows, count } = items;
      state.weapons = [...rows];

      state.isLoading = false;
      state.error = null;

      state.count = count;
    },
    getMyWeaponsError: (state, action) => {
      state.error = action.payload.error;
      state.isLoading = false;
    },
  },
});

export const { getMyWeapons, getMyWeaponsSuccess, getMyWeaponsError } = myWeaponsSlice.actions;

export default myWeaponsSlice.reducer;
