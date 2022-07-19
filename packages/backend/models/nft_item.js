const { Sequelize } = require("sequelize");
const sequelize = require("../helper/db");
const NftItem = sequelize.define("nftItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  //O: sword , 1: Staff,  2: Bow
  type: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  img: {
    type: Sequelize.STRING,
  },
  level: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  star: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  box: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: () => false,
  },
});
module.exports = NftItem;
