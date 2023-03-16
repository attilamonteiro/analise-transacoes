const app = require("./src/config/express");

const db = require("./src/config/db");

app.listen(process.env.PORT || 3001, () => console.log("Servidor rodando!"));