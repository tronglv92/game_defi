import React, { Component } from "react";
import { METAMASK_ID } from "../../constants/key";
import { Web3Consumer } from "../../helpers/Web3Context";
import Account from "../Account";
import Header from "../Header";
import ModalLogin from "../ModalLogin";

function Layout({ children, web3 }) {
  const { logoutOfWeb3Modal, showModalLogin, setShowModalLogin, onLoginMetaMask } = web3;
  console.log("Layout web3 ", web3);
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
          onLoginMetamask={() => {
            onLoginMetaMask(METAMASK_ID);
          }}
          onLoginWalletConnect={() => {}}
          onLoginCoinbaseWallet={() => {}}
        />
      )}
    </>
  );
}
export default Web3Consumer(Layout);
