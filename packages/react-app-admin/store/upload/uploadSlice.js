import { createSlice } from "@reduxjs/toolkit";

const initialState = {};
export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    uploadSingle: (state, action) => {},

    uploadMultiple: (state, action) => {
      console.log("action uploadMultiple");
    },
  },
});

export const { uploadMultiple, uploadMultipleSuccess, uploadMultipleError } = uploadSlice.actions;

export default uploadSlice.reducer;
