import { takeEvery, takeLatest } from "@redux-saga/core/effects";
import { getAllBoxes, getBoxById, getSignatureWhenBuyBox, updateNFT } from "./boxSlice";
import { take, put, call } from "redux-saga/effects";

import { processCallbackAction, processAction } from "../../helpers/helperSaga";
import { getAllBoxApi, getBoxByIdApi, getSignatureWhenBuyBoxApi, updateNFTApi } from "./boxApi";

//=============REQUEST==================

const getAllBoxesRequest = action => {
  return processAction(getAllBoxApi, action);
};
const getBoxByIdRequest = action => {
  return processCallbackAction(getBoxByIdApi, action);
};
const getSignatureWhenBuyBoxRequest = action => {
  return processCallbackAction(getSignatureWhenBuyBoxApi, action);
};
const updateNFTRequest = action => {
  return processCallbackAction(updateNFTApi, action);
};
//=============SAGA==================

export function* getAllBoxesSaga(action) {
  yield call(getAllBoxesRequest, action);
}

export function* getBoxByIdSaga(action) {
  yield call(getBoxByIdRequest, action);
}
export function* getSignatureWhenBuyBoxSaga(action) {
  yield call(getSignatureWhenBuyBoxRequest, action);
}
export function* updateNFTSaga(action) {
  yield call(updateNFTRequest, action);
}
export default function* boxSaga() {
  yield takeLatest(getAllBoxes().type, getAllBoxesSaga);
  yield takeLatest(getBoxById().type, getBoxByIdSaga);
  yield takeLatest(getSignatureWhenBuyBox().type, getSignatureWhenBuyBoxSaga);
  yield takeLatest(updateNFT().type, updateNFTSaga);
}
