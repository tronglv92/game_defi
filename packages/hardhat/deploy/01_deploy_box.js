// deploy/00_deploy_your_contract.js

//const { ethers } = require("hardhat");
const { ethers } = require("hardhat");
const { PAYMENT_RECEIVE_ADDRESS } = require("../constants/constants");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("BoxHub", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
  });
  console.log("===========BOX============");
  const boxHub = await ethers.getContract("BoxHub", deployer);
  await boxHub.setSigner(deployer, { gasLimit: 300000 });
  console.log("signer ", deployer);

  await boxHub.setPaymentReceivedAddress(PAYMENT_RECEIVE_ADDRESS, {
    gasLimit: 300000,
  });
  console.log("paymentReceivedAddress ", PAYMENT_RECEIVE_ADDRESS);
  console.log("================================");
};
module.exports.tags = ["BoxHub"];
