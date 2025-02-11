// models/Deck.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Flashcard = require('./Flashcard');

const Deck = sequelize.define('Deck', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Definir o relacionamento entre Deck e Flashcard (1:N)
Deck.hasMany(Flashcard, { foreignKey: 'deckId', onDelete: 'CASCADE' });
Flashcard.belongsTo(Deck, { foreignKey: 'deckId' });

module.exports = Deck;
