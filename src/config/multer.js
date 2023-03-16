// Importa a biblioteca Multer para processar arquivos enviados em formulários
const multer = require("multer");

// Importa a biblioteca Path para lidar com caminhos de arquivo
const path = require("path");

// Importa a biblioteca FS para lidar com o sistema de arquivos
const fs = require("fs");

// Define o local onde os arquivos enviados serão armazenados e o nome do arquivo
const storage = multer.diskStorage({
  // Define a pasta onde os arquivos enviados serão armazenados
  destination: function (req, file, cb) {
    if (!fs.existsSync(path.resolve("uploads"))) {
      // Verifica se a pasta uploads existe
      // Se não existir, cria a pasta na root do projeto
      fs.mkdir(path.resolve("uploads"), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    cb(null, "uploads/");
  },
  // Define o nome do arquivo que será salvo
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now() + path.extname(file.originalname));
  },
});

// Cria o objeto de upload usando o armazenamento definido acima
const upload = multer({ storage });

// Exporta o objeto de upload para que possa ser utilizado em outros módulos
module.exports = upload;
