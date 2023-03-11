const fs = require("fs");
const csv = require("csv-parse");
const { Transacoes } = require("../config/db")
//const Registro = require("../models/register");
const { response } = require("express");

exports.sendIndex = async (req, res) => {
  res.render("index");
};

exports.get = async (req, res) => {  
  try {
    const transacao = await Transacoes.findByPk(req.body.id);
    if(!transacao) {
      throw new Error('Transacao nao encontrada!');
    }
    return res.send(transacao);
  } catch (err) {
    console.log('erro ao buscar transacao: ' + err)
    return res.status(400).send({'msg': err});
  }
};



exports.uploadFile = async (req, res) => {
  try {
    const archiveName = `uploads/${req.file.filename}`;
    // primeiro a gente cria o registro, mesmo que não salve no banco (usaremos uma flag para indicar se o registro é válido

    let registro = {
      isValid: false,
      idUsuario: "",
      dataUpload: new Date().toISOString(),
      nomeArquivo: archiveName,
      formatoArquivo: "",
      tamanhoMb: ""
    }

    fs.createReadStream(archiveName)
      .pipe(csv())
      .on("data", (line) => { 
        Transacoes.create({
          bOrigem: line[0],
          aOrigem: line[1],
          cOrigem: line[2],
          bDestino: line[3],
          aDestino: line[4],
          cDestino: line[5],
          vTransacao: line[6],
          dataHoraTransacao: line[7]
        })
      })
      .on("end", () => {

      })
      .on("error", (err) => {
        res.send("Ocorreu um erro desconhecido no upload!");
      });

    // depois a gente verifica se as informações do arquivo são válidas


    // se for válido a gente muda a flag do registro pra valido e salva o arquivo no disco


    // salvamos o registro no db e retornamos a view sucesso


    console.log(registro)
    return res.send(200);
  } catch (err) {
    console.log('problemas com a rota de leitura de arquivo');
    console.log(`ERRO: ${err}`);
    return res.status(400).send({msg: err.message})
  }

};