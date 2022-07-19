const { Sequelize } = require("sequelize");
const sequelize = require("../helper/db");

const ItemInBox = sequelize.define("itemInBox", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  level: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  percent: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});
module.exports = ItemInBox;
