import { takeEvery, takeLatest } from "@redux-saga/core/effects";
import { uploadMultiple, uploadMultipleSuccess, uploadMultipleError } from "./uploadSlice";
import { take, put, call } from "redux-saga/effects";
import { uploadMultipleApi } from "./uploadApi";
import { processCallbackAction } from "../../helpers/helperSaga";
const uploadMultipleRequest = action => {
  return processCallbackAction(uploadMultipleApi, action);
};
export function* uploadMultipleSaga(action) {
  console.log("uploadMultipleSaga action ", action);
  const { params, onSuccess, onError } = action.payload;
  const { imgs } = params;
  if (imgs.length > 0) {
    yield call(uploadMultipleRequest, action);
  } else {
    if (onSuccess)
      onSuccess({
        images: [],
      });
  }
}

export default function* uploadSaga() {
  yield takeEvery(uploadMultiple().type, uploadMultipleSaga);
}
