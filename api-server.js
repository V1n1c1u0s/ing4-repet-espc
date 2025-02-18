// server.js
const OpenAI = require("openai");

const openai  = new OpenAI({
    apiKey: "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"
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
