const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// const User = require("./User");

const Transacao = sequelize.define("transacao", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bOrigem: {
    type: DataTypes.STRING,
  },
  aOrigem: {
    type: DataTypes.STRING,
  },
  cOrigem: {
    type: DataTypes.STRING,
  },
  bDestino: {
    type: DataTypes.STRING,
  },
  aDestino: {
    type: DataTypes.STRING,
  },
  cDestino: {
    type: DataTypes.STRING,
  },
  vTransacao: {
    type: DataTypes.STRING,
  },
  dataHoraTransacao: {
    type: DataTypes.STRING,
  },
  filePath: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.STRING

  }

});

// Transacao.belongsTo(Transacao, {
//   foreignKey: 'id'
// });
// User.belongsTo(Registro, {
//   foreignKey: 'id'
// });

// Transacao.belongsTo(User);

//Transacao.sync({force: true});
Transacao.sync();
module.exports = Transacao;