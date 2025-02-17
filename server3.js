const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const Deck = require('./Model/Deck');
const Flashcard = require('./Model/Flashcard');

// Middleware para parsear os dados do corpo das requisições
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware para configurar a sessão
app.use(session({
    secret: 'segredo',  //pra implementar
    resave: false,
    saveUninitialized: true,
}));

// Usuários fictícios
const users = [];

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user;
        return res.redirect('/');
    }

    //res.send('Usuário ou senha incorretos');
    res.status(401).json({ error: 'Usuário ou senha incorretos' });
});

app.get('/cadastro', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

app.post('/cadastro', (req, res) => {
    const { username, password } = req.body;

    const userExists = users.some(u => u.username === username);
    if (userExists) {
        //return res.send('Usuário já existe. Escolha outro nome de usuário.');
        res.status(401).json({ error: 'Usuário já existe. Escolha outro nome de usuário.' });
    }

    users.push({ username, password });
    //res.send('Cadastro realizado com sucesso. <a href="/login">Clique aqui para fazer login</a>');
    res.send('Cadastro realizado com sucesso.');
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

/*app.get('/*.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '404.html'));
});
/*
app.get('/*.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '404.html'));
});

app.get('/*.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '404.html'));
});*/
/*app.get(/^.*\.(html|js|css)$/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '404.html'));
});*/


app.get('/decks', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        const decks = await Deck.findAll({
          include: Flashcard, // Incluir os flashcards relacionados
        });
        res.json(decks);
      } catch (error) {
        res.status(500).send('Erro ao listar decks');
      }
});

app.get('/decks/:id', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        const deck = await Deck.findByPk(req.params.id, {
            include: Flashcard, // Incluir os flashcards relacionados
        });
        if (deck) {
            res.json(deck); // Ou renderize uma página de detalhes com as informações do deck
        } else {
            res.status(404).send('Deck não encontrado');
        }
    } catch (error) {
        res.status(500).send('Erro ao buscar o deck');
    }
});

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html')); 
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
