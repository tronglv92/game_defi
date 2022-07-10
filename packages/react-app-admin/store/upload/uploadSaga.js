import { takeEvery, takeLatest } from "@redux-saga/core/effects";
import { uploadMultiple, uploadMultipleSuccess, uploadMultipleError } from "./uploadSlice";
import { take, put, call } from "redux-saga/effects";
import { uploadMultipleApi } from "./uploadApi";

export function* uploadMultipleSaga(action) {
  console.log("uploadMultipleSaga action ", action);
  const { imgs, onSuccess, onError } = action.payload;

  const variables = { imgs };
  const result = yield call(uploadMultipleApi, variables);
  console.log("uploadMultipleSaga result ", result);
  if (result.success == true) {
    if (onSuccess) onSuccess(result.data);
  } else {
    if (onError) onError(result.message);
  }
}
export default function* uploadSaga() {
  yield takeEvery(uploadMultiple().type, uploadMultipleSaga);
}
