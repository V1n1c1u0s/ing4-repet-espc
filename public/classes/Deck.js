import { Flashcard } from "./Flashcard.js";

export class Deck {
    constructor(nome) {
        this.nome = nome;
        this.cartoes = [];
        //this.carregarCartoes();
    }

    async adicionarCartao(pergunta, resposta, deckNome) {
        if (!pergunta.trim() || !resposta.trim()) {
            console.error("A pergunta e a resposta não podem ser vazias.");
            return;
        }
    
        // Cria o novo cartão, mas não adiciona ainda à memória
        let cartao = new Flashcard(pergunta, resposta);

        /*const decks = deckManager.getDecks();
        const indiceDeck = decks.findIndex(deck => deckNome === deck.getNome());

        if (indiceDeck !== -1) {
            const deck = decks[indiceDeck];*/
            // Enviar o novo cartão para o banco de dados
            const response = await fetch(`http://localhost:3001/api/cartoes/${deckNome}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pergunta: cartao.pergunta,
                    resposta: cartao.resposta,
                    facilidade: cartao.facilidade,
                    intervalo: cartao.intervalo,
                    repeticoes: cartao.repeticoes,
                    proximaRevisao: cartao.proximaRevisao
                })
            });
        
            if (response.ok) {
                const data = await response.json();
        
                // Atribui o ID retornado do banco ao cartão
                cartao.id = data.id;
        
                // Agora que o cartão tem um ID, podemos adicionar à memória local
                this.cartoes.push(cartao);
            } else {
                const errorData = await response.json();
                console.error("Erro ao adicionar o cartão ao banco de dados", errorData);
            }
            
        //}
    
    }
    

    async removerCartao(indice) {
        if (indice < 0 || indice >= this.cartoes.length) {
            console.error("Índice de cartão inválido.");
            return;
        }

        const cartao = this.cartoes[indice];
        
        // Remover do banco de dados
        await fetch(`http://localhost:3001/api/cartoes/${cartao.id}`, {
            method: 'DELETE',
        });

        this.cartoes.splice(indice, 1);
        console.log("Cartão removido com sucesso.");
    }

    // Salvar os cartões no banco de dados após alterações
    async salvarCartoes(deckId) {
        for (let cartao of this.cartoes) {
            await fetch(`http://localhost:3001/api/cartoes/${deckId}/${cartao.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pergunta: cartao.pergunta,
                    resposta: cartao.resposta,
                    facilidade: cartao.facilidade,
                    intervalo: cartao.intervalo,
                    repeticoes: cartao.repeticoes,
                    proximaRevisao: cartao.proximaRevisao
                })
            });
        }
    }

    async carregarCartoes(deckId) {
        try {
            //const response = await fetch(`http://localhost:3001/api/cartoes/${this.nome}`);
            const response = await fetch(`http://localhost:3001/api/cartoes/${deckId}/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error(`Erro ao carregar cartões do deck: ${response.statusText}`);
            }
    
            const cartoesData = await response.json();
            
            // Atualizar os cartões locais com os dados recebidos do servidor
            this.cartoes = cartoesData.map(cartao => {
                let flashcard = new Flashcard(cartao.pergunta, cartao.resposta);
                flashcard.id = cartao.id;
                flashcard.facilidade = cartao.facilidade;
                flashcard.intervalo = cartao.intervalo;
                flashcard.repeticoes = cartao.repeticoes;
                flashcard.proximaRevisao = new Date(cartao.proximaRevisao);
                return flashcard;
            });
        } catch (error) {
            console.error("Erro ao carregar os cartões:", error);
        }
    }
    

    revisarCartoes() {
        let hoje = new Date();
        let cartoesParaRevisao = this.cartoes.filter(cartao => cartao.proximaRevisao <= hoje);
        return cartoesParaRevisao;
    }

    avaliarCartao(deckId, cartaoIndex, respostaUsuario, avaliacao) {
        if (cartaoIndex < 0 || cartaoIndex >= this.cartoes.length) {
            console.error("Índice de cartão inválido.");
            return;
        }

        if (avaliacao < 0 || avaliacao > 5) {
            console.error("Avaliação deve ser entre 0 e 5.");
            return;
        }

        let cartao = this.cartoes[cartaoIndex];

        if (respostaUsuario.trim().toLowerCase() !== cartao.resposta.trim().toLowerCase()) {
            console.log("Resposta incorreta! A resposta correta é: " + cartao.resposta);
        } else {
            console.log("Resposta correta!");
        }

        cartao.atualizarRevisao(avaliacao);
        this.salvarCartoes(deckId);
    }

    getNome() {
        return this.nome;
    }

    getQuantidadeCartoes() {
        return this.cartoes.length;
    }

    getQuantidadeParaRevisao() {
        return this.revisarCartoes().length;
    }
}
