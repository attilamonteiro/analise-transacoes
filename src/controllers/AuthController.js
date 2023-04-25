const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Armazene o token em um cookie seguro
    res.cookie('token', token, { httpOnly: true, secure: true });
    return res.redirect('/user')
  } catch (error) {console.log(error.message, error.stack)
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.logout = async(req, res) => {
  //res.cookie('token', " ", { httpOnly: true, secure: true });
  res.clearCookie('token')
  res.status(200).json({message: 'logout realizado com sucesso!'})
}