const FileController = require("./../controllers/FileController");

const upload = require("./../config/multer");

module.exports = (app) => {
  app.get("/", FileController.sendIndex);
  app.post("/upload", upload.single("file"), FileController.uploadFile);
};
