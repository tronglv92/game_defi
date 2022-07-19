import { takeEvery, takeLatest } from "@redux-saga/core/effects";
import { createWeapon, getWeapons, getWeaponById, editWeapon } from "./weaponSlice";
import { take, put, call } from "redux-saga/effects";
import { getWeaponByIdApi, getWeaponsApi } from "./weaponApi";

import { processCallbackAction, processAction } from "../../helpers/helperSaga";
//=============REQUEST==================

const getWeaponsRequest = action => {
  return processAction(getWeaponsApi, action);
};
const getWeaponByIdRequest = action => {
  return processCallbackAction(getWeaponByIdApi, action);
};

//=============SAGA==================
export function* getWeaponsSaga(action) {
  console.log("getUserSaga action ", action);
  yield call(getWeaponsRequest, action);
}

export function* getWeaponByIdSaga(action) {
  yield call(getWeaponByIdRequest, action);
}
export function* editWeaponSaga(action) {
  yield call(editWeaponRequest, action);
}
export default function* weaponSaga() {
  yield takeEvery(getWeapons().type, getWeaponsSaga);
  yield takeLatest(getWeaponById().type, getWeaponByIdSaga);
}
