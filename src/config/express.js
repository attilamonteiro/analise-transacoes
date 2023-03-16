// Importa a biblioteca Express
const express = require("express");

// Importa a biblioteca CORS
const cors = require("cors");

// Cria uma nova instância do Express
const app = express();

// Importa as variáveis de ambiente do arquivo correspondente de acordo com o valor da variável NODE_ENV
const dotenv = require("dotenv");
dotenv.config({
  path:
    process.env.NODE_ENV == "production"
      ? ".env.production"
      : ".env.development",
});

// Define que o servidor irá aceitar JSON no corpo das requisições
app.use(express.json())

// Define a engine de renderização do servidor como o EJS
app.set("view engine", "ejs");

// Define a pasta onde os arquivos estáticos do front-end estão localizados
app.use(express.static("public"));

// Define que o servidor irá aceitar dados codificados em URL nas requisições
app.use(express.urlencoded({ extended: true }));

// Define que o servidor irá aceitar requisições de outros domínios (cross-origin resource sharing)
app.use(cors());

// Importa as rotas e passa a instância do Express como parâmetro para a função exportada pelo arquivo de rotas
require("./../routes/routes")(app);

// Exporta a instância do Express para que possa ser utilizada em outros módulos
module.exports = app;
