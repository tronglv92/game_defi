import { all } from "redux-saga/effects";

import userSaga from "./users/userSaga";
function* helloSaga() {}
export default function* rootSaga() {
  yield all([helloSaga(), userSaga()]);
}
