import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  weapons: [],
  limit: 2,
  page: 1,
  isLoading: false,
  isRefreshing: false,
  error: null,
  outOfStock: false,
  count: 0,
};
export const weaponSlice = createSlice({
  name: "weapon",
  initialState,
  reducers: {
    createWeapon: (state, action) => {},
    createWeaponSuccess: (state, action) => {},
    createWeaponError: (state, action) => {},

    getWeapons: (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.outOfStock = false;
    },
    getWeaponsSuccess: (state, action) => {
      const { items, page } = action.payload;

      const { rows, count } = items;
      state.weapons = rows;

      state.isLoading = false;
      state.error = null;
      state.page = page;
      state.count = count;
    },
    getWeaponsError: (state, action) => {
      state.error = action.payload.error;
      state.isLoading = false;
    },

    getWeaponById: (state, action) => {},
    editWeapon: (state, action) => {},
  },
});

export const {
  createWeapon,
  createWeaponSuccess,
  createWeaponError,
  getWeapons,
  getWeaponsSuccess,
  getWeaponsError,
  getWeaponById,
  editWeapon,
} = weaponSlice.actions;

export default weaponSlice.reducer;
