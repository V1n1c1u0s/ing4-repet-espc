// routes/decks.js
const express = require('express');
const Deck = require('../Model/Deck');
const Flashcard = require('../Model/Flashcard');
const router = express.Router();
const { Op } = require('sequelize');

// Listar meus decks
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const decks = await Deck.findAll({
      where: { userId },
      include: Flashcard, // Incluir os flashcards relacionados
    });
    res.json(decks);
  } catch (error) {
    res.status(500).send('Erro ao listar decks');
  }
});

router.get('/:deckId', async (req, res) => {
  const dataAtual = new Date();
  const { deckId } = req.params;
  try {
    // Encontra o deck pelo ID
    const deck = await Deck.findByPk(deckId, {
      include: {
        model: Flashcard,
        where: { proximaRevisao: { [Op.lte]: dataAtual } },
        required: false, //Não exclui o deck caso não seja <= dataAtual
      },
    });
    if (!deck) {
      return res.status(404).send('Deck não encontrado');
    }
    res.status(200).json(deck);
  } catch (error) {
    console.error('Erro ao mostrar deck:', error);
    res.status(500).send('Erro ao mostrar deck');
  }
});

// Criar um novo deck
router.post('/', async (req, res) => {
  const { nome } = req.body;
  try {
    const novoDeck = await Deck.create({ nome: nome, userId: req.user.userId });
    res.status(201).json(novoDeck);
  } catch (error) {
    res.status(500).send('Erro ao criar deck');
  }
});

// Rota PUT para editar o deck
router.put('/:deckId', async (req, res) => {
  const { deckId } = req.params; // Obtém o parâmetro deckId
  const { nome } = req.body; // Obtém o novo nome do deck

  try {
    // Encontra o deck pelo ID
    const deck = await Deck.findByPk(deckId);
    if (!deck) {
      return res.status(404).send('Deck não encontrado');
    }

    // Atualiza os campos do deck com os dados da requisição
    deck.nome = nome || deck.nome; // Se o nome não for passado, mantém o valor atual

    // Salva as mudanças no banco de dados
    await deck.save();

    // Retorna o deck atualizado
    res.status(200).json(deck);
  } catch (error) {
    console.error('Erro ao atualizar deck:', error);
    res.status(500).send('Erro ao atualizar deck');
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
