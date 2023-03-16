// Importa a biblioteca sequelize para realizar a conexão com o banco de dados e o módulo DataTypes que define os tipos de dados usados.
const { DataTypes } = require("sequelize");

// Importa o arquivo de configuração do banco de dados.
const sequelize = require("../config/db");

// Define um modelo para a tabela "transacoes", com os campos correspondentes.
const Transacao = sequelize.define("transacoes", {
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
});

// Exporta o modelo para ser usado em outros módulos.
module.exports = Transacao;

