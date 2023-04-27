# Sobre o projeto

Este é um projeto Node.js para gerenciar transações financeiras. Ele permite o upload de arquivos csv contendo informações de transações e as armazena em um banco de dados. O projeto também inclui autenticação de usuários com login e logout.

# Como utilizar

Clone este repositório

Execute npm install para instalar as dependências do projeto

Crie um arquivo .env na raiz do projeto com as seguintes informações:

PORT=3000 
DB_HOST=seu_host_do_banco_de_dados  
DB_USER=seu_usuario_do_banco_de_dados 
DB_PASS=sua_senha_do_banco_de_dados 
DB_NAME=seu_nome_do_banco_de_dados  
JWT_SECRET=sua_chave_secreta_do_jwt 

Execute npm run dev para iniciar o servidor localmente em modo de desenvolvimento 

Abra http://localhost:3000 em seu navegador 

# Rotas
/ - exibe a página principal do projeto 
/user - exibe a página de usuário
/login - exibe a página de login  
/logout - realiza logout do usuário e redireciona para a página de login  
/cadastro - exibe a página de cadastro de usuário 

# Funcionalidades 

## Upload de arquivos CSV
A rota / permite o upload de arquivos CSV contendo informações de transações financeiras. As transações são armazenadas no banco de dados, e um registro é criado para indicar a data/hora da importação e o arquivo importado.

## Autenticação de usuários

O projeto inclui autenticação de usuários com login e logout. Os usuários são armazenados em um banco de dados, e as senhas são criptografadas com bcrypt. A rota /login permite que os usuários façam login no sistema, enquanto a rota /logout permite que os usuários saiam do sistema.

## Banco de dados
O projeto utiliza o Sequelize como ORM para acessar o banco de dados. Ele suporta vários bancos de dados SQL, incluindo MySQL, PostgreSQL e SQLite.

# Arquivos importantes
FileController.js - controlador responsável pela importação de arquivos CSV   
AuthController.js - controlador responsável pela autenticação de usuários   
UserController.js - controlador responsável pela criação do usuário padrão e renderização das páginas de login e cadastro   
Registro.js - modelo do Sequelize para registros de importação de arquivos CSV   
Transacao.js - modelo do Sequelize para transações financeiras     
User.js - modelo do Sequelize para usuários   
