// Importa o controlador do arquivo
const FileController = require("../controllers/FileController");
const UserController = require("../controllers/UserController");
const jwt = require('jsonwebtoken');

// Importa a configuração do multer
const upload = require("./../config/multer");

const AuthController = require('../controllers/AuthController');


// Exporta uma função que recebe a aplicação express como parâmetro
module.exports = (app) => {
    // Define a rota raiz da aplicação
    app.get("/", UserController.sendLogin);

    app.get("/cadastro", UserController.sendCadastro);
    app.post("/cadastro", UserController.createUser);

    app.get("/home", FileController.sendIndex);

    // Define a rota para receber o upload do arquivo
    app.post('/uploadFile', upload.single("file"), FileController.sendFile);
  
    // Define a rota para buscar os registros
    app.get('/registros', FileController.getRegistros);
  
    // Define a rota para enviar a página com a lista de usuários cadastrados
     app.get('/user', validateToken, UserController.sendUserList);
  
    // Define a rota para enviar a página com o formulário de edição de usuário
    app.get('/user/edit/:id', UserController.sendUserForm);

    // Define a rota para processar a edição de usuário
    app.post('/user/edit', UserController.editUser);
  
    // Define a rota para processar a exclusão de usuário
    app.post("/user/delete/:id", UserController.deleteUser);

    app.post('/login', AuthController.login);
    app.get('/logout', AuthController.logout);
    

  };

const validateToken = async (req, res, next) => {
  // Verifique se o token de login é válido
  const token = req.cookies.token;
  if (!token) return res.render('login')

  if ( !jwt.verify(token, process.env.JWT_SECRET)) {
    res.status(401).send({ error: 'Não autorizado' });
    return;
  }
  next()
}