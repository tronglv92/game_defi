//const { ethers } = require("hardhat");
const { ethers } = require("hardhat");
const { PAYMENT_RECEIVE_ADDRESS } = require("../constants/constants");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("Marketplace", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
  });
  console.log("===========MARKET PLACE============");
  const trongCoin = await ethers.getContract("TrongCoin", deployer);
  const nftWeapon = await ethers.getContract("NftWeapon", deployer);
  const marketPlace = await ethers.getContract("Marketplace", deployer);

  await nftWeapon.setMintFactory(marketPlace.address, {
    gasLimit: 300000,
  });
  await marketPlace.setPaymentTokens([trongCoin.address], {
    gasLimit: 300000,
  });
  console.log("paymentTokens ", trongCoin.address);

  await marketPlace.setSigner(deployer, { gasLimit: 300000 });
  const signer = marketPlace.signer;
  console.log("signer ", signer.address);

  await marketPlace.setPaymentReceivedAddress(PAYMENT_RECEIVE_ADDRESS, {
    gasLimit: 300000,
  });
  const paymentReceivedAddress = await marketPlace.paymentReceivedAddress();
  console.log("paymentReceivedAddress ", paymentReceivedAddress);

  await marketPlace.setTransactionFee(500);
  const fee = await marketPlace.transactionFee();
  console.log("transactionFee ", fee.toString());
  console.log("=================================");
};
module.exports.tags = ["Marketplace"];
