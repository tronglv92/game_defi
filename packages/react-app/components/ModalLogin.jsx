import React from "react";
import metamask from "../images/metamask.svg";
import coinbase_wallet from "../images/coinbase_wallet.svg";
import wallet_connect from "../images/wallet_connect.svg";
import close from "../images/close.svg";

// displays a page header

function ModalLogin(props) {
  const { setShowModalLogin, onLoginMetamask, onLoginWalletConnect, onLoginCoinbaseWallet } = props;

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        // onClick={() => setShowModal(false)}
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div
            className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
            // onClick={e => {
            //   // do not close modal if anything inside modal content is clicked
            //   e.stopPropagation();
            // }}
          >
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Login</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  setShowModalLogin(false);
                }}
              >
                {/* <span className="bg-transparent text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                      x
                    </span> */}
                <img src={close.src} />
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 ">
              <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
                Connect with one of our available wallet providers or create a new one.
              </p>
              <ul class="my-4 space-y-3">
                <li>
                  <a
                    onClick={onLoginMetamask}
                    class="flex  items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  >
                    <img src={metamask.src} />

                    <span class="flex-1 ml-3 whitespace-nowrap">MetaMask</span>
                    <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                      Popular
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    onClick={onLoginCoinbaseWallet}
                    class="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  >
                    <img src={coinbase_wallet.src} />
                    <span class="flex-1 ml-3 whitespace-nowrap">Coinbase Wallet</span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={onLoginWalletConnect}
                    class="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  >
                    <img src={wallet_connect.src} />
                    <span class="flex-1 ml-3 whitespace-nowrap">WalletConnect</span>
                  </a>
                </li>
              </ul>
              <div>
                <a
                  href="#"
                  class="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
                >
                  <svg
                    class="mr-2 w-3 h-3"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="question-circle"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"
                    ></path>
                  </svg>
                  Why do I need to connect with my wallet?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
export default ModalLogin;
