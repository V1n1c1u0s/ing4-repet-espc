/*async function loadCards() {
    const deckId = window.location.pathname.split('/')[2]; // Pega o ID do deck da URL
    try {
        const response = await fetch(`https://localhost:3001/api/decks/${deckId}`, {
            method: "GET",
            credentials: "include",
        });
        const deckData = await response.json();

        const deckContainer = document.getElementById('deckContainer');
        deckContainer.innerHTML = '';

        let currentFlashcardIndex = 0;

        function showFlashcard(index) {
            if (deckData.Flashcards.length === 0) {
                deckContainer.innerHTML = `
                    <h2>Sem Flashcards para estudar</h2>
                    <button class="adicionar-btn" onclick="mostrarCriacaoCard()">Adicionar Card</button>
                    <button class="voltar-btn" onclick="window.location.href='/'">Voltar</button>
                `;
                return;
            }
            if (index >= deckData.Flashcards.length) {
                deckContainer.innerHTML = `
                    <h2>Estudo Concluído!</h2>
                    <button class="adicionar-btn" onclick="mostrarCriacaoCard()">Adicionar Card</button>
                    <button class="voltar-btn" onclick="window.location.href='/'">Voltar</button>
                `;
                return;
            }

            const flashcard = deckData.Flashcards[index];
            const flashcardDiv = document.createElement('div');
            flashcardDiv.classList.add('flashcard');

            flashcardDiv.innerHTML = `
                <h1>${deckData.nome}</h1>
                <h2>${flashcard.pergunta}</h2>
                <hr class="divisao" style="display: none;">
                <h3 class="resposta" style="display: none;">${flashcard.resposta}</h3>
                <button class="verificar-btn">Verificar resposta</button>
                <button class="proximo-btn" style="display: none;">Próximo</button>
                <button class="editar-btn">Editar</button>
                <button class="remover-btn">Remover</button>
            `;
            
            deckContainer.appendChild(flashcardDiv);

            const verificarBtn = flashcardDiv.querySelector('.verificar-btn');
            const proximoBtn = flashcardDiv.querySelector('.proximo-btn');
            const resposta = flashcardDiv.querySelector('.resposta');
            const divisao = flashcardDiv.querySelector('.divisao');
            const removerBtn = flashcardDiv.querySelector('.remover-btn');
            const editarBtn = flashcardDiv.querySelector('.editar-btn');

            verificarBtn.onclick = function() {
                divisao.style.display = 'block';
                resposta.style.display = 'block';
                verificarBtn.style.display = 'none';
                proximoBtn.style.display = 'inline-block';
            };

            proximoBtn.onclick = function() {
                currentFlashcardIndex++;
                deckContainer.innerHTML = '';
                showFlashcard(currentFlashcardIndex);
            };

            removerBtn.onclick = async function() {
                await fetch(`https://localhost:3001/api/cartoes/${flashcard.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                
                currentFlashcardIndex++;
                deckContainer.innerHTML = '';
                showFlashcard(currentFlashcardIndex);
            };

            editarBtn.onclick = function() {
                mostrarEdicaoCard(flashcard);
            };
        }

        showFlashcard(currentFlashcardIndex);
    } catch (error) {
        console.error('Erro ao carregar as informações do deck:', error);
    }
};*/
async function loadCards() {
    const deckId = window.location.pathname.split('/')[2]; // Pega o ID do deck da URL
    try {
        const response = await fetch(`https://localhost:3001/api/decks/${deckId}`, {
            method: "GET",
            credentials: "include",
        });
        const deckData = await response.json();

        const deckContainer = document.getElementById('deckContainer');
        deckContainer.innerHTML = '';

        let currentFlashcardIndex = 0;

        function showFlashcard(index) {
            if (deckData.Flashcards.length === 0) {
                deckContainer.innerHTML = `
                    <h2>Sem Flashcards para estudar</h2>
                    <button class="adicionar-btn" onclick="mostrarCriacaoCard()">Adicionar Card</button>
                    <button class="voltar-btn" onclick="window.location.href='/'">Voltar</button>
                `;
                return;
            }
            if (index >= deckData.Flashcards.length) {
                deckContainer.innerHTML = `
                    <h2>Estudo Concluído!</h2>
                    <button class="adicionar-btn" onclick="mostrarCriacaoCard()">Adicionar Card</button>
                    <button class="voltar-btn" onclick="window.location.href='/'">Voltar</button>
                `;
                return;
            }

            const flashcard = deckData.Flashcards[index];
            const flashcardDiv = document.createElement('div');
            flashcardDiv.classList.add('flashcard');

            flashcardDiv.innerHTML = `
                <h1>${deckData.nome}</h1>
                <h2>${flashcard.pergunta}</h2>
                <hr class="divisao" style="display: none;">
                <h3 class="resposta" style="display: none;">${flashcard.resposta}</h3>
                <button class="verificar-btn">Verificar resposta</button>
                <button class="proximo-btn" style="display: none;">Próximo</button>
                <button class="editar-btn">Editar</button>
                <button class="remover-btn">Remover</button>
                <div class="resposta-opcoes" style="display: none;">
                    <button class="facil-btn">Fácil</button>
                    <button class="dificil-btn">Difícil</button>
                    <button class="errou-btn">Errou</button>
                </div>
            `;
            
            deckContainer.appendChild(flashcardDiv);

            const verificarBtn = flashcardDiv.querySelector('.verificar-btn');
            const proximoBtn = flashcardDiv.querySelector('.proximo-btn');
            const resposta = flashcardDiv.querySelector('.resposta');
            const divisao = flashcardDiv.querySelector('.divisao');
            const removerBtn = flashcardDiv.querySelector('.remover-btn');
            const editarBtn = flashcardDiv.querySelector('.editar-btn');
            const respostaOpcoes = flashcardDiv.querySelector('.resposta-opcoes');
            const facilBtn = flashcardDiv.querySelector('.facil-btn');
            const dificilBtn = flashcardDiv.querySelector('.dificil-btn');
            const errouBtn = flashcardDiv.querySelector('.errou-btn');

            verificarBtn.onclick = function() {
                divisao.style.display = 'block';
                resposta.style.display = 'block';
                verificarBtn.style.display = 'none';
                proximoBtn.style.display = 'inline-block';
                respostaOpcoes.style.display = 'block'; // Exibe as opções de dificuldade
            };

            proximoBtn.onclick = function() {
                currentFlashcardIndex++;
                deckContainer.innerHTML = '';
                showFlashcard(currentFlashcardIndex);
            };

            removerBtn.onclick = async function() {
                await fetch(`https://localhost:3001/api/cartoes/${flashcard.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
                
                currentFlashcardIndex++;
                deckContainer.innerHTML = '';
                showFlashcard(currentFlashcardIndex);
            };

            editarBtn.onclick = function() {
                mostrarEdicaoCard(flashcard);
            };

            // Funções para lidar com os botões de dificuldade
            facilBtn.onclick = async function() {
                await atualizarDificuldade(flashcard, 5);
                currentFlashcardIndex++;
                deckContainer.innerHTML = '';
                showFlashcard(currentFlashcardIndex);
            };

            dificilBtn.onclick = async function() {
                await atualizarDificuldade(flashcard, 4);
                currentFlashcardIndex++;
                deckContainer.innerHTML = '';
                showFlashcard(currentFlashcardIndex);
            };

            errouBtn.onclick = async function() {
                await atualizarDificuldade(flashcard, 2);
                currentFlashcardIndex++;
                deckContainer.innerHTML = '';
                showFlashcard(currentFlashcardIndex);
            };
        }

        showFlashcard(currentFlashcardIndex);
    } catch (error) {
        console.error('Erro ao carregar as informações do deck:', error);
    }
};

// Função para atualizar a dificuldade no backend
async function atualizarDificuldade(flashcard, dificuldade) {
    const deckId = window.location.pathname.split('/')[2];

    if (dificuldade < 3) {
        flashcard.repeticoes = 0;
        flashcard.intervalo = 0;
      } else {
        flashcard.repeticoes++;
        flashcard.intervalo = (flashcard.intervalo === 0) ? flashcard.facilidade : flashcard.intervalo * flashcard.facilidade;
      }

    flashcard.facilidade += 0.1 - (5 - dificuldade) * (0.08 + (5 - dificuldade) * 0.02);
    if (flashcard.facilidade < 1.3) flashcard.facilidade = 1.3; // Evitar que a facilidade fique muito baixa
    flashcard.proximaRevisao = new Date(flashcard.proximaRevisao);
    flashcard.proximaRevisao.setDate(flashcard.proximaRevisao.getDate() + flashcard.intervalo);

    console.log(`Testando proxData: ${flashcard.proximaRevisao.toISOString()}`);
    
    const response = await fetch(`https://localhost:3001/api/cartoes/${deckId}/${flashcard.id}`, {
        method: 'PUT',
        body: JSON.stringify({ 
            "facilidade": flashcard.facilidade,
            "intervalo": flashcard.intervalo,
            "repeticoes": flashcard.repeticoes,
            "proximaRevisao": flashcard.proximaRevisao.toISOString(),
         }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
    });

    const updatedCard = await response.json();
    console.log(`Flashcard ${flashcard.id} marcado como ${dificuldade}`);
}


function mostrarCriacaoCard() {
    document.getElementById('vaicriarCard').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    
    document.body.style.pointerEvents = 'none';
    document.getElementById('vaicriarCard').style.pointerEvents = 'auto';
    document.body.style.userSelect = 'none';

    document.getElementById('perguntaCard').focus();
}

function cancelarCriacaoCard() {
    document.getElementById('vaicriarCard').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

    document.body.style.pointerEvents = 'auto';
    document.body.style.userSelect = 'auto';
}

function mostrarEdicaoCard(flashcard) {
    document.getElementById('vaieditarCard').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    
    document.body.style.pointerEvents = 'none';
    document.getElementById('vaieditarCard').style.pointerEvents = 'auto';
    document.body.style.userSelect = 'none';

    document.getElementById('perguntaEdit').value = flashcard.pergunta;
    document.getElementById('respostaEdit').value = flashcard.resposta;

    document.getElementById('perguntaEdit').focus();

    /*const edit = document.createElement('button');

    edit.setAttribute('type', 'submit');
    edit.textContent = 'Editar';*/

    const edit = document.getElementById('vaieditarCard').querySelector('button');

    edit.onclick = async function () {
        
        const pergunta = document.getElementById('perguntaEdit').value;
        const resposta = document.getElementById('respostaEdit').value;
    
        const deckId = window.location.pathname.split('/')[2];
    
        if (!pergunta || !resposta) {
            alert('Por favor, preencha ambos os campos!');
            return;
        }
    
        const response = await fetch(`https://localhost:3001/api/cartoes/${deckId}/${flashcard.id}`, {
            method: 'PUT',
            body: JSON.stringify({ pergunta, resposta }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
        });
    
        const updatedCard = await response.json();
        document.getElementById('vaieditarCard').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        document.body.style.pointerEvents = 'auto';
        document.body.style.userSelect = 'auto';
    
        loadCards();
    }

}

function cancelarEdicaoCard() {
    document.getElementById('vaieditarCard').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    
    document.body.style.pointerEvents = 'auto';
    document.body.style.userSelect = 'auto';
}

async function salvarNovoCard() {
    const deckId = window.location.pathname.split('/')[2];
    const pergunta = document.getElementById('perguntaCard').value;
    const resposta = document.getElementById('respostaCard').value;
    const proximaRevisao = "2025-02-19 08:30:00"; //temporario so pra testar

    if (!pergunta || !resposta) {
        alert('Por favor, preencha ambos os campos!');
        return;
    }

    const response = await fetch(`https://localhost:3001/api/cartoes/${deckId}/`, {
        method: 'POST',
        body: JSON.stringify({ pergunta, resposta, proximaRevisao }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
    });

    const newCard = await response.json();
    document.getElementById('vaicriarCard').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.pointerEvents = 'auto';
    document.body.style.userSelect = 'auto';

    loadCards();
}

window.onload = loadCards;
