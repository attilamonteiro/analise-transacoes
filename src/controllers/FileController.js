const fs = require("fs"); // módulo para trabalhar com arquivos
const csv = require("csv-parse"); // módulo para fazer parsing de arquivos CSV
const Registro = require('../models/Registro') // modelo de dados para registros

exports.sendIndex = async (req, res) => {
  res.render("index"); // renderiza a página inicial
};

exports.getRegistros = async (req, res) => {
  const listaRegistros = await Registro.findAll(); // busca todos os registros no banco de dados
  res.send(listaRegistros) // envia a lista de registros em formato JSON
}

exports.sendFile = async (req, res) => {
  console.log(req.file); // loga informações sobre o arquivo enviado pelo usuário

  const filePath = req.file.path; // caminho do arquivo temporário enviado pelo usuário
  var results = []; // array vazio para armazenar as transações

  fs.createReadStream(filePath) // cria uma stream de leitura para o arquivo
    .pipe(csv()) // faz parsing do arquivo CSV
    .on("data", (data) => { // para cada linha do arquivo
      var transacao = {
        bOrigem: data[0], // campo bOrigem
        aOrigem: data[1], // campo aOrigem
        cOrigem: data[2], // campo cOrigem
        bDestino: data[3], // campo bDestino
        aDestino: data[4], // campo aDestino
        cDestino: data[5], // campo cDestino
        vTransacao: data[6], // campo vTransacao
        dataHoraTransacao: data[7], // campo dataHoraTransacao
      };
      results.push(transacao); // adiciona a transação ao array de resultados
    })
    .on("end", () => {
      // data/hora que a importação foi realizada e data das transações dessa importação.
      var registro = new Registro({
        dataTransacao: results[0].dataHoraTransacao, // data/hora da primeira transação
        dataImportacao: new Date().toISOString(), // data/hora da importação
      });
      registro.save(); // salva o registro no banco de dados
      
      res.render('index') // renderiza a página inicial, atualizando-a com o novo registro
    })
    .on("error", (err) => {
      res.send("Ocorreu um erro desconhecido no upload."); // retorna uma mensagem de erro caso ocorra algum problema na importação do arquivo
    });
};
