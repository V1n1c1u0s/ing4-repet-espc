// server.js
// Desabilitar verificação de certificados SSL (apenas para desenvolvimento)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const OpenAI = require("openai");
require('dotenv').config();

const openai  = new OpenAI({
  apiKey: process.env.API_KEY
});
const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const { authenticate } = require('./database');
const User = require('./Model/User');
const Deck = require('./Model/Deck');
const Flashcard = require('./Model/Flashcard');
const decksRoutes = require('./routes/decks');
const flashcardsRoutes = require('./routes/flashcards');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { Domain } = require("domain");

const app = express();
const port = 3001;

const options = {
    key: fs.readFileSync('private-key.key'),
    cert: fs.readFileSync('certificate.crt'),
};

https.createServer(options, app).listen(port, () => {
  console.log('Servidor HTTPS rodando em https://localhost:3001');
});

app.use(cors({
  origin: "https://localhost:3000", //permite reqs do front
  credentials: true //permite envio de cookies
}));
app.use(express.json());

app.use(cookieParser());
app.use(session({
  secret: 'minha_chave_secreta', // dps ajeitar
  resave: false,
  saveUninitialized: true,
  cookie: { 
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 60 * 60 * 1000
   }
}));

authenticate().then(async () => {
  await Deck.sync();
  await Flashcard.sync();
  await User.sync();
  console.log('Banco de dados sincronizado');
});

app.post('/api/prompt', async (req, res) => {
  const { prompt } = req.body;

  const response = await openai.chat.completions.create({
    model:"gpt-4o-mini",  // Você pode usar modelos como "gpt-4" ou "gpt-3.5-turbo"
    messages:[
        {"role": "system", "content": "Você é um assistente útil."},
        {"role": "user", "content": prompt}
    ]
  });

  res.send(response.choices[0].message.content);

});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword });
  res.status(201).json({ message: 'Usuário registrado com sucesso' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ username }, 'secreta', { expiresIn: '1h' });

  //req.session.token = token;
  // Armazena o token no cookie HttpOnly
  res.cookie("token", token, {
    httpOnly: true, // Protege contra XSS
    secure: true, // Apenas HTTPS (false para desenvolvimento local)
    sameSite: "None", // Proteção contra CSRF
    maxAge: 60 * 60 * 1000, // Expira em 1 hora
  });

  //res.json({ token });
  res.json({ message: "Login bem-sucedido" });
});

app.post("/logout", (req, res) => {
  console.log(req.cookies);
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  req.session.destroy();
  res.json({ message: "Logout realizado com sucesso" });
});

const authenticateToken = (req, res, next) => {
  //const token = req.header('Authorization');
  //const token = req.session.token;
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Acesso negado' });

  jwt.verify(token, 'secreta', (err, user) => {
      if (err) return res.status(403).json({ message: 'Token inválido' });
      req.user = user;
      next();
  });
};

app.use('/api/decks', authenticateToken, decksRoutes);
app.use('/api/cartoes', authenticateToken, flashcardsRoutes);