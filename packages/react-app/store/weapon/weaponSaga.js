import { takeEvery, takeLatest } from "@redux-saga/core/effects";
import {
  createWeapon,
  getWeapons,
  getWeaponById,
  editWeapon,
  getSignatureMintWeapon,
  updateMintWeapon,
} from "./weaponSlice";
import { take, put, call } from "redux-saga/effects";
import { getWeaponByIdApi, getWeaponsApi, getSignatureMintApi, updateMintWeaponApi } from "./weaponApi";

import { processCallbackAction, processAction } from "../../helpers/helperSaga";
//=============REQUEST==================

const getWeaponsRequest = action => {
  return processAction(getWeaponsApi, action);
};
const getWeaponByIdRequest = action => {
  return processCallbackAction(getWeaponByIdApi, action);
};
const getSignatureMintWeaponRequest = action => {
  return processCallbackAction(getSignatureMintApi, action);
};
const updateMintWeaponRequest = action => {
  return processCallbackAction(updateMintWeaponApi, action);
};
//=============SAGA==================
export function* getWeaponsSaga(action) {
  console.log("getUserSaga action ", action);
  yield call(getWeaponsRequest, action);
}

export function* getWeaponByIdSaga(action) {
  yield call(getWeaponByIdRequest, action);
}
export function* getSignatureMintWeaponSaga(action) {
  yield call(getSignatureMintWeaponRequest, action);
}
export function* updateMintWeaponSaga(action) {
  yield call(updateMintWeaponRequest, action);
}
export default function* weaponSaga() {
  yield takeEvery(getWeapons().type, getWeaponsSaga);
  yield takeLatest(getWeaponById().type, getWeaponByIdSaga);
  yield takeLatest(getSignatureMintWeapon().type, getSignatureMintWeaponSaga);
  yield takeLatest(updateMintWeapon().type, updateMintWeaponSaga);
}
