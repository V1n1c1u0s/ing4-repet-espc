// Desabilitar verificação de certificados SSL (apenas para desenvolvimento)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const fs = require('fs');
const https = require('https');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const cookieParser = require('cookie-parser');

/*const options = {
    key: fs.readFileSync('private-key.key'),
    cert: fs.readFileSync('certificate.crt'),
};*/

const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem')
};


https.createServer(options, app).listen(port, () => {
    console.log('Servidor HTTPS rodando em https://localhost:3001');
});

// Middleware - parseia os dados do corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware - configura sessão
/*app.use(session({
    secret: 'minha_chave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        secure: true,    // Apenas se estiver usando HTTPS
        sameSite: "None",
        maxAge: 60 * 60 * 1000 // Expira em 1 hora
    }
}));*/

app.use(cookieParser());

app.get('/', async (req, res) => {
    if (!req.cookies.token) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'public', 'meusDecks.html'));
});

app.get('/login', async (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/');
    }
   
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/cadastro', (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

app.get('/logout', async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      return res.redirect('/login');
});

app.get('/decks/:id', async (req, res) => {
    if (!req.cookies.token) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'public', 'flashcard.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html')); 
});