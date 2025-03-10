// routes/flashcards.js
const express = require('express');
const Flashcard = require('../Model/Flashcard');
const Deck = require('../Model/Deck');
const router = express.Router();

// Listar todos os flashcards de um deck
router.get('/:deckId', async (req, res) => {
  const { deckId } = req.params;
  console.log(deckId);
  //const { pergunta, resposta, facilidade, intervalo, repeticoes, proximaRevisao } = req.body;
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
        proximaRevisao,
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

// Rota para editar um flashcard existente
router.put('/:deckId/:flashcardId', async (req, res) => {
  const { deckId, flashcardId } = req.params; // Obtém os parâmetros de deckId e flashcardId
  const { pergunta, resposta, facilidade, intervalo, repeticoes, proximaRevisao } = req.body; // Obtém os dados do corpo da requisição
  try {
    const deck = await Deck.findByPk(deckId);
    if (!deck) return res.status(404).send('Deck não encontrado');

    const flashcard = await Flashcard.findOne({ where: { id: flashcardId, deckId: deckId } });

    if (!flashcard) return res.status(404).send('Flashcard não encontrado');

    flashcard.pergunta = pergunta || flashcard.pergunta;
    flashcard.resposta = resposta || flashcard.resposta;
    flashcard.facilidade = facilidade || flashcard.facilidade;
    flashcard.intervalo = intervalo || flashcard.intervalo;
    flashcard.repeticoes = repeticoes || flashcard.repeticoes;
    flashcard.proximaRevisao = proximaRevisao || flashcard.proximaRevisao;

    await flashcard.save();
    res.status(200).json(flashcard);
  } catch (error) {
    res.status(500).send('Erro ao atualizar flashcard');
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
