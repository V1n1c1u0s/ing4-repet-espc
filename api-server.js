// server.js
const OpenAI = require("openai");
require('dotenv').config();

const openai  = new OpenAI({
  apiKey: process.env.API_KEY
});

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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
