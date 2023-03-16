// Importa o controlador do arquivo
const FileController = require("../controllers/FileController");

// Importa a configuração do multer
const upload = require("./../config/multer");

// Exporta uma função que recebe a aplicação express como parâmetro
module.exports = (app) => {
// Define a rota raiz da aplicação
app.get("/", FileController.sendIndex);

// Define a rota para receber o upload do arquivo
app.post('/uploadFile', upload.single("file"), FileController.sendFile)

// Define a rota para buscar os registros
app.get('/registros', FileController.getRegistros)
};