const fs = require("fs");
const csv = require("csv-parse");
const Registro = require("../models/Registro");
const Transacao = require("../models/Transacao");
const User = require("../models/User")

const jwt = require("jsonwebtoken");

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
  console.log(filePath, typeof filePath);
  var results = [];
  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;

  // Consulta o usuário pelo ID
  const user = await User.findByPk(userId);
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
        userId: userId
      };

      results.push(transacao);
    })
    .on("end", () => {
      const token = req.cookies.token;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.id;
      // cria data/hora que a importação foi realizada e data das transações dessa importação.
      var registro = new Registro({
        dataTransacao: results[0].dataHoraTransacao,
        dataImportacao: new Date().toISOString(),
        filePath: filePath,
        userId: userId
      });

      

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

exports.showRegisterDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const listaTransacao = await Transacao.findAll({
      where: {
        id: req.params.id,
      },
    });

    const listaRegistro = await Registro.findAll({
      where: {
        id: req.params.id,
      },
    });

    // const detalhes = {
    //   transacao: listaTransacao,
    //   registro: listaRegistro,
    // };
    res.render('transacoes-importacao', { listaTransacao, listaRegistro });

  } catch (error) {
    console.log(error.message, error.stack);
  }
};


exports.getAnaliseTransacoes = async (req, res) => {
  res.render("analise-transacoes");
};

exports.analisarTransacoes = async (req, res) => {
  const { dataHoraTransacao} = req.body;

  // Realiza a análise das transações do mês/ano informado
  // Código para análise das transações aqui

  // Exibe as tabelas de transações, contas e agências suspeitas após a análise
  res.render("resultado-analise", { Transacao, contasSuspeitas, agenciasSuspeitas });
  console.log(Transacao)
};


//showAllTransactions