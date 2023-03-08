const fs = require("fs");
const csv = require("csv-parse");

exports.sendIndex = async (req, res) => {
  res.render("index");
};

exports.uploadFile = async (req, res) => {
  const archiveName = `uploads/${req.file.filename}`;

  const lines = [];
  fs.createReadStream(archiveName)
    .pipe(csv())
    .on("data", (line) => lines.push(line))
    .on("end", () => {
      res.send(lines);
    })
    .on("error", (err) => {
      res.send("Ocorreu um erro desconhecido no upload!");
    });
};