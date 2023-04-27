const Transacao = require("../models/Transacao");
const Registro = require("../models/Registro");
const jwt = require('jsonwebtoken');
const Lista = require('../models/Lista');
const User = require("../models/User");

exports.showImportDetails = async (req, res) => {
const registro = await Registro.findByPk(req.params.id, {
include: Transacao,
});
res.render("import-details", { registro });
};

exports.showTransacoesImportacao = async (req, res) => {
const transacoes = await Transacao.findAll({
where: {
filePath: req.params.filePath,
},
});
res.render("transacoes-importacao", { transacoes });
};

exports.getLista = async (req, res) => {
try {
// Verifica se o token foi enviado no header da requisição
const token = req.headers.authorization?.replace('Bearer ', '');
if (!token) {
return res.status(401).json({ error: 'Usuário não autenticado.' });
}
// Decodifica o token e verifica se o usuário é válido
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const userId = decoded.id;

// Consulta os dados do usuário no banco de dados
const user = await User.findByPk(userId);
if (!user) {
  return res.status(401).json({ error: 'Usuário não autenticado.' });
}

// Verifica se o usuário tem permissão para acessar a lista
if (!user.podeAcessarLista) {
  return res.status(403).json({ error: 'Usuário não tem permissão para acessar a lista.' });
}

// Consulta a lista no banco de dados e retorna
const lista = await Lista.findAll();
res.json(lista);} catch (error) {
    console.log(error.message, error.stack);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
    };
    
    
    
    
    