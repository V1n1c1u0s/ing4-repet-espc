// routes/decks.js
const express = require('express');
const Deck = require('../Model/Deck');
const Flashcard = require('../Model/Flashcard');
const router = express.Router();

// Listar todos os decks
router.get('/', async (req, res) => {
  try {
    const decks = await Deck.findAll({
      include: Flashcard, // Incluir os flashcards relacionados
    });
    res.json(decks);
  } catch (error) {
    res.status(500).send('Erro ao listar decks');
  }
});

// Criar um novo deck
router.post('/', async (req, res) => {
  const { nome } = req.body;
  try {
    const novoDeck = await Deck.create({ nome });
    res.status(201).json(novoDeck);
  } catch (error) {
    res.status(500).send('Erro ao criar deck');
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deck = await Deck.findByPk(id, { include: Flashcard });  // Incluir flashcards associados
    if (deck) {
      await Flashcard.destroy({ where: { deckId: id } });  // Excluir flashcards primeiro
      await deck.destroy();  // Depois excluir o deck
      res.status(204).send();
    } else {
      res.status(404).send('Deck não encontrado');
    }
  } catch (error) {
    console.error('Erro ao excluir o deck e flashcards:', error);
    res.status(500).send('Erro ao excluir deck');
  }
});


module.exports = router;
