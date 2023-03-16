// Importa a classe Sequelize do módulo 'sequelize'
const { Sequelize } = require("sequelize");

// Importa as variáveis de ambiente definidas no arquivo '.env'
require("dotenv").config();

// Cria uma nova instância do Sequelize, passando as informações de conexão como argumentos
const sequelize = new Sequelize(
  process.env.DB_DATABASE,    // Nome do banco de dados
  process.env.DB_USER,        // Nome de usuário do banco de dados
  process.env.DB_PASSWORD,    // Senha do usuário do banco de dados
  {
    host: process.env.DB_HOST,    // Endereço do banco de dados
    port: process.env.DB_PORT,    // Porta em que o banco de dados está rodando
    dialect: process.env.DB_DIALECT  // Dialeto do banco de dados (MySQL, PostgreSQL, etc.)
  }
);

// Verifica se as variáveis de ambiente foram definidas corretamente antes de criar a conexão
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE || !process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_DIALECT) {
  console.error('Alguma variável de ambiente está faltando ou definida incorretamente.');
  process.exit(1);
}
// Tenta autenticar a conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
    process.exit(2);
  });

// Exporta a instância do Sequelize para que possa ser utilizada em outros módulos
module.exports = sequelize;
