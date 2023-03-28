const fs = require("fs");
const csv = require("csv-parse");
const Registro = require("../models/Registro");
const Transacao = require("../models/Transacao");

exports.sendIndex = async (req, res) => {
  res.render("index");
};

exports.getRegistros = async (req, res) => {
  const listaRegistros = await Registro.findAll();
  res.send(listaRegistros);
};

exports.sendFile = async (req, res) => {
  console.log(req.file); // primeira tarefa

  const filePath = req.file.path;
  console.log(filePath, typeof(filePath))
  var results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      // fazer validação se o arquivo tá vazio
      // verificar se a data do arquivo ja existe no banco
      // verificar se há alguma linha vazia
      var transacao = {
        bOrigem: data[0],
        aOrigem: data[1],
        cOrigem: data[2],
        bDestino: data[3],
        aDestino: data[4],
        cDestino: data[5],
        vTransacao: data[6],
        dataHoraTransacao: data[7],
        filePath: filePath,
      };

      results.push(transacao);
    })
    .on("end", () => {
      // cria data/hora que a importação foi realizada e data das transações dessa importação.
      var registro = new Registro({
        dataTransacao: results[0].dataHoraTransacao,
        dataImportacao: new Date().toISOString(),
        filePath: filePath,
      });

      // verifica se a data da transação ja existe no banco (tarefa 4)
      // const registroExiste = Registro.findAll({'dataHoraTransacao' : results[0].dataHoraTransacao}) || false 
      // if (registroExiste) {
      //   throw new Error('Esta data ja existe no banco')
      // }

      // gravar cada transação em banco de dados.
      const dataPrimeiraTransacao = new Date(
        results[0].dataHoraTransacao
      ).toLocaleDateString();

      results.forEach((e) => {
        const dataAtualTransacao = new Date(
          e.dataHoraTransacao
        ).toLocaleDateString();
        if (dataAtualTransacao !== dataPrimeiraTransacao) {
          return;
        }
        var transacao = new Transacao(e);

        transacao.save(); // salva as transacoes no banco
      });
      registro.save(); // salva o registro no banco

      res.render("index"); // atualiza a página principal com o novo registro
    })
    .on("error", (err) => {
      res.send("Ocorreu um erro desconhecido no upload.");
    });
};