const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('./Database'); // Importe a classe Database

const app = express();
const port = 3000;

// Criação da instância do banco de dados
const db = new Database();

// Middleware para parsear os dados do corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware para configurar a sessão
app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: true,
}));

// Rota para a página principal (só pode ser acessada se o usuário estiver logado)
app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

// Rota de login (GET exibe o formulário de login)
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota de login (POST processa os dados do formulário de login)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.login(username, password, (err, user) => {
        if (err) return res.send('Erro no servidor.');
        if (user) {
            req.session.user = user;
            return res.redirect('/');
        }
        res.send('Usuário ou senha incorretos');
    });
});

// Rota de cadastro (GET exibe o formulário de cadastro)
app.get('/cadastro', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

// Rota de cadastro (POST processa os dados do formulário de cadastro)
app.post('/cadastro', (req, res) => {
    const { username, password } = req.body;

    db.register(username, password, (err, result) => {
        if (err) return res.send('Erro no servidor.');
        res.send(result);
    });
});

// Rota de logout (GET)
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Erro ao deslogar.');
        }
        res.redirect('/login');
    });
});

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Captura de todas as rotas não definidas (Erro 404)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
