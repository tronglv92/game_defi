import { Web3Consumer } from "../../helpers/connectAccount/Web3Context";
import React, { useContext, useEffect, useState } from "react";
import { useContractReader } from "eth-hooks";
import { Button, Card, Col, Divider, Pagination, Row } from "antd";
import { useRouter } from "next/router";
import { CREATE_BOX_PATH, MARKETING_PATH } from "../../constants/path";
import close from "../../images/close.svg";
import { connectorsByName } from "../../helpers/connectAccount/connectors";
import Head from "next/head";

import { getAuth } from "../../helpers/local";
function Login({ web3, history }) {
  const { onLogin, historyRoute, yourAccount } = web3;
  const router = useRouter();
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    if (yourAccount && logging == true) {
      setLogging(false);
      if (historyRoute.length > 1) {
        router.back();
      } else {
        router.replace(MARKETING_PATH);
      }
    }
  }, [yourAccount]);

  const login = value => {
    setLogging(true);
    onLogin(value);
  };
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div

      // onClick={() => setShowModal(false)}
      >
        <div className=" flex flex-col max-w-3xl p-5 rounded-[1rem] mx-auto bg-[rgb(34,34,34)] mt-[100px]">
          {/*body*/}
          <div className=" p-6 ">
            {Object.entries(connectorsByName).map(([key, value]) => {
              return (
                <button
                  key={key}
                  onClick={() => {
                    login(value);
                  }}
                  className="flex mb-7 items-center px-4 border-white border-solid border-[1px] rounded-[10px] max-w-full w-[420px] mx-auto h-12  font-bold   "
                >
                  <img src={value.svg} />

                  <span className="flex-1  whitespace-nowrap text-white text-[20px] md:text-[25px]">{value.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
export default Web3Consumer(Login);
