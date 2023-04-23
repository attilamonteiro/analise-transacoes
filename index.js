const app = require("./src/config/express");

const db = require("./src/config/db");


// Define a porta em que a aplicação será executada
const port = process.env.PORT || 3001;

// Inicia o servidor
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));