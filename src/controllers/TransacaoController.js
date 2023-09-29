const { Op } = require('sequelize');
const transacao = require("../models/Transacao");


exports.analisaTransacoes = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    const { dataHoraTransacao} = req.body;
    const transacoes = await transacao.findAll({
      where: {
        dataHoraTransacao: {
          [Op.between]: [dataInicio, dataFim],
        },  

      },
    });
    console.log(transacoes)
    const relatorio = {};
    for (const transacao of transacoes) {
      const data = new Date(transacao.dataHoraTransacao);
      const ano = data.getFullYear();
      const mes = data.getMonth() + 1;
      const dia = data.getDate();
      const hora = data.getHours();
      
      const mesFormatado = mes.toString().padStart(2, '0');
      const dataFormatada = `${ano}-${mesFormatado}-${dia}`;
      
      if (!relatorio[dataFormatada]) {
        relatorio[dataFormatada] = {};
      }
      
      if (!relatorio[dataFormatada][hora]) {
        relatorio[dataFormatada][hora] = {
          totalTransacionado: 0,
          quantidadeTransacoes: 0,
        };
      }
      
      relatorio[dataFormatada][hora].totalTransacionado += transacao.valor;
      relatorio[dataFormatada][hora].quantidadeTransacoes++;
    }
    
    res.json(relatorio);
    console.log(transacoes)
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro ao gerar relatório');
  }
};
