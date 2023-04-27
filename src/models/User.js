const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../config/db");
const Transacao = require('../models/Transacao');
const Registro = require("../models/Registro");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status:{
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

User.belongsTo(Transacao, {
  foreignKey: 'id'
});
User.belongsTo(Registro, {
  foreignKey: 'id'
});

//User.sync({force:true});
User.sync();

module.exports = User;
