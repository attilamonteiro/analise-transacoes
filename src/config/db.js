const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
    process.exit(2);
  });

module.exports = sequelize;