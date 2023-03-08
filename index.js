const app = require("./src/config/express");

app.listen(process.env.PORT || 3000, () => console.log("Servidor rodando!"));
