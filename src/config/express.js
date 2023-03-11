const express = require("express");
const cors = require("cors");
const app = express();

const dotenv = require("dotenv"); // Importa as configurações da lib do dotenv para utilizar as variáveis de ambiente.
dotenv.config({
  path:
    process.env.NODE_ENV == "production"
      ? ".env.production"
      : ".env.development",
});

app.use(express.json())
app.set("view engine", "ejs");

app.use(express.static("public")); // Indica onde arquivos estáticos do front end estarão para o express utilizar e enviar ao client.
app.use(express.urlencoded({ extended: true })); // Aceita arquivos do tipo urlencoded
app.use(cors());

require("./../routes/routes")(app); // Importa o arquivo de rotas e passa a instância express como parâmetro da função exportada pelo arquivo.

module.exports = app;
