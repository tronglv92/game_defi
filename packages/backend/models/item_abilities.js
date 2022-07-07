const { Sequelize } = require("sequelize");
const sequelize = require("../helper/db");
const ItemAbilities = sequelize.define(
  "itemAbilities",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    img: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: () => 1,
    },
  },
  
);
module.exports = ItemAbilities;
