const ethers = require("ethers");
const { STATE_NFT, INFURA_PROJECT_ID } = require("../contracts/constant");

const deployedContracts = require("../contracts/hardhat_contracts.json");
const NFT = require("../models/nft");

const SubscribeMarketEvent = async () => {
  console.log(
    "SubscribeMarketEvent  process.env.NET_WORK ",
    process.env.NET_WORK
  );
  const provider = new ethers.providers.InfuraProvider.getWebSocketProvider(
    process.env.NET_WORK,
    INFURA_PROJECT_ID
  );
  const { chainId, name } = await provider.getNetwork();
  console.log("chainId ", chainId);
  console.log(
    "deployedContracts[chainId][name].contracts ",
    deployedContracts[chainId][name].contracts
  );
  const abi = deployedContracts[chainId][name].contracts["Marketplace"].abi;
  const addressContract =
    deployedContracts[chainId][name].contracts["Marketplace"].address;
  let contract = new ethers.Contract(addressContract, abi, provider);
  contract.on(
    "LazyMint",
    (tokenId, id, contractAddress, price, paymentToken, buyer) => {
      // Called when anyone changes the value
      console.log("LazyMint tokenId ", tokenId.toNumber());
      console.log("LazyMint id ", id.toNumber());
      // console.log("LazyMint contractAddress ", contractAddress);
      // "0x14791697260E4c9A71f18484C9f997B308e59325"
      console.log("LazyMint price ", price ? price.toString() : "");
      console.log("LazyMint buyer ", buyer);
      // console.log("ThetanBoxPaid price ", price.toNumber());
      // console.log("LazyMint paymentToken ", paymentToken);

      if (id) {
        NFT.findOne({
          where: { nftItemId: id.toNumber() },
          // order: [...],
          include: [],
        })
          .then((item) => {
            item.addressOwner = buyer ? buyer.toLowerCase() : null;
            item.minted = true;
            item.state = STATE_NFT.Game;
            item.tokenId = tokenId;
            return item.save();
          })
          .then((nft) => {
            console.log("item save success ", nft);
          });
      }

      // 4115004
    }
  );
};
module.exports = SubscribeMarketEvent;
