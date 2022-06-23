import { useWeb3React } from "@web3-react/core";
import { activateInjectedProvider, getErrorMessage, getWalletById } from "../helpers/connectors";
import { getLocal, setLocal } from "../helpers/local";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { LS_KEY } from "../constants/key";
import { notification } from "antd";
export function useEagerConnectLogin(props) {
  const { walletId, localChainId, setShowModalDisplayNetWork } = props;
  const { active, account, library, connector, chainId, activate, deactivate } = useWeb3React();
  const [walletIdSelected, setWalletIdSelected] = useState();
  const [yourAccount, setYourAccount] = useState();
  const [state, setState] = useState({});

  const connectWalletOnPageLoad = async () => {
    const auth = getLocal(LS_KEY);
    console.log("connectWalletOnPageLoad auth ", auth);
    setState({ auth: auth });
    if (auth) {
      const { walletId } = auth;
      console.log("connectWalletOnPageLoad walletId ", walletId);
      if (walletId != null) {
        setWalletIdSelected(walletId);
        const wallet = getWalletById(walletId);
        console.log("connectWalletOnPageLoad wallet", wallet);
        try {
          activateInjectedProvider(wallet.id);
          await activate(wallet.connector, undefined, true);
          // setLocal(AUTH_LOCAL_ID, auth);
        } catch (err) {
          clearAccount();
          console.log("connectWalletOnPageLoad err", err);
          const messageError = getErrorMessage(err);
          notification.error({
            message: "Login Error",
            description: messageError,
          });
          console.log(messageError);
        }
      } else {
        console.log("connectWalletOnPageLoad walletId is null");
      }
    } else {
      console.log("connectWalletOnPageLoad auth is null");
    }
  };
  const handleAuthenticate = ({ publicAddress, signature }) => {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then(response => response.json());
  };
  const handleSignMessage = async ({ publicAddress, nonce }) => {
    try {
      const signature = await library.send("personal_sign", [
        `I am signing my one-time nonce: ${nonce}`,
        publicAddress,
      ]);
      return { publicAddress, signature };
    } catch (err) {
      throw new Error("You need to sign the message to be able to log in.");
    }
  };
  const handleSignup = publicAddress => {
    console.log("JSON.stringify({ publicAddress }) ", JSON.stringify({ publicAddress }));
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then(response => response.json());
  };
  const signatureLogin = async () => {
    console.log("walletIdSelected ", walletIdSelected);
    if (account) {
      setYourAccount(null);
      const publicAddress = account.toLowerCase();
      try {
        const users = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users?publicAddress=${publicAddress}`).then(
          response => response.json(),
        );
        // If yes, retrieve it. If no, create it.
        let user;
        if (users.length > 0) {
          user = users[0];
        } else {
          user = await handleSignup(publicAddress);
        }
        const resultSign = await handleSignMessage(user);
        const auth = await handleAuthenticate(resultSign);
        // onLogin(auth);
        auth.publicAddress = publicAddress;
        if (walletIdSelected != null) auth.walletId = walletIdSelected;
        console.log("auth ", auth);
        setLocal(LS_KEY, auth);
        setState({ auth });
        setYourAccount(account);
      } catch (ex) {
        deactivate();
        notification.error({
          message: "Login Error",
          description: ex.message,
        });
      }
    }
  };
  useEffect(() => {
    setWalletIdSelected(walletId);
  }, [walletId]);
  useEffect(() => {
    connectWalletOnPageLoad();
  }, []); // intentionally only running on mount (make sure it's only mounted once :))
  useEffect(() => {
    console.log("CHANGE ACCOUNT ", account);
    console.log("CHANGE AUTH ", state.auth);

    if (isNetworkSelected(chainId) == true) {
      if (account) {
        // User logged in, check account and auth in local is same
        if (state.auth) {
          let publicAddress = state.auth.publicAddress;
          //User logged in and change account
          if (publicAddress && publicAddress != account.toLocaleLowerCase()) {
            console.log("Vao trong 1");

            signatureLogin();
          } else {
            console.log("Vao trong 2");
            setYourAccount(account);
          }
        }
        // User just logged in after logout or fisttime log in
        else {
          console.log("Vao trong 3");
          signatureLogin();
        }
      }
      // User logout , clear account
      else {
        if (state.auth) {
          console.log("Vao trong 4");
          clearAccount();
        }
      }
    } else {
      if (account) {
        //User logged in and  User change network different netwok selected
        if (state.auth) {
          console.log("Vao trong 5");
          deactivate();
        }
        // Login with different network selected
        else {
          console.log("Vao trong 6");
          setShowModalDisplayNetWork(true);
        }
      }
      // User logout clear account
      else {
        if (state.auth) {
          console.log("Vao trong 7");
          clearAccount();
        }
      }
    }
  }, [account, chainId]);
  const clearAccount = () => {
    setLocal(LS_KEY, null);
    setState({ auth: null });
    setWalletIdSelected(null);
    setYourAccount(null);
    // deactivate();
  };
  const isNetworkSelected = chainId => {
    console.log("localChainId ", localChainId);
    return chainId == localChainId;
  };

  return yourAccount;
}
