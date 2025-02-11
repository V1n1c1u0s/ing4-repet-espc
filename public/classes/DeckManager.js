import { Deck } from './Deck.js';

export class DeckManager {
    constructor() {
        this.decks = [];
        this.carregarDecks();
    }

    criarDeck(nome) {
        const novoDeck = new Deck(nome);
        this.decks.push(novoDeck);
        this.salvarDecks();
        return novoDeck;
    }

    carregarDecks() {
        const decksSalvos = localStorage.getItem('decks');
        if (decksSalvos) {
            const decksData = JSON.parse(decksSalvos);
            this.decks = decksData.map(deckData => {
                const deck = new Deck(deckData.nome);
                deck.carregarCartoes();
                return deck;
            });
        }
    }

    salvarDecks() {
        const decksSalvos = this.decks.map(deck => ({ nome: deck.getNome() }));
        localStorage.setItem('decks', JSON.stringify(decksSalvos));
    }

    obterDeck(nome) {
        return this.decks.find(deck => deck.getNome() === nome);
    }

    getDecks() {
        return this.decks;
    }
}
