import { DeckManager } from './classes/DeckManager.js';

const deckManager = new DeckManager();

const areaDecks = document.getElementById("areaDecks");
const deckList = document.getElementById("deckList");
const novoDeckBtn = document.getElementById("novoDeckBtn");
const cartaoContainer = document.getElementById("cartaoContainer");
const adicionarCartaoBtn = document.getElementById("adicionarCartaoBtn");
const formularioAdicionarCartao = document.getElementById("formularioAdicionarCartao");
const perguntaInput = document.getElementById("pergunta");
const respostaInput = document.getElementById("resposta");
const salvarCartaoBtn = document.getElementById("salvarCartaoBtn");
const cancelarCartaoBtn = document.getElementById("cancelarCartaoBtn");
const respostaContainer = document.getElementById("respostaContainer");
const respostaUsuarioInput = document.getElementById("respostaUsuario");
const avaliarBtn = document.getElementById("avaliarBtn");
const resultadoRevisao = document.getElementById("resultadoRevisao");
const proximoBtn = document.getElementById("proximoBtn");
const removerBtn = document.getElementById("removerBtn");

let deckSelecionado = null;
let indiceCartaoAtual = 0;

function exibirDecks() {
    deckList.innerHTML = "";
    const decks = deckManager.getDecks();

    if (decks.length === 0) {
        deckList.innerHTML = "<p>Não há decks disponíveis. Crie um novo deck!</p>";
        return;
    }

    decks.forEach(deck => {
        const deckDiv = document.createElement("div");
        
        const deckBtn = document.createElement("button");
        deckBtn.textContent = deck.getNome();
        deckBtn.onclick = () => selecionarDeck(deck);

        const removerDeckBtn = document.createElement("button");
        removerDeckBtn.textContent = "Remover";
        removerDeckBtn.onclick = () => removerDeck(deck.getNome());

        deckDiv.appendChild(deckBtn);
        deckDiv.appendChild(removerDeckBtn);
        
        deckList.appendChild(deckDiv);
    });
}

function removerDeck(nome) {
    const confirmarRemocao = confirm("Você tem certeza de que deseja remover este deck?");
    if (confirmarRemocao) {
        deckManager.removerDeck(nome);
        exibirDecks();
    }
}

function selecionarDeck(deck) {
    deckSelecionado = deck;
    cartaoContainer.innerHTML = `<h3>Deck Selecionado: ${deck.getNome()}</h3>`;
    adicionarCartaoBtn.style.display = "inline-block";  // Mostrar o botão de adicionar cartão
    exibirCartoesDoDeck();
}

function exibirCartoesDoDeck() {
    if (!deckSelecionado || deckSelecionado.cartoes.length === 0) {
        cartaoContainer.innerHTML += "<p>Não há flashcards para este deck. Adicione novos cartões!</p>";
        return;
    }

    const cartao = deckSelecionado.cartoes[indiceCartaoAtual];
    cartaoContainer.innerHTML = `<h4>Pergunta: ${cartao.pergunta}</h4>`;
    
    respostaContainer.style.display = "block";
    resultadoRevisao.innerHTML = "";
    avaliarBtn.style.display = "inline-block";
    proximoBtn.style.display = "none";
    removerBtn.style.display = "inline-block";

    respostaUsuarioInput.value = "";
}

novoDeckBtn.addEventListener("click", () => {
    const nomeDeck = prompt("Digite o nome do novo deck:");
    if (nomeDeck) {
        deckManager.criarDeck(nomeDeck);
        exibirDecks();
    }
});

// Mostrar os decks ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    exibirDecks();
});

adicionarCartaoBtn.addEventListener("click", () => {
    if (!deckSelecionado) {
        alert("Por favor, selecione um deck primeiro!");
        return;
    }
    formularioAdicionarCartao.style.display = "block";
});

salvarCartaoBtn.addEventListener("click", () => {
    if (!deckSelecionado) {
        alert("Por favor, selecione um deck primeiro!");
        return;
    }

    const pergunta = perguntaInput.value.trim();
    const resposta = respostaInput.value.trim();

    if (pergunta === "" || resposta === "") {
        alert("Por favor, preencha ambos os campos!");
        return;
    }

    deckSelecionado.adicionarCartao(pergunta, resposta);

    perguntaInput.value = "";
    respostaInput.value = "";
    formularioAdicionarCartao.style.display = "none";

    alert("Cartão adicionado com sucesso!");
    exibirCartoesDoDeck();
});

// Cancelar a adição de cartão
cancelarCartaoBtn.addEventListener("click", () => {
    perguntaInput.value = "";
    respostaInput.value = "";
    formularioAdicionarCartao.style.display = "none";
});

// Avaliar a resposta
avaliarBtn.addEventListener("click", () => {
    if (!deckSelecionado || indiceCartaoAtual >= deckSelecionado.cartoes.length) {
        alert("Não há mais flashcards para revisar.");
        return;
    }

    const cartao = deckSelecionado.cartoes[indiceCartaoAtual];
    const respostaUsuario = respostaUsuarioInput.value.trim();
    const avaliacao = parseInt(document.querySelector('input[name="avaliacao"]:checked').value);

    if (respostaUsuario === "") {
        alert("Por favor, insira uma resposta antes de avaliar.");
        return;
    }

    const respostaCorreta = cartao.resposta.trim().toLowerCase();
    const respostaUsuarioCorreta = respostaUsuario.toLowerCase();

    if (respostaUsuarioCorreta === respostaCorreta) {
        resultadoRevisao.innerHTML = "<span style='color: green;'>Resposta correta!</span>";
    } else {
        resultadoRevisao.innerHTML = `<span style='color: red;'>Resposta incorreta! A resposta correta era: ${cartao.resposta}</span>`;
    }

    // Atualizar a revisão do cartão com a avaliação
    deckSelecionado.avaliarCartao(indiceCartaoAtual, respostaUsuario, avaliacao);

    avaliarBtn.style.display = "none";
    proximoBtn.style.display = "inline-block";
});

proximoBtn.addEventListener("click", () => {
    if (indiceCartaoAtual < deckSelecionado.cartoes.length - 1) {
        indiceCartaoAtual++;
        exibirCartoesDoDeck();  // Exibir o próximo flashcard
    } else {
        alert("Você concluiu a revisão de todos os cartões!");
        indiceCartaoAtual = 0;  // Resetar o índice pra poder revisar novamente
        exibirCartoesDoDeck();
    }
});

// Remover o cartão atual
removerBtn.addEventListener("click", () => {
    deckSelecionado.removerCartao(indiceCartaoAtual);

    if (indiceCartaoAtual < deck.cartoes.length) {
      exibirCartaoParaRevisao();
    } else {
      cartaoContainer.innerHTML = "<p>Não há mais cartões para revisão.</p>";
      respostaContainer.style.display = "none";
      resultadoRevisao.innerHTML = "";
    }
  });
