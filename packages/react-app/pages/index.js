import { useContractReader } from "eth-hooks";
import React, { useContext } from "react";
import { Contract, Account, Header } from "../components";
import ExampleUI from "../components/Views/ExampleUI";
import { Web3Consumer } from "../helpers/Web3Context";

function Home({ web3 }) {
  console.log(`🗄 web3 context:`, web3);
  const {
    readContracts,
    account,
    userSigner,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    writeContracts,
    price,
    tx,
  } = web3;
  const purpose = useContractReader(readContracts, "YourContract", "purpose");
  const number = useContractReader(readContracts, "YourContract", "number");
  // console.log("purpose ", purpose);
  // console.log("number ", number ? number.toString() : "");
  return (
    <>
      {/* Page Header start */}
      <div className="flex flex-1 justify-between items-center">
        <Header />
        <div className="mr-6">
          <Account {...web3} />
        </div>
      </div>
      {/* Page Header end */}

      {/* Main Page Content start */}
      <div className="flex flex-1 flex-col h-screen w-full items-center">
        <div className="text-center" style={{ margin: 64 }}>
          <span>This App is powered by Scaffold-eth & Next.js!</span>
          <br />
          <span>
            Added{" "}
            <a href="https://tailwindcomponents.com/cheatsheet/" target="_blank" rel="noreferrer">
              TailwindCSS
            </a>{" "}
            for easier styling.
          </span>
        </div>
        <div className="text-center">
          {userSigner && (
            <ExampleUI
              address={account}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              yourLocalBalance={yourLocalBalance}
              price={price}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
              purpose={purpose ? purpose : ""}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Web3Consumer(Home);
