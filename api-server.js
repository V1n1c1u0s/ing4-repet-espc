// server.js
const express = require('express');
const cors = require('cors');
const { authenticate } = require('./database');
const Deck = require('./Model/Deck');
const Flashcard = require('./Model/Flashcard');
const decksRoutes = require('./routes/decks');
const flashcardsRoutes = require('./routes/flashcards');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Conectar ao banco de dados e sincronizar os modelos
authenticate().then(async () => {
  await Deck.sync(); // Cria a tabela de Decks
  await Flashcard.sync(); // Cria a tabela de Flashcards
  console.log('Banco de dados sincronizado');
});

// Definir as rotas
app.use('/api/decks', decksRoutes);
app.use('/api/cartoes', flashcardsRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
