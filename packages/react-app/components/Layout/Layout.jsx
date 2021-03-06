import React, { Component } from "react";
import { WalletId } from "../../constants/key";
import { activateInjectedProvider } from "../../helpers/connectors";

import { Web3Consumer } from "../../helpers/Web3Context";
import Account from "../Account";
import Header from "../Header";
import ModalLogin from "../ModalLogin";
import ModalNetworkDisplay from "../ModalNetworkDisplay";

function Layout({ children, web3 }) {
  const {
    logoutOfWeb3Modal,
    showModalLogin,
    setShowModalLogin,
    onLogin,
    showModalDisplayNetWork,
    setShowModalDisplayNetWork,
    targetNetwork,
    loginCryto,
    library,
    walletIdSelected,
  } = web3;
  // const checkNetwork = async () => {
  //   if (window.ethereum) {
  //     const currentChainId = await library.provider.request({
  //       method: "eth_chainId",
  //     });

  //     // return true if network id is the same
  //     console.log("currentChainId ", currentChainId);
  //   }
  // };
  return (
    <>
      {/* Page Header start */}
      <div className="flex flex-1 justify-between items-center">
        <Header />
        <div className="mr-6">
          <Account
            {...web3}
            onConnect={() => {
              setShowModalLogin(true);
            }}
            onLogout={logoutOfWeb3Modal}
          />
        </div>
      </div>
      {/* Page Header end */}
      {/* Main Page Content start */}
      {children}
      {/* Modal Login */}
      {/* 0:metamask */}
      {showModalLogin == true && (
        <ModalLogin
          setShowModalLogin={setShowModalLogin}
          onLogin={wallet => {
            console.log("ModalLogin wallet ", wallet);
            onLogin(wallet);
          }}
        />
      )}
      {showModalDisplayNetWork == true && (
        <ModalNetworkDisplay
          walletIdSelected={walletIdSelected}
          onChangeNetwork={async () => {
            // checkNetwork();
            // console.log("targetNetwork ", targetNetwork);

            const data = [
              {
                chainId: "0x" + targetNetwork.chainId.toString(16),
                chainName: targetNetwork.name,
                nativeCurrency: targetNetwork.nativeCurrency,
                rpcUrls: [targetNetwork.rpcUrl],
                blockExplorerUrls: [targetNetwork.blockExplorer],
              },
            ];
            console.log("data", data);

            let switchTx;
            // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
            try {
              switchTx = await library.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: data[0].chainId }],
              });
            } catch (switchError) {
              console.log("swich network switchError ", switchError);
              // not checking specific error code, because maybe we're not using MetaMask
              try {
                switchTx = await library.provider.request({
                  method: "wallet_addEthereumChain",
                  params: data,
                });
              } catch (addError) {
                // handle "add" error
                console.log("swich network addError ", addError);
              }
            }

            if (switchTx) {
              console.log("switchTx ", switchTx);
            }
            setShowModalDisplayNetWork(false);
          }}
          onDisConnect={() => {
            logoutOfWeb3Modal();
            setShowModalDisplayNetWork(false);
          }}
        />
      )}
    </>
  );
}
export default Web3Consumer(Layout);
