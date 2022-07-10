import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import users from "./users/usersSlice";
import counter from "./counter/counterSlice";
import weapon from "./weapon/weaponSlice";
import upload from "./upload/uploadSlice";
import createSagaMiddleware, { END } from "redux-saga";
import rootSaga from "./rootSaga";
const sagaMiddleware = createSagaMiddleware();
const combinedReducer = combineReducers({
  counter,
  users,
  weapon,
  upload,
});
const masterReducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      counter: {
        count: state.counter.count + action.payload.counter.count,
      },
      users: {
        users: [...action.payload.users.users, ...state.users.users],
      },
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};
const middleware = [...getDefaultMiddleware({ serializableCheck: false }), sagaMiddleware];
export const makeStore = () => {
  const store = configureStore({
    reducer: masterReducer,

    middleware: middleware,
  });

  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export const wrapper = createWrapper(makeStore, { debug: true });
