import { takeEvery, takeLatest } from "@redux-saga/core/effects";
import { createWeapon, getWeapons, getWeaponById, editWeapon } from "./weaponSlice";
import { take, put, call } from "redux-saga/effects";
import { createWeaponApi, editWeaponApi, getWeaponByIdApi, getWeaponsApi } from "./weaponApi";
import { setLogout } from "../logout/logoutSlice";
import { processCallbackAction, processAction } from "../../helpers/helperSaga";
//=============REQUEST==================
const createWeaponRequest = action => {
  return processCallbackAction(createWeaponApi, action);
};
const getWeaponsRequest = action => {
  return processAction(getWeaponsApi, action);
};
const getWeaponByIdRequest = action => {
  return processCallbackAction(getWeaponByIdApi, action);
};
const editWeaponRequest = action => {
  return processCallbackAction(editWeaponApi, action);
};
//=============SAGA==================
export function* getWeaponsSaga(action) {
  console.log("getUserSaga action ", action);
  yield call(getWeaponsRequest, action);
}
export function* createWeaponSaga(action) {
  yield call(createWeaponRequest, action);
}
export function* getWeaponByIdSaga(action) {
  yield call(getWeaponByIdRequest, action);
}
export function* editWeaponSaga(action) {
  yield call(editWeaponRequest, action);
}
export default function* weaponSaga() {
  yield takeLatest(createWeapon().type, createWeaponSaga);
  yield takeLatest(getWeapons().type, getWeaponsSaga);
  yield takeLatest(getWeaponById().type, getWeaponByIdSaga);
  yield takeLatest(editWeapon().type, editWeaponSaga);
}
