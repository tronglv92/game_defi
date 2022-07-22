import { useContractReader } from "eth-hooks";
import React, { useContext, useState } from "react";

import { Web3Consumer } from "../helpers/connectAccount/Web3Context";

import { useMediaQuery } from "react-responsive";
import { wrapper } from "../store/store";
import { END } from "redux-saga";
import { getUser } from "../store/users/usersSlice";
function Home({ web3 }) {
  console.log("web3 ", web3);
  const {
    readContracts,
    yourAccount,
    userSigner,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    writeContracts,
    price,
    tx,
  } = web3;

  // const number = useContractReader(readContracts, "ThetanCoin", "balanceOf");
  const items = [1, 2, 3, 4, 5, 6, 7, 9];
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [visibleFilter, setVisibleFilter] = useState(false);
  // console.log("purpose ", purpose);
  // console.log("number ", number ? number.toString() : "");
  const onClickFilter = () => {
    setVisibleFilter(!visibleFilter);
  };
  return <></>;
}
export const getServerSideProps = wrapper.getServerSideProps(store => async () => {
  // regular stuff
  store.dispatch(getUser());

  // end the saga
  store.dispatch(END);
  await store.sagaTask.toPromise();
  // const response = await fetch(
  //   `https://reqres.in/api/users/${Math.floor(Math.random() * 10 + 1)}`
  // );
  // const { data } = await response.json();
  // console.log("data ", data);
  // console.log("store.getState ", store.getState());
  // store.dispatch(addUser(`${data.first_name} ${data.last_name}`));
  // store.dispatch(increment());
});
export default Web3Consumer(Home);
