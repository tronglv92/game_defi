import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};
export const weaponSlice = createSlice({
  name: "weapon",
  initialState,
  reducers: {
    createWeapon: (state, action) => {},
    createWeaponSuccess: (state, action) => {
      state.users = [...state.users, action.payload];
    },
    createWeaponError: (state, action) => {},
  },
});

export const { createWeapon, createWeaponSuccess, createWeaponError } = weaponSlice.actions;

export default weaponSlice.reducer;
