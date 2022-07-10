import { takeEvery, takeLatest } from "@redux-saga/core/effects";
import { createWeapon, createWeaponSuccess, createWeaponError } from "./weaponSlice";
import { take, put, call } from "redux-saga/effects";
import { createWeaponApi } from "./weaponApi";

export function* createWeaponSaga(action) {
  console.log("getUserSaga action ", action);
  const { weapon, onSuccess, onError } = action.payload;

  const result = yield call(createWeaponApi, weapon);
  console.log("createWeaponSaga result ", result);
  if (result.success == true) {
    if (onSuccess) onSuccess(result.data);
  } else {
    if (onError) onError(result.message);
  }
}
export default function* weaponSaga() {
  yield takeLatest(createWeapon().type, createWeaponSaga);
}
