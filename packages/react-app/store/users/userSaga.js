import { takeEvery, takeLatest } from "@redux-saga/core/effects";
import { getUser, getUserSuccess } from "./usersSlice";
import { take, put, call } from "redux-saga/effects";
const getUserApi = async random => {
  const url = `https://reqres.in/api/users/${random}`;
  console.log("url ", url);
  const response = await fetch(url);
  return await response.json();
};
export function* getUserSaga(action) {
  console.log("getUserSaga");
  const random = Math.floor(Math.random() * 10 + 1);

  const { data } = yield call(getUserApi, random);
  console.log("data ", data);
  const user = `${data.first_name} ${data.last_name}`;
  yield put(getUserSuccess(user));
}
export default function* userSaga() {
  yield takeLatest(getUser().type, getUserSaga);
}
