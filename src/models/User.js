const { DataTypes, INTEGER } = require("sequelize");
const sequelize = require("../config/db");
// const Transacao = require('./Transacao');
// const Registro = require("./Registro");

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

// User.hasMany(Transacao);


//User.sync({force:true});
User.sync();

module.exports = User;
