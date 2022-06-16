const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "login-with-metamask-database",
  "root",
  "Anhhung123!@#",
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
