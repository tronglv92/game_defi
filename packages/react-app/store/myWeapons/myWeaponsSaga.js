import { takeEvery, takeLatest } from "@redux-saga/core/effects";

import { take, put, call } from "redux-saga/effects";

import { processCallbackAction, processAction } from "../../helpers/helperSaga";

import { getMyWeapons } from "./myWeaponsSlice";
import { getMyWeaponsApi } from "./myWeaponsApi";

//=============REQUEST==================
const getMyWeaponsRequest = action => {
  return processAction(getMyWeaponsApi, action);
};

//=============SAGA==================

export function* getMyWeaponsSaga(action) {
  yield call(getMyWeaponsRequest, action);
}

export default function* myWeaponsSaga() {
  yield takeLatest(getMyWeapons().type, getMyWeaponsSaga);
}
