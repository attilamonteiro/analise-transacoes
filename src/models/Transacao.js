const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transacao = sequelize.define("transacao", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bancoOrigem: {
    type: DataTypes.STRING,
  },
  agenciaOrigem: {
    type: DataTypes.STRING,
  },
  contaOrigem: {
    type: DataTypes.STRING,
  },
  bancoDestino: {
    type: DataTypes.STRING,
  },
  agenciaDestino: {
    type: DataTypes.STRING,
  },
  contaDestino: {
    type: DataTypes.STRING,
  },
  valorTransacao: {
    type: DataTypes.STRING,
  },
  dataHoraTransacao: {
    type: DataTypes.STRING,
  },
  filePath: {
    type: DataTypes.STRING,
  },
});
// Transacao.sync({force: true});
Transacao.sync();
module.exports = Transacao;
