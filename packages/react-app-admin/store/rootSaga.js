import { all } from "redux-saga/effects";

import userSaga from "./users/userSaga";
import weaponSaga from "./weapon/weaponSaga";
import uploadSaga from "./upload/uploadSaga";
import boxSaga from "./box/boxSaga";
function* helloSaga() {}
export default function* rootSaga() {
  yield all([helloSaga(), userSaga(), weaponSaga(), uploadSaga(), boxSaga()]);
}
