const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Registro = sequelize.define("registro", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dataTransacao: {
    type: DataTypes.STRING,
  },
  dataImportacao: {
    type: DataTypes.STRING,
  },
  filePath: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.STRING

  }
});


Registro.sync({force:true});
//Registro.sync();
module.exports = Registro;