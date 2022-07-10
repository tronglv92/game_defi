import { useContractReader } from "eth-hooks";
import React, { useContext } from "react";
import { Contract, Account, Header } from "../components";
import ExampleUI from "../components/Views/ExampleUI";
import { Web3Consumer } from "../helpers/connectAccount/Web3Context";

function Home({ web3 }) {
  console.log("web3 ", web3);
  const { readContracts, yourAccount } = web3;
  const purpose = useContractReader(readContracts, "YourContract", "purpose");
  const number = useContractReader(readContracts, "YourContract", "number");
  // console.log("purpose ", purpose);
  // console.log("number ", number ? number.toString() : "");
  return (
    <>
      {/* Page Header end */}

      {/* Main Page Content start */}
      <div className="flex flex-1 flex-col items-center">
        <div className="text-center" style={{ margin: 64 }}>
          <span> {yourAccount ? "Wellcome to admin" : "Please login"}</span>
        </div>
      </div>
    </>
  );
}

export default Web3Consumer(Home);
