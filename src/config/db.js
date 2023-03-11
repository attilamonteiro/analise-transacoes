const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config(); 

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

const Transacoes = sequelize.define('transacoes', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bOrigem:{
    type: DataTypes.STRING,
  },
  aOrigem:{
    type: DataTypes.STRING,
  },
  cOrigem:{
    type: DataTypes.STRING,
  },
  bDestino:{
    type: DataTypes.STRING,
  },
  aDestino:{
    type: DataTypes.STRING,
  },
  cDestino:{
    type: DataTypes.STRING,
  },
  vTransacao:{
    type: DataTypes.STRING,
  },
  dataHoraTransacao:{
    type: DataTypes.STRING,
  }

}) 

sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL connection has been established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database:', err);
    process.exit(2)
  })
//Transacoes.sync({force: true})
module.exports = {sequelize, Transacoes};