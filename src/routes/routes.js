const FileController = require("../controllers/FileController");

const upload = require("./../config/multer");

module.exports = (app) => {
  app.get("/", FileController.sendIndex);
  app.post('/uploadFile', upload.single("file"), FileController.sendFile)
  app.get('/registros', FileController.getRegistros)
};