// Importa o objeto DataTypes da biblioteca sequelize
const { DataTypes } = require("sequelize");

// Importa a instância do sequelize que foi configurada em ../config/db.js
const sequelize = require("../config/db");

// Define o modelo Registro utilizando o método define() do sequelize
const Registro = sequelize.define("registro", {
// Define a coluna 'id', que é um inteiro autoincrementado e chave primária da tabela
id: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true,
},
// Define a coluna 'dataTransacao', que é uma string
dataTransacao: {
type: DataTypes.STRING,
},
// Define a coluna 'dataImportacao', que é uma string
dataImportacao: {
type: DataTypes.STRING,
},
});

// Comentado para evitar sincronização forçada com o banco de dados em cada reinicialização do servidor
// Registro.sync({force: true});

// Exporta o modelo Registro para uso em outros arquivos
module.exports = Registro;