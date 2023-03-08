const fs = require("fs");
const csv = require("csv-parse");
//const Registro = require("../models/register");
const { response } = require("express");

exports.sendIndex = async (req, res) => {
  res.render("index");
};




exports.uploadFile = async (req, res) => {
  const archiveName = `uploads/${req.file.filename}`;
  // primeiro a gente cria o registro, mesmo que não salve no banco (usaremos uma flag para indicar se o registro é válido

  let registro = {
    isValid: false,
    Id_usuario: "",
    Data_Upload: new Date().toISOString(),
    Nome_Arquivo: archiveName,
    Formato_Arquivo: "",
    Tamanho_MB: ""
    }

  // depois a gente verifica se as informações do arquivo são válidas


  // se for válido a gente muda a flag do registro pra valido e salva o arquivo no disco


  // salvamos o registro no db e retornamos a view sucesso


  console.log(registro)
  res.send(200)

  // const lines = [];
  // fs.createReadStream(archiveName)
  //   .pipe(csv())
  //   .on("data", (line) => lines.push(line))
  //   .on("end", () => {
  //     res.send(lines);
  //   })
  //   .on("error", (err) => {
  //     res.send("Ocorreu um erro desconhecido no upload!");
  //   });

};