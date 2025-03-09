// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const Deck = require("./Deck");


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

User.hasMany(Deck, { foreignKey: 'userId', onDelete: 'CASCADE' });
Deck.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;