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

  const createDefaultUser = async () => {
    try {
      const saltRounds = 10;
      const password = '123999';
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const [user, created] = await User.findOrCreate({
        where: {
          email: 'admin@email.com.br'
        },
        defaults: {
          nome: 'Admin',
          email: 'admin@email.com.br',
          senha: hashedPassword
        }
      });
  
      if (created) {
        console.log('Usuário padrão criado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao criar usuário padrão:', err);
    }
  };
  createDefaultUser();
//antigo
// Cria usuário padrão se não existir 
//User.findOrCreate({ where: { email: 'admin@email.com.br'}, defaults: { nome: 'Admin', email: 'admin@email.com.br', senha: '123999' } }).then(([user, created]) => { if (created) { console.log('Usuário padrão criado com sucesso!'); } }).catch(error => { console.log('Erro ao criar usuário padrão:', error); });

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
  try {
    const { id } = req.params;
    let user;
    if (id) {
      user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({ error: 'Usuário não encontrado.' });
      }
    }
    res.render("user/form", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Ocorreu um erro ao enviar o formulário de usuário." });
  }
};

// Função para criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    const { nome, email } = req.body;

    // Verifica se o email já existe no banco de dados
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ message: "Este e-mail já está cadastrado." });
    }

    // Gera a senha aleatória
    const password = Math.floor(Math.random() * 900000) + 100000;

    // Criptografa a senha com o algoritmo BCrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);

    // Cria o usuário com as informações fornecidas e a senha criptografada
    const user = await User.create({ nome, email, senha: hashedPassword });

    // Configura o transporte de e-mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "atmaload@gmail.com",
        pass: "senha do gmail",
      },
    });

    // Configura as opções de e-mail
    const mailOptions = {
      from: "atmaload@gmail.com",
      to: email,
      subject: "Sua senha de acesso à aplicação",
      text: `Sua senha é: ${password}`,
    };

    // Envia o e-mail para o usuário
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email enviado: " + info.response);
      }
    });

    res.redirect("/user");
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Ocorreu um erro ao criar o usuário." });
  }
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
    const [updatedRowsCount] = await User.update(
      { nome, email },
      { where: { id } }
    );

    if (updatedRowsCount === 0) {
      res.status(404).send({ error: 'Usuário não encontrado.' });
    } else {
      res.send({ message: 'Usuário editado com sucesso.' });
    }
  }
};

//Função para excluir um usuário existente
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (parseInt(id) === req.user?.id) {
    res.status(400).send({ error: 'Você não pode excluir a si mesmo.' });
  } else {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      res.status(404).send({ error: 'Usuário não encontrado.' });
    } else if (user.status === 0) {
      res.status(400).send({ error: 'Usuário já está desativado.' });
    } else if (user.email === 'admin@email.com.br') {
      res.status(400).send({ error: 'O usuário administrador não pode ser desativado.' });
    } else {
      user.status = 0;
      await user.save();
      res.send({ message: 'Usuário desativado com sucesso.' });
    }
  }
};
//Agora ao chamar a função deleteUser, o usuário será desativado ao invés de ser excluído do banco de dados. O status do usuário será atualizado para "0" indicando que o usuário está inativo.






