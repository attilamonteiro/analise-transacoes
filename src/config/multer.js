const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
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
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
