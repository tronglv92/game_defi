import React from "react";

import close from "../../images/close.svg";
import { connectorsByName } from "../../helpers/connectAccount/connectors";
import { Input } from "antd";

// displays a page header

function ModalSell(props) {
  const { setShowModalLogin, onLogin } = props;

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
              <h3 className="text-3xl font-semibold">Sell Item</h3>
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
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                You are about to sell #123 Lava sword on the marketplace.
              </p>
              <div className="rounded flex flex-row items-center">
                <Input placeholder="Basic usage" />
                <p>TH</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
export default ModalSell;
