const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const { Op } = require("sequelize");




exports.sendLogin = async (req, res) => {
    res.render("login");
  };
exports.sendCadastro = async (req, res) => {
    res.render("cadastro");
  };

  
// Cria usuário padrão se não existir
const saltRounds = 10;

bcrypt.hash('123999', saltRounds, (err, hash) => {
  if (err) {
    console.log('Erro ao criptografar a senha:', err);
  } else {
    User.findOrCreate({
      where: { email: 'admin@email.com.br'},
      defaults: {
        nome: 'Admin',
        email: 'admin@email.com.br',
        senha: hash
      }
    }).then(([user, created]) => {
      if (created) {
        console.log('Usuário padrão criado com sucesso!');
      }
    }).catch(error => {
      console.log('Erro ao criar usuário padrão:', error);
    });
  }
});
//antigo
// Cria usuário padrão se não existir User.findOrCreate({ where: { email: 'admin@email.com.br'}, defaults: { nome: 'Admin', email: 'admin@email.com.br', senha: '123999' } }).then(([user, created]) => { if (created) { console.log('Usuário padrão criado com sucesso!'); } }).catch(error => { console.log('Erro ao criar usuário padrão:', error); });

// Função para enviar a página com a lista de usuários cadastrados
exports.sendUserList = async (req, res) => {
  try {
  const user = await User.findAll({ where: { email: { [Op.ne]: 'admin@email.com.br' } } });
  res.render('usuarios', { user });
  //res.json(userList.map(item => ({id:item.id, nome:item.nome, email:item.email})))
} catch (err) {
  console.error(err);
  res.status(500).send({ message: 'Erro ao enviar usuários' });
}
};


// Função para enviar a página com o formulário de cadastro/edição de usuário
exports.sendUserForm = async (req, res) => {
const { id } = req.params;
if (id) {
const user = await User.findByPk(id);
res.render("user/form", { user });
} else {
res.render("user/form");
}
};

// Função para criar um novo usuário
exports.createUser = async (req, res) => {
  const { nome, email } = req.body;

  // Verifica se o email já existe no banco de dados
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).send({ message: "Este e-mail já está cadastrado." });
  }

  // Gera a senha aleatória
  const password = Math.floor(Math.random() * 900000) + 100000;

  // Criptografa a senha com o algoritmo BCrypt
  const hashedPassword = await bcrypt.hash(password.toString(), 10);

  // Cria o usuário com as informações fornecidas e a senha criptografada
  const user = await User.create({ nome, email, senha: hashedPassword }); // adicionado "senha" aqui

  // Envia a senha por e-mail para o usuário
  // const transporter = nodemailer.createTransport({
  // service: "gmail",
  // auth: {
  //   user: 'atmaload@gmail.com',
  //   pass: "",
  //   },
  // });
  // const mailOptions = {
  //   from: 'atmaload@gmail.com',
  //   to: email,
  //   subject: "Sua senha de acesso à aplicação",
  //   text: `Sua senha é: ${password}`,
  // };
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email enviado: " + info.response);
  //   }
  // });

  res.redirect("/user");
};


// Função para processar a edição de usuário
exports.editUser = async (req, res) => {
  const { id, nome, email } = req.body;
  const userExists = await User.findOne({
    where: {
      email: email,
      id: {
        [Op.ne]: id
      }
    }
  });

  if (userExists) {
    res.status(400).send({ error: 'Já existe um usuário com este email.' });
  } else {
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).send({ error: 'Usuário não encontrado.' });
    } else {
      user.nome = nome;
      user.email = email;
      await user.save();

      res.send({ message: 'Usuário editado com sucesso.' });
    }
  }
};

//Função para excluir um usuário existente
exports.deleteUser = async (req, res) => {
const { id } = req.params;
if (req.user && parseInt(id) === req.user.id) {
  res.status(400).send({ error: 'Você não pode excluir a si mesmo.' });
} else {
const user = await User.findByPk(id);

if (!user) {
res.status(404).send({ error: 'Usuário não encontrado.' });
} else if (user.email === 'admin@email.com.br') {
res.status(400).send({ error: 'Este usuário não pode ser excluído.' });
} else {
await user.destroy();
res.send({ message: 'Usuário excluído com sucesso.' });
}
}
};