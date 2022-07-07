const { Sequelize } = require("sequelize");
const sequelize = require("../helper/db");

const BoxState = sequelize.define("boxState", {
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
module.exports = BoxState;
