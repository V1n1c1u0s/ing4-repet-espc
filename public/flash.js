/*async function loadCards() {
    const deckId = window.location.pathname.split('/')[2]; // Pega o ID do deck da URL
    try {
        const response = await fetch(`http://localhost:3001/api/decks/${deckId}`);
        //const response = await fetch(`http://localhost:3001/api/cartoes/${deckId}`);
        const deckData = await response.json();

        const deckContainer = document.getElementById('deckContainer');
        //deckContainer.innerHTML = '';

        // Exibir as informações do deck
        const deckName = document.createElement('h2');
        deckName.textContent = deckData.nome;
        deckContainer.appendChild(deckName);

        deckData.Flashcards.forEach(flashcard => {
            const flashcardDiv = document.createElement('div');
            flashcardDiv.classList.add('flashcard');
            flashcardDiv.innerHTML = `
                <p>Frente: ${flashcard.pergunta}</p>
                <p>Verso: ${flashcard.resposta}</p>
            `;
            deckContainer.appendChild(flashcardDiv);
        });
    } catch (error) {
        console.error('Erro ao carregar as informações do deck:', error);
    }
};

window.onload = loadCards;*/

async function loadCards() {
    const deckId = window.location.pathname.split('/')[2]; // Pega o ID do deck da URL
    try {
        const response = await fetch(`http://localhost:3001/api/decks/${deckId}`);
        const deckData = await response.json();

        const deckContainer = document.getElementById('deckContainer');
        deckContainer.innerHTML = ''; // Limpa o conteúdo existente

        let currentFlashcardIndex = 0;

        function showFlashcard(index) {
            if (index >= deckData.Flashcards.length) {
                // Quando não houver mais flashcards, mostra "Estudo concluído"
                deckContainer.innerHTML = '<h2>Estudo Concluído!</h2>';
                return;
            }

            const flashcard = deckData.Flashcards[index];
            const flashcardDiv = document.createElement('div');
            flashcardDiv.classList.add('flashcard');

            // Exibir a frente do flashcard
            flashcardDiv.innerHTML = `
                <h2>${flashcard.pergunta}</h2>
                <hr class="divisao" style="display: none;">
                <h2 class="resposta" style="display: none;">${flashcard.resposta}</h2>
                <button class="verificar-btn">Verificar resposta</button>
                <button class="proximo-btn" style="display: none;">Próximo</button>
            `;
            
            deckContainer.appendChild(flashcardDiv);

            const verificarBtn = flashcardDiv.querySelector('.verificar-btn');
            const proximoBtn = flashcardDiv.querySelector('.proximo-btn');
            const resposta = flashcardDiv.querySelector('.resposta');
            const divisao = flashcardDiv.querySelector('.divisao');

            // Mostrar a resposta ao clicar no botão "Verificar resposta"
            verificarBtn.onclick = function() {
                divisao.style.display = 'block';
                resposta.style.display = 'block';
                verificarBtn.style.display = 'none';
                proximoBtn.style.display = 'inline-block';
            };

            // Passar para o próximo flashcard ao clicar em "Próximo"
            proximoBtn.onclick = function() {
                currentFlashcardIndex++;
                deckContainer.innerHTML = ''; // Limpa o flashcard atual
                showFlashcard(currentFlashcardIndex); // Carrega o próximo flashcard
            };
        }

        // Iniciar a exibição do primeiro flashcard
        showFlashcard(currentFlashcardIndex);
    } catch (error) {
        console.error('Erro ao carregar as informações do deck:', error);
    }
};

window.onload = loadCards;
