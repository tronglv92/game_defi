import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { activateInjectedProvider, injected } from "../helpers/connectors";
import { AUTH_LOCAL_ID, INJECTED_PROVIDER_ID, METAMASK_ID } from "../constants/key";
import { getLocal, setLocal } from "../helpers/local";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);
  function getErrorMessage(error) {
    if (error instanceof NoEthereumProviderError) {
      return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
    } else if (error instanceof UnsupportedChainIdError) {
      return "You're connected to an unsupported network.";
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect ||
      error instanceof UserRejectedRequestErrorFrame
    ) {
      return "Please authorize this website to access your Ethereum account.";
    } else {
      console.error(error);
      return "An unknown error occurred. Check the console for more details.";
    }
  }
  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      console.log("getLocal(INJECTED_PROVIDER_ID) ", getLocal(AUTH_LOCAL_ID));
      const auth = getLocal(AUTH_LOCAL_ID);
      if (auth) {
        try {
          activateInjectedProvider(auth.id);
          await activate(injected);
          setLocal(AUTH_LOCAL_ID, auth);
        } catch (err) {
          console.log(err);
          const messageError = getErrorMessage(err);
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
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };
      const handleChainChanged = chainId => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };
      const handleAccountsChanged = accounts => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = networkId => {
        console.log("Handling 'networkChanged' event with payload", networkId);
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
  }, [active, error, suppress, activate]);
}
