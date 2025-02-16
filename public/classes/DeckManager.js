import { Deck } from './Deck.js';

export class DeckManager {
    constructor() {
        this.decks = [];
        this.carregarDecks();
    }

    async criarDeck(nome) {
        const novoDeck = new Deck(nome);
        
        try {
            // Enviar para o servidor para criar o deck no banco de dados
            const response = await fetch('http://localhost:3001/api/decks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome })
            });
    
            // Verifica se a resposta foi bem-sucedida
            if (response.ok) {
                const data = await response.json();
                novoDeck.id = data.id;  // Atribui o ID gerado pelo banco
    
                // Agora que o deck tem um ID, podemos adicioná-lo à lista de decks locais
                this.decks.push(novoDeck);
                return novoDeck;
            } else {
                console.error("Erro ao criar o deck no servidor");
                return null;
            }
        } catch (error) {
            console.error("Erro ao comunicar com o servidor:", error);
            return null;
        }
    }
    
   
    async carregarDecks() {
        const response = await fetch('http://localhost:3001/api/decks', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const decksData = await response.json();

        if(!response.ok){
            console.log(decksData);
            console.log("Erro ao ler");
            return;
        }
            
        // Preenche os decks com os dados do banco
        this.decks = await Promise.all(decksData.map(async (deckData) => {
            const deck = new Deck(deckData.nome);
            deck.id = deckData.id;
            await deck.carregarCartoes(deck.id);
            //await deck.carregarCartoes(deck.id);
            return deck;
        }));
    }

    // Esta função não é mais necessária porque estamos interagindo com o banco diretamente
    salvarDecks() {
        // Você pode, por exemplo, decidir salvar os decks no localStorage para um cache local
        //localStorage.setItem('decks', JSON.stringify(this.decks));
    }

    async obterDeck(nome) {
        return this.decks.find(deck => deck.getNome() === nome);
    }

    getDecks() {
        return this.decks;
    }

    async removerDeck(nome) {
        const indiceDeck = this.decks.findIndex(deck => deck.getNome() === nome);
        if (indiceDeck !== -1) {
            const deck = this.decks[indiceDeck];
            
            // Remover do banco de dados
            await fetch(`http://localhost:3001/api/decks/${deck.id}`, {
                method: 'DELETE',
            });

            this.decks.splice(indiceDeck, 1);
        }
    }
}
