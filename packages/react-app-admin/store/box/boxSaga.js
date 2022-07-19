import { takeEvery, takeLatest } from "@redux-saga/core/effects";
import {
  createWeapon,
  getWeapons,
  getWeaponById,
  editWeapon,
  createBox,
  getAllBoxes,
  getBoxById,
  editBox,
} from "./boxSlice";
import { take, put, call } from "redux-saga/effects";

import { processCallbackAction, processAction } from "../../helpers/helperSaga";
import { createBoxApi, editBoxApi, getAllBoxApi, getBoxByIdApi } from "./boxApi";
//=============REQUEST==================
const createBoxRequest = action => {
  return processCallbackAction(createBoxApi, action);
};
const getAllBoxesRequest = action => {
  return processAction(getAllBoxApi, action);
};
const getBoxByIdRequest = action => {
  return processCallbackAction(getBoxByIdApi, action);
};
const editBoxRequest = action => {
  return processCallbackAction(editBoxApi, action);
};
//=============SAGA==================
export function* getAllBoxesSaga(action) {
  yield call(getAllBoxesRequest, action);
}
export function* createBoxSaga(action) {
  yield call(createBoxRequest, action);
}
export function* getBoxByIdSaga(action) {
  yield call(getBoxByIdRequest, action);
}
export function* editBoxSaga(action) {
  yield call(editBoxRequest, action);
}
export default function* boxSaga() {
  yield takeLatest(createBox().type, createBoxSaga);
  yield takeLatest(getAllBoxes().type, getAllBoxesSaga);
  yield takeLatest(getBoxById().type, getBoxByIdSaga);
  yield takeLatest(editBox().type, editBoxSaga);
}
