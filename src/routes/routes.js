// Importa o controlador do arquivo
const FileController = require("../controllers/FileController");
const UserController = require("../controllers/UserController");
const User = require("../models/User")
const jwt = require('jsonwebtoken');

// Importa a configuração do multer
const upload = require("./../config/multer");

const AuthController = require('../controllers/AuthController');


// Exporta uma função que recebe a aplicação express como parâmetro
module.exports = (app) => {
    // Define a rota raiz da aplicação
    app.get("/", UserController.sendLogin);

    app.get("/cadastro", validateToken, UserController.sendCadastro);
    app.post("/cadastro", UserController.createUser);

    app.get("/home",validateToken, FileController.sendIndex);

    // Define a rota para receber o upload do arquivo
    app.post('/uploadFile', upload.single("file"), FileController.sendFile);
  
    // Define a rota para buscar os registros
    app.get('/registros',validateToken, FileController.getRegistros);
  
    // Define a rota para enviar a página com a lista de usuários cadastrados
     app.get('/user', validateToken, UserController.sendUserList);
  
    // Define a rota para enviar a página com o formulário de edição de usuário
    app.get('/user/edit/:id', validateToken, UserController.sendUserForm);

    // Define a rota para processar a edição de usuário
    app.post('/user/edit', validateToken, UserController.editUser);
  
    // Define a rota para processar a exclusão de usuário
    app.post("/user/delete/:id", validateToken, UserController.deleteUser);

    app.get("/analise-transacoes", validateToken, FileController.getAnaliseTransacoes);


    //app.get("/detalhe-transacao/:id", validateToken, FileController.showRegisterDetails);
    app.get("/detalhe-transacao/:id", validateToken, FileController.showRegisterDetails, (req, res) => {
      const { listaTransacao, listaRegistro } = req;
      res.render("transacoes-importacao", { listaTransacao, listaRegistro });
    });
    

    app.post('/login', AuthController.login);
    app.get('/logout', AuthController.logout);
    // app.get("/detalhe-transacao/:id", (req, res) => {
      //const { listaTransacao, listaRegistro } = req.detalhes;
    //   res.render('transacoes-importacao', { listaTransacao, listaRegistro });
    // });

    app.get('/analise-transacoes', (req, res) => {
      res.render('analise-transacoes'); // renderiza a tela de análise de transações
    });
    const TransacaoController = require('../controllers/TransacaoController');

    app.post('/analise-transacoes', TransacaoController.analisaTransacoes);



  };

  const validateToken = async (req, res, next) => {
    // Verifique se o token de login é válido
    const token = req.cookies.token;
    if (!token) return res.render('login');
  
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decodedToken.id);
      if (!user || user.status === 0) {
        return res.render('login');
      }
      next();
    } catch (error) {
      res.status(401).send({ error: 'Não autorizado' });
      return;
    }
  };
  