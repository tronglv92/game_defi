const { Sequelize } = require("sequelize");
const { STATE_NFT } = require("../contracts/constant");
const sequelize = require("../helper/db");
const NFT = sequelize.define("nft", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  tokenId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  addressOwner: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: { isLowercase: true },
  },

  minted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: () => false,
  },
  hashNFT: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  //  (in Marketplace, in Game)
  state: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: () => STATE_NFT.Market,
  },
});
module.exports = NFT;
