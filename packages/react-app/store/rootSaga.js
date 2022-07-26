import { all } from "redux-saga/effects";

import userSaga from "./users/userSaga";
import weaponSaga from "./weapon/weaponSaga";
import boxSaga from "./box/boxSaga";
import myBoxesSaga from "./myBox/myBoxSaga";
import myWeaponsSaga from "./myWeapons/myWeaponsSaga";
function* helloSaga() {}
export default function* rootSaga() {
  yield all([helloSaga(), userSaga(), weaponSaga(), boxSaga(), myBoxesSaga(), myWeaponsSaga()]);
}
