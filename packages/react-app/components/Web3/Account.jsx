import { useWeb3React } from "@web3-react/core";
import { Button, Row } from "antd";
import { useContractReader } from "eth-hooks";
import React from "react";
import { useState } from "react";

import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logout={logout}
    blockExplorer={blockExplorer}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/

export default function Account({
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  yourAccount,
  blockExplorer,
  onConnect,
  onLogout,
  yourLocalBalance,
  readContracts,
}) {
  // const [balanceERC20, setBalanceERC20] = useState("0");
  let balaceERC20 = "0";
  if (yourAccount && readContracts) {
    const numberErc20 = useContractReader(readContracts, "ThetanCoin", "balanceOf", [yourAccount]);

    if (numberErc20) {
      console.log("numberErc20 ", numberErc20.toString());
      balaceERC20 = numberErc20 / Math.pow(10, 18);
    }
  }

  const modalButtons = [];
  if (yourAccount) {
    modalButtons.push(
      <Button
        key="logoutbutton"
        style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
        shape="round"
        size="large"
        type="primary"
        onClick={onLogout}
      >
        logout
      </Button>,
    );
  } else {
    modalButtons.push(
      <Button
        key="loginbutton"
        style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
        shape="round"
        size="large"
        type="primary"
        /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
        onClick={onConnect}
      >
        connect
      </Button>,
    );
  }

  const display = minimized ? (
    ""
  ) : (
    <span className="text-white">
      {yourAccount ? (
        <Address address={yourAccount} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
      ) : (
        "Connecting..."
      )}
      <Balance address={yourAccount} provider={localProvider} yourBalanceERC20={balaceERC20} />
      <Wallet
        address={yourAccount}
        provider={localProvider}
        signer={userSigner}
        ensProvider={mainnetProvider}
        price={price}
        color={"#1890ff"}
      />
    </span>
  );

  return (
    <Row align="middle">
      {display}
      {modalButtons}
    </Row>
  );
}
