import React from "react";

import close from "../images/close.svg";
import { connectorsByName } from "../helpers/connectors";
import { useTheme } from "next-themes";
import { WalletId } from "../constants/key";
// displays a page header

function ModalNetworkDisplay(props) {
  const { onDisConnect, onChangeNetwork, walletIdSelected } = props;
  const { theme, setTheme } = useTheme();
  console.log("theme ", theme);
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        // onClick={() => setShowModal(false)}
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div
            className=" rounded-lg shadow-lg relative flex flex-col w-full bg-white  outline-none focus:outline-none border-2 border-solid"
            // onClick={e => {
            //   // do not close modal if anything inside modal content is clicked
            //   e.stopPropagation();
            // }}
          >
            {/*header*/}
            <div className="flex items-start justify-between p-5  rounded-t ">
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  onDisConnect();
                }}
              >
                <svg fill="#979797" viewBox="0 0 30 30" width="30px" height="30px">
                  <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
                </svg>
              </button>
            </div>
            {/*body*/}
            <div className="flex-col px-5">
              <p className="text-3xl  font-bold text-black text-center">Wrong Network</p>
              <p className="text-base  text-black leading-8 text-center">
                Looks like you connected to an unsupported network.
                <br /> Change your network to ETH mainet.
              </p>
            </div>

            <div className="flex justify-around p-6">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  onDisConnect();
                }}
              >
                Disconnected
              </button>
              {walletIdSelected == WalletId.Metamask && (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    onChangeNetwork();
                  }}
                >
                  Change Network
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
export default ModalNetworkDisplay;
