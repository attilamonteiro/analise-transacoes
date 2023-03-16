// Importa a biblioteca Multer para processar arquivos enviados em formulários
const multer = require("multer");

// Importa a biblioteca Path para lidar com caminhos de arquivo
const path = require("path");

// Importa a biblioteca FS para lidar com o sistema de arquivos
const fs = require("fs").promises;

// Define as extensões permitidas para o upload
const allowedExtensions = [".csv"];

// Define o local onde os arquivos enviados serão armazenados e o nome do arquivo
const storage = multer.diskStorage({
  // Define a pasta onde os arquivos enviados serão armazenados
  destination: async function (req, file, cb) {
    try {
      await fs.mkdir(path.resolve("uploads"));
    } catch (err) {
      if (err.code !== "EEXIST") {
        console.error(err);
        return cb(new Error("Erro ao criar a pasta de upload."));
      }
    }
    cb(null, "uploads/");
  },
  // Define o nome do arquivo que será salvo
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Cria a função de validação do arquivo
function fileFilter(req, file, cb) {
  const extension = path.extname(file.originalname);
  if (!allowedExtensions.includes(extension)) {
    return cb(new Error(`A extensão ${extension} não é permitida.`));
  }
  cb(null, true);
}

// Cria o objeto de upload usando o armazenamento e validação definidos acima
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024, // Limite de 1MB para o tamanho do arquivo
  },
});

// Exporta o objeto de upload para que possa ser utilizado em outros módulos
module.exports = upload;
