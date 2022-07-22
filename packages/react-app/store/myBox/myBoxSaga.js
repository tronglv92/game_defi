import { takeEvery, takeLatest } from "@redux-saga/core/effects";
import { getMyBoxes } from "./myBoxSlice";
import { take, put, call } from "redux-saga/effects";

import { processCallbackAction, processAction } from "../../helpers/helperSaga";
import { getMyBoxesApi } from "./myBoxApi";

//=============REQUEST==================
const getMyBoxesRequest = action => {
  return processAction(getMyBoxesApi, action);
};

//=============SAGA==================

export function* getMyBoxesSaga(action) {
  yield call(getMyBoxesRequest, action);
}

export default function* myBoxesSaga() {
  yield takeLatest(getMyBoxes().type, getMyBoxesSaga);
}
