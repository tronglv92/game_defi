import React, { useState } from "react";
import { useBalance, useContractReader } from "eth-hooks";

const { utils } = require("ethers");

/*
  ~ What it does? ~

  Displays a balance of given address in ether & dollar

  ~ How can I use? ~

  <Balance
    address={address}
    provider={mainnetProvider}
    price={price}
  />

  ~ If you already have the balance as a bignumber ~
  <Balance
    balance={balance}
    price={price}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to given address
  - Provide provider={mainnetProvider} to access balance on mainnet or any other network (ex. localProvider)
  - Provide price={price} of ether and get your balance converted to dollars
*/

export default function Balance(props) {
  const { yourBalanceERC20 } = props;

  // const [listening, setListening] = useState(false);

  // const balance = useBalance(props.provider, props.address);

  let floatBalance = parseFloat(yourBalanceERC20);

  // if (typeof props.balance !== "undefined") {
  //   usingBalance = props.balance;
  // }
  // if (typeof props.value !== "undefined") {
  //   usingBalance = props.value;
  // }

  let displayBalance = floatBalance.toFixed(4);

  // const price = props.price || props.dollarMultiplier;

  // if (price && dollarMode) {
  //   displayBalance = "$" + (floatBalance * price).toFixed(2);
  // }

  return (
    <span
      style={{
        verticalAlign: "middle",
        fontSize: props.size ? props.size : 24,
        padding: 8,
      }}
    >
      {displayBalance}
    </span>
  );
}
