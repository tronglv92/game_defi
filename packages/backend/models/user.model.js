const { Sequelize } = require("sequelize");

const sequelize = require("../helper/db");

const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nonce: {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: () => Math.floor(Math.random() * 10000),
    },
    publicAddress: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
      validate: { isLowercase: true },
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
  },
  {
    modelName: "user",
    sequelize, // This bit is important
    timestamps: false,
  }
);

module.exports = User;
