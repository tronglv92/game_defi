import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import users from "./users/usersSlice";
import counter from "./counter/counterSlice";
import weapon from "./weapon/weaponSlice";
import box from "./box/boxSlice";
import myBox from "./myBox/myBoxSlice";
import createSagaMiddleware, { END } from "redux-saga";
import rootSaga from "./rootSaga";
const sagaMiddleware = createSagaMiddleware();
const combinedReducer = combineReducers({
  counter,
  users,
  weapon,
  box,
  myBox,
});
const masterReducer = (state, action) => {
  if (action.type === HYDRATE) {
    console.log("masterReducer action ", action);
    console.log("masterReducer state ", state);

    const nextState = {
      ...state, // use previous state
      ...action.payload,
      // weapon: {
      //   ...state.weapon,
      //   weapons: weapons,
      //   count: action.payload.weapon.count,
      // },
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
