const ethers = require("ethers");
const { STATE_NFT, INFURA_PROJECT_ID } = require("../contracts/constant");

const deployedContracts = require("../contracts/hardhat_contracts.json");
const NFT = require("../models/nft");

const SubscribeEvent = async () => {
  console.log("SubscribeEvent");
  const provider = new ethers.providers.InfuraProvider.getWebSocketProvider(
    process.env.NET_WORK,
    INFURA_PROJECT_ID
  );
  const { chainId, name } = await provider.getNetwork();
  const abi = deployedContracts[chainId][name].contracts["BoxHub"].abi;
  const addressContract =
    deployedContracts[chainId][name].contracts["BoxHub"].address;
  let contract = new ethers.Contract(addressContract, abi, provider);
  contract.on("ThetanBoxPaid", (id, buyer, price, paymentToken, event) => {
    // Called when anyone changes the value

    console.log("ThetanBoxPaid id ", id.toNumber());
    // "0x14791697260E4c9A71f18484C9f997B308e59325"

    console.log("ThetanBoxPaid buyer ", buyer);
    // console.log("ThetanBoxPaid price ", price.toNumber());
    console.log("ThetanBoxPaid paymentToken ", paymentToken);

    if (id) {
      NFT.findOne({
        where: { nftItemId: id.toNumber() },
        // order: [...],
        include: [],
      })
        .then((item) => {
          item.addressOwner = buyer ? buyer.toLowerCase() : null;
          item.state = STATE_NFT.Game;
          return item.save();
        })
        .then((nft) => {
          console.log("item save success ", nft);
        });
    }

    // 4115004
  });
};
module.exports = SubscribeEvent;
