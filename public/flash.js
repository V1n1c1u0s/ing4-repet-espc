async function loadCards() {
    const deckId = window.location.pathname.split('/')[2]; // Pega o ID do deck da URL
    try {
        const response = await fetch(`http://localhost:3001/api/decks/${deckId}`);
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
                await fetch(`http://localhost:3001/api/cartoes/${flashcard.id}`, {
                    method: 'DELETE',
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
};

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
    
        const response = await fetch(`http://localhost:3001/api/cartoes/${deckId}/${flashcard.id}`, {
            method: 'PUT',
            body: JSON.stringify({ pergunta, resposta }),
            headers: {
                'Content-Type': 'application/json'
            }
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

    const response = await fetch(`http://localhost:3001/api/cartoes/${deckId}/`, {
        method: 'POST',
        body: JSON.stringify({ pergunta, resposta, proximaRevisao }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const newCard = await response.json();
    document.getElementById('vaicriarCard').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.pointerEvents = 'auto';
    document.body.style.userSelect = 'auto';

    loadCards();
}

window.onload = loadCards;
