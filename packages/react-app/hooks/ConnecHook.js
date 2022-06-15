import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { activateInjectedProvider, getErrorMessage, injected } from "../helpers/connectors";
import { AUTH_LOCAL_ID, INJECTED_PROVIDER_ID, METAMASK_ID } from "../constants/key";
import { getLocal, setLocal } from "../helpers/local";
import { notification } from "antd";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      console.log("getLocal(INJECTED_PROVIDER_ID) ", getLocal(AUTH_LOCAL_ID));
      const auth = getLocal(AUTH_LOCAL_ID);
      if (auth) {
        try {
          activateInjectedProvider(auth.id);
          await activate(injected, undefined, true);
          setLocal(AUTH_LOCAL_ID, auth);
        } catch (err) {
          console.log("connectWalletOnPageLoad err", err);
          const messageError = getErrorMessage(err);
          notification.error({
            message: "Login Error",
            description: messageError,
          });
          console.log(messageError);
          setTried(true);
        }
      } else {
        setTried(true);
      }
    };
    connectWalletOnPageLoad();
  }, []); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const onChangeEventLogin = async () => {
      const auth = getLocal(AUTH_LOCAL_ID);
      const { ethereum } = window;
      if (ethereum && ethereum.on && !active && !error && !suppress && auth) {
        const handleConnect = () => {
          console.log("Handling 'connect' event");
          activateInjectedProvider(auth.id);
          activate(injected);
        };
        const handleChainChanged = chainId => {
          console.log("Handling 'chainChanged' event with payload", chainId);
          activateInjectedProvider(auth.id);
          activate(injected);
        };
        const handleAccountsChanged = accounts => {
          console.log("Handling 'accountsChanged' event with payload", accounts);
          if (accounts.length > 0) {
            activateInjectedProvider(auth.id);
            activate(injected);
          }
        };
        const handleNetworkChanged = networkId => {
          console.log("Handling 'networkChanged' event with payload", networkId);
          activateInjectedProvider(auth.id);
          activate(injected);
        };

        ethereum.on("connect", handleConnect);
        ethereum.on("chainChanged", handleChainChanged);
        ethereum.on("accountsChanged", handleAccountsChanged);
        ethereum.on("networkChanged", handleNetworkChanged);

        return () => {
          if (ethereum.removeListener) {
            ethereum.removeListener("connect", handleConnect);
            ethereum.removeListener("chainChanged", handleChainChanged);
            ethereum.removeListener("accountsChanged", handleAccountsChanged);
            ethereum.removeListener("networkChanged", handleNetworkChanged);
          }
        };
      }
    };
    onChangeEventLogin();
  }, [active, error, suppress, activate]);
}
