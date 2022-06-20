import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { activateInjectedProvider, getErrorMessage, getWalletById, injected } from "../helpers/connectors";
import { AUTH_LOCAL_ID, INJECTED_PROVIDER_ID, LS_KEY, METAMASK_ID } from "../constants/key";
import { getLocal, setLocal } from "../helpers/local";
import { notification } from "antd";
import { NETWORKS } from "../constants";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      const auth = getLocal(LS_KEY);
      console.log("connectWalletOnPageLoad auth ", auth);
      if (auth) {
        const { walletId } = auth;
        console.log("connectWalletOnPageLoad walletId ", walletId);
        if (walletId != null) {
          const wallet = getWalletById(walletId);
          console.log("connectWalletOnPageLoad wallet",wallet);
          try {
            activateInjectedProvider(wallet.id);
            await activate(wallet.connector, undefined, true);
            // setLocal(AUTH_LOCAL_ID, auth);
          } catch (err) {
            setLocal(LS_KEY, null);
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
          console.log("connectWalletOnPageLoad vao trong nay 1");
          setTried(true);
        }
      } else {
        console.log("connectWalletOnPageLoad vao trong nay 2");
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

// export function useInactiveListener(suppress = false, network = "localhost") {
//   const { active, error, activate, deactivate } = useWeb3React();

//   useEffect(() => {
//     const onChangeEventLogin = async () => {
//       const auth = getLocal(AUTH_LOCAL_ID);
//       const { ethereum } = window;
//       if (ethereum && ethereum.on && !active && !error && !suppress && auth) {
//         const handleConnect = () => {
//           console.log("Handling 'connect' event");
//           // activateInjectedProvider(auth.id);
//           // activate(injected);
//         };
//         const handleChainChanged = chainId => {
//           console.log("Handling 'chainChanged' event with payload", chainId);
//           const chainIdNetwork = "0x" + NETWORKS[network].chainId.toString(16);
//           console.log("handleChainChanged chainIdNetwork ", chainIdNetwork);
//           console.log("handleChainChanged chainId ", chainId);
//           if (chainId != chainIdNetwork) {
//             deactivate();
//           }
//           // activateInjectedProvider(auth.id);
//           // activate(injected);
//         };
//         const handleAccountsChanged = accounts => {
//           console.log("Handling 'accountsChanged' event with payload", accounts);
//           // if (accounts.length > 0) {
//           //   activateInjectedProvider(auth.id);
//           //   activate(injected);
//           // }
//         };
//         const handleNetworkChanged = networkId => {
//           console.log("Handling 'networkChanged' event with payload", networkId);
//           // activateInjectedProvider(auth.id);
//           // activate(injected);
//         };

//         ethereum.on("connect", handleConnect);
//         ethereum.on("chainChanged", handleChainChanged);
//         ethereum.on("accountsChanged", handleAccountsChanged);
//         ethereum.on("networkChanged", handleNetworkChanged);

//         return () => {
//           if (ethereum.removeListener) {
//             ethereum.removeListener("connect", handleConnect);
//             ethereum.removeListener("chainChanged", handleChainChanged);
//             ethereum.removeListener("accountsChanged", handleAccountsChanged);
//             ethereum.removeListener("networkChanged", handleNetworkChanged);
//           }
//         };
//       }
//     };
//     onChangeEventLogin();
//   }, [active, error, suppress, activate]);
// }
