// models/Flashcard.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Flashcard = sequelize.define('Flashcard', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pergunta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resposta: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  facilidade: {
    type: DataTypes.FLOAT,
    defaultValue: 2.5,
  },
  intervalo: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  repeticoes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  proximaRevisao: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Flashcard;
