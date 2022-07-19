import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  weapons: [],
  limit: 4,

  isLoading: false,

  error: null,

  count: 0,
};
export const weaponSlice = createSlice({
  name: "weapon",
  initialState,
  reducers: {
    getWeapons: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    getWeaponsSuccess: (state, action) => {
      const { items, page } = action.payload;

      const { rows, count } = items;
      state.weapons = rows;

      state.isLoading = false;
      state.error = null;

      state.count = count;
    },
    getWeaponsError: (state, action) => {
      state.error = action.payload.error;
      state.isLoading = false;
    },

    getWeaponById: (state, action) => {},
  },
});

export const { getWeapons, getWeaponsSuccess, getWeaponsError, getWeaponById } = weaponSlice.actions;

export default weaponSlice.reducer;
