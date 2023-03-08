const fs = require("fs");
const csv = require("csv-parse");

exports.sendIndex = async (req, res) => {
  res.render("index");
};

exports.uploadFile = async (req, res) => {
  const archiveName = `uploads/${req.file.filename}`; // rota do arquivo recebendo o nome dele.

  fs.access(archiveName, fs.constants.F_OK, (err) => {
    if (err) {
      res.send(
        "Arquivo não encontrado. Ocorreu um erro desconhecido no upload!"
      );
    } else {
      const lines = [];
      fs.createReadStream(archiveName) // Busca o arquivo na pasta uploads
        .pipe(csv()) // utiliza o csv-parse
        .on("data", (line) => lines.push(line)) // realiza a leitura de cada linha do csv
        .on("end", () => {
          res.send(lines); // Envia para o front end um array contendo os dados do csv
        });
    }
  });
};
