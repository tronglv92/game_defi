import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boxes: [],
  limit: 2,
  page: 1,
  isLoading: false,

  error: null,

  count: 0,
};
export const boxSlice = createSlice({
  name: "box",
  initialState,
  reducers: {
    createBox: (state, action) => {},

    getAllBoxes: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    getAllBoxesSuccess: (state, action) => {
      const { items, page } = action.payload;

      const { rows, count } = items;
      state.boxes = rows;

      state.isLoading = false;
      state.error = null;
      state.page = page;
      state.count = count;
    },
    getAllBoxesError: (state, action) => {
      state.error = action.payload.error;
      state.isLoading = false;
    },

    getBoxById: (state, action) => {},
    editBox: (state, action) => {},
  },
});

export const {
  createBox,

  getAllBoxes,
  getAllBoxesSuccess,
  getAllBoxesError,
  getBoxById,
  editBox,
} = boxSlice.actions;

export default boxSlice.reducer;
