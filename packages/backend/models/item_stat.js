const { Sequelize } = require("sequelize");
const sequelize = require("../helper/db");
const ItemStat = sequelize.define("itemStat", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  damage: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  speed: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  hp: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  critical: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});
module.exports = ItemStat;
