import { call, put } from "redux-saga/effects";


export const createSuccessActionType = type => `${type}Success`;
export const createFailureActionType = type => `${type}Error`;

// function* sendRequestWithRefreshToken(options, params) {
//   let canSendRequest = true;
//   if (options.isAuth) {
//     const accessToken = getStringData(storageKeys.ACCESS_TOKEN);
//     const refreshToken = getStringData(storageKeys.REFRESH_TOKEN);
//     if (accessToken && refreshToken) {
//       const jwtData = jwtDecode(getStringData(storageKeys.ACCESS_TOKEN));
//       const accessTokenExpiredTime = (jwtData?.exp || 0) * 1000;
//       if (accessTokenExpiredTime < new Date().getTime()) {
//         const refreshResponse = yield call(sendRequest, apiConfig.account.refreshToken, {
//           access_token: accessToken,
//           refresh_token: refreshToken,
//         });

//         if (
//           refreshResponse?.success &&
//           refreshResponse?.responseData?.data?.access_token &&
//           refreshResponse?.responseData?.data?.refresh_token
//         ) {
//           setStringData(storageKeys.ACCESS_TOKEN, refreshResponse?.responseData?.data?.access_token);
//           setStringData(storageKeys.REFRESH_TOKEN, refreshResponse?.responseData?.data?.refresh_token);
//         } else {
//           canSendRequest = false;
//         }
//       }
//     } else {
//       canSendRequest = false;
//     }
//   }

//   if (canSendRequest) {
//     const response = yield call(sendRequest, options, params);
//     if (response?.isLogout) {
//       removeItem(storageKeys.ACCESS_TOKEN);
//       removeItem(storageKeys.REFRESH_TOKEN);
//       yield put(accountActions.setStorageProfile(null));
//       return null;
//     }
//     return response;
//   } else {
//     removeItem(storageKeys.ACCESS_TOKEN);
//     removeItem(storageKeys.REFRESH_TOKEN);
//     yield put(accountActions.setStorageProfile(null));
//     return null;
//   }
// }

// export function* processLoadingAction(options, { payload, type }) {
//   const SUCCESS = createSuccessActionType(type);
//   const FAILURE = createFailureActionType(type);
//   yield put(startLoading(type));
//   try {
//     const response = yield* sendRequestWithRefreshToken(options, payload);
//     yield put({
//       type: response?.success ? SUCCESS : FAILURE,
//       payload: response?.responseData,
//     });
//   } catch (e) {
//     console.log(e);
//     yield put({
//       type: FAILURE,
//       payload: e,
//       error: true,
//     });
//   }
//   yield put(finishLoading(type));
// }

export function* processAction(sendRequest, { payload, type }) {
  const SUCCESS = createSuccessActionType(type);
  const FAILURE = createFailureActionType(type);

  try {
    const response = yield call(sendRequest, payload);
    console.log("processAction response ", response);
    yield put({
      type: response.success ? SUCCESS : FAILURE,
      payload: response.success ? response.data : response.message,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: FAILURE,
      payload: e.message,
    });
  }
}
const handleApiResponse = (result, onSuccess, onError) => {
  const { success, data } = result;
  if (success) onSuccess(data);
  else onError(data);
};
export function* processCallbackAction(sendRequest, { payload }) {
  console.log("processCallbackAction");
  const { params, onSuccess, onError } = payload;
  try {
    const result = yield call(sendRequest, params);
    if (result.isLogout) {
      // yield put(setLogout(true));
    } else {
      handleApiResponse(result, onSuccess, onError);
    }
  } catch (error) {
    console.log(error);
    onError(error.message);
  }
}
