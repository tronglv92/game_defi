import { takeEvery, takeLatest } from "@redux-saga/core/effects";
import {

  getAllBoxes,
  getBoxById,

} from "./boxSlice";
import { take, put, call } from "redux-saga/effects";

import { processCallbackAction, processAction } from "../../helpers/helperSaga";
import { createBoxApi, editBoxApi, getAllBoxApi, getBoxByIdApi } from "./boxApi";
//=============REQUEST==================

const getAllBoxesRequest = action => {
  return processAction(getAllBoxApi, action);
};
const getBoxByIdRequest = action => {
  return processCallbackAction(getBoxByIdApi, action);
};

//=============SAGA==================
export function* getAllBoxesSaga(action) {
  yield call(getAllBoxesRequest, action);
}

export function* getBoxByIdSaga(action) {
  yield call(getBoxByIdRequest, action);
}

export default function* boxSaga() {
  yield takeLatest(getAllBoxes().type, getAllBoxesSaga);
  yield takeLatest(getBoxById().type, getBoxByIdSaga);
}
