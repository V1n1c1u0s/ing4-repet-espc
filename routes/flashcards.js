// routes/flashcards.js
const express = require('express');
const Flashcard = require('../Model/Flashcard');
const Deck = require('../Model/Deck');
const router = express.Router();

// Listar todos os flashcards de um deck
router.get('/:deckId', async (req, res) => {
  const { deckId } = req.params;
  try {
    const deck = await Deck.findByPk(deckId, {
      include: Flashcard, // Incluir os flashcards relacionados
    });
    if (deck) {
      res.json(deck.Flashcards);
    } else {
      res.status(404).send('Deck não encontrado');
    }
  } catch (error) {
    res.status(500).send('Erro ao listar flashcards');
  }
});

// Criar um novo flashcard em um deck
router.post('/:deckId', async (req, res) => {
  const { deckId } = req.params;
  const { pergunta, resposta, facilidade, intervalo, repeticoes, proximaRevisao } = req.body;

  try {
    const deck = await Deck.findByPk(deckId);
    if (deck) {
      const novoFlashcard = await Flashcard.create({
        pergunta,
        resposta,
        facilidade: facilidade || 2.5,
        intervalo: intervalo || 1,
        repeticoes: repeticoes || 0,
        proximaRevisao: new Date("2025-03-01T13:15:30"),
        deckId
      });
      res.status(201).json(novoFlashcard);
    } else {
      res.status(404).send('Deck não encontrado');
    }
  } catch (error) {
    res.status(500).send('Erro ao criar flashcard');
  }
});

// Deletar um flashcard
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const flashcard = await Flashcard.findByPk(id);
    if (flashcard) {
      await flashcard.destroy();
      res.status(204).send();
    } else {
      res.status(404).send('Flashcard não encontrado');
    }
  } catch (error) {
    res.status(500).send('Erro ao excluir flashcard');
  }
});

module.exports = router;
