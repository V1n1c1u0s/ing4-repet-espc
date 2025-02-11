import { Flashcard } from "./Flashcard.js";

export class Deck {
    constructor(nome) {
        this.nome = nome;
        this.cartoes = [];
        this.carregarCartoes();
    }

    adicionarCartao(pergunta, resposta) {
        if (!pergunta.trim() || !resposta.trim()) {
            console.error("A pergunta e a resposta não podem ser vazias.");
            return;
        }

        let cartao = new Flashcard(pergunta, resposta);
        this.cartoes.push(cartao);
        this.salvarCartoes();
    }

    removerCartao(indice) {
        if (indice < 0 || indice >= this.cartoes.length) {
            console.error("Índice de cartão inválido.");
            return;
        }

        this.cartoes.splice(indice, 1);
        this.salvarCartoes();
        console.log("Cartão removido com sucesso.");
    }

    salvarCartoes() {
        const cartoesSalvos = this.cartoes.map(cartao => ({
            pergunta: cartao.pergunta,
            resposta: cartao.resposta,
            facilidade: cartao.facilidade,
            intervalo: cartao.intervalo,
            repeticoes: cartao.repeticoes,
            proximaRevisao: cartao.proximaRevisao
        }));

        localStorage.setItem(`cartoes-${this.nome}`, JSON.stringify(cartoesSalvos));
    }

    carregarCartoes() {
        let cartoesSalvos = localStorage.getItem(`cartoes-${this.nome}`);
        if (cartoesSalvos) {
            let cartoesData = JSON.parse(cartoesSalvos);
            this.cartoes = cartoesData.map(cartao => {
                let flashcard = new Flashcard(cartao.pergunta, cartao.resposta);
                flashcard.facilidade = cartao.facilidade;
                flashcard.intervalo = cartao.intervalo;
                flashcard.repeticoes = cartao.repeticoes;
                flashcard.proximaRevisao = new Date(cartao.proximaRevisao);
                return flashcard;
            });
        }
    }

    revisarCartoes() {
        let hoje = new Date();
        let cartoesParaRevisao = this.cartoes.filter(cartao => cartao.proximaRevisao <= hoje);
        return cartoesParaRevisao;
    }

    avaliarCartao(cartaoIndex, respostaUsuario, avaliacao) {
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
        this.salvarCartoes();
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
