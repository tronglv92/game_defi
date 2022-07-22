import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boxes: [],
  limit: 4,

  isLoading: false,

  error: null,

  count: 0,
};
export const boxSlice = createSlice({
  name: "myBox",
  initialState,
  reducers: {
    getMyBoxes: (state, action) => {},
    getMyBoxesSuccess: (state, action) => {
      const { items } = action.payload;

      const { rows, count } = items;
      state.boxes = [...rows];

      state.isLoading = false;
      state.error = null;

      state.count = count;
    },
    getMyBoxesError: (state, action) => {
      state.error = action.payload.error;
      state.isLoading = false;
    },
  },
});

export const { getMyBoxes, getMyBoxesSuccess, getMyBoxesError } = boxSlice.actions;

export default boxSlice.reducer;
