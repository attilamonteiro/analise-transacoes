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
  const filePath = req.file.path;
  const results = [];

  if (!req.file) {
    res.status(400).json({ error: "Não foi enviado nenhum arquivo!" });
    return;
  }

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      if (data.length === 0) {
        res.status(400).json({ error: "O arquivo enviado está vazio!" });
        return;
      }

      // verificar se a data do arquivo ja existe no banco
      // verificar se há alguma linha vazia
      const transacao = {
        bancoOrigem: data[0],
        agenciaOrigem: data[1],
        contaOrigem: data[2],
        bancoDestino: data[3],
        agenciaDestino: data[4],
        contaDestino: data[5],
        valorTransacao: data[6],
        dataHoraTransacao: data[7],
        filePath: filePath,
      };

      results.push(transacao);
    })
    .on("end", async () => {
      // cria data/hora que a importação foi realizada e data das transações dessa importação.
      var registro = new Registro({
        dataTransacao: results[0].dataHoraTransacao,
        dataImportacao: new Date().toISOString(),
        filePath: filePath,
      });

      // Datas filtradas
      let filteredResults = results.filter((result) => {
        const resultDate = new Date(result.dataHoraTransacao);
        const controlDate = new Date(results[0].dataHoraTransacao);

        if (
          resultDate.getDate() === controlDate.getDate() &&
          resultDate.getMonth() === controlDate.getMonth() &&
          resultDate.getFullYear() === controlDate.getFullYear()
        ) {
          return result;
        }
      });

      // Ignora transações com valores faltando
      filteredResults = filteredResults.filter((result) => {
        const resultKeys = Object.keys(result);

        var isNull = true;

        for (const key of resultKeys) {
          if (!result[key]) {
            isNull = null;
            break;
          }
        }

        if (isNull) return result;
      });

      // Evitar duplicação de transações
      filteredResults = filteredResults.filter(async (result) => {
        try {
          const data = await Transacao.findOne({
            where: {
              bancoOrigem: result.bancoOrigem,
              agenciaOrigem: result.agenciaOrigem,
              contaOrigem: result.contaOrigem,
              bancoDestino: result.bancoDestino,
              agenciaDestino: result.agenciaDestino,
              contaDestino: result.contaDestino,
              valorTransacao: result.valorTransacao,
              dataHoraTransacao: result.dataHoraTransacao,
            },
          });

          if (!data) {
            return result;
          }
        } catch (err) {
          throw new Error(
            `Erro ao buscar valores no banco de dados: ${err.message}`
          );
        }
      });

      // verifica se a data da transação ja existe no banco (tarefa 4)
      try {
        const registroExiste = await Registro.findOne({
          where: {
            dataTransacao: results[0].dataHoraTransacao,
          },
        });

        if (registroExiste) {
          res
            .status(400)
            .json({ error: "Essa data já existe no banco de dados." });
        }
      } catch (err) {
        throw new Error(err.message);
      }

      filteredResults.forEach(async (result) => {
        try {
          await Transacao.create({
            bancoOrigem: result.bancoOrigem,
            agenciaOrigem: result.agenciaOrigem,
            contaOrigem: result.contaOrigem,
            bancoDestino: result.bancoDestino,
            agenciaDestino: result.agenciaDestino,
            contaDestino: result.contaDestino,
            valorTransacao: result.valorTransacao,
            dataHoraTransacao: result.dataHoraTransacao,
            filePath: filePath,
          });
        } catch (err) {
          throw new Error(
            `Erro ao realizar o insert no banco de dados: ${err.message}`
          );
        }
      });

      registro.save(); // salva o registro no banco

      res.render("index"); // atualiza a página principal com o novo registro
    })
    .on("error", (err) => {
      res.send("Ocorreu um erro desconhecido no upload.");
    });
};
