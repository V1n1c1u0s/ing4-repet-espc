async function loadDecks() {
    try {
        const response = await fetch('/decks');
        const decks = await response.json();

        const tableBody = document.getElementById('decksTable');
        tableBody.innerHTML = ''; // Limpa qualquer conteúdo existente

        decks.forEach(deck => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = deck.id;
            row.appendChild(idCell);

            const nameCell = document.createElement('td');
            const link = document.createElement('a');
            link.href = `/decks/${deck.id}`;
            link.textContent = deck.nome;
            nameCell.appendChild(link);
            row.appendChild(nameCell);

            const actionsCell = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.onclick = () => editDeck(deck.id);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i';
            deleteButton.onclick = () => deleteDeck(deck.id);

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar os decks:', error);
    }
}

async function criarDeck() {
    // Exibe a área de criação e o overlay para bloquear o restante da página
    document.getElementById('vaicriar').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    
    // Bloqueia o restante da página (exceto a área de criação)
    document.body.style.pointerEvents = 'none';
    document.getElementById('vaicriar').style.pointerEvents = 'auto';
    document.body.style.userSelect = 'none';  // Desabilita seleção de texto

    // Foca no campo do nome do deck
    document.getElementById('nomeDeck').focus();
}

// Função para cancelar a criação do deck
function cancelarCriacao() {
    // Esconde a área de criação e o overlay
    document.getElementById('vaicriar').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    
    // Reabilita a interação com a página
    document.body.style.pointerEvents = 'auto';
    document.body.style.userSelect = 'auto'; // Reabilita seleção de texto
}

function cancelarEdicao() {
    // Esconde a área de criação e o overlay
    document.getElementById('vaieditar').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    
    // Reabilita a interação com a página
    document.body.style.pointerEvents = 'auto';
    document.body.style.userSelect = 'auto'; // Reabilita seleção de texto
}

// Lógica para criar o deck e enviar para a API
document.getElementById('criarDeckForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário

    const nome = document.getElementById('nomeDeck').value;

    if (!nome) {
        alert("Nome do deck é obrigatório!");
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/decks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome }),
        });

        if (!response.ok) {
            throw new Error('Falha ao criar o deck');
        }

        const novoDeck = await response.json();
        alert(`Deck criado com sucesso: ${novoDeck.nome}`);

        // Esconde a área de criação e o overlay
        document.getElementById('vaicriar').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        
        // Reabilita a interação com a página
        document.body.style.pointerEvents = 'auto';
        document.body.style.userSelect = 'auto'; // Reabilita seleção de texto

        loadDecks();
        // Opcional: Você pode redirecionar ou atualizar a página
        // window.location.href = `/decks/${novoDeck.id}`;

    } catch (error) {
        console.error('Erro ao criar deck:', error);
        alert('Erro ao criar o deck');
    }
});

async function editDeck(id) {
    try {
        // Faz uma requisição para obter os dados do deck a ser editado
        const response = await fetch(`http://localhost:3001/api/decks/${id}`);
        const deck = await response.json();

        // Exibe a área de criação e o overlay para bloquear o restante da página
        document.getElementById('vaieditar').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
        
        // Bloqueia o restante da página (exceto a área de criação)
        document.body.style.pointerEvents = 'none';
        document.getElementById('vaieditar').style.pointerEvents = 'auto';
        document.body.style.userSelect = 'none';  // Desabilita seleção de texto

        // Preenche o campo de nome com o nome do deck
        document.getElementById('nmeDeck').value = deck.nome;

        // Atualiza o texto do título para "Editar Deck"
        document.querySelector('#vaieditar h3').textContent = 'Editar Deck';

        // Atualiza o formulário para fazer uma requisição PUT ao invés de POST
        const form = document.getElementById('editarDeckForm');
        form.onsubmit = async function(event) {
            event.preventDefault(); // Impede o comportamento padrão de envio do formulário

            const nome = document.getElementById('nmeDeck').value;

            if (!nome) {
                alert("Nome do deck é obrigatório!");
                return;
            }

            try {
                // Faz uma requisição PUT para editar o deck
                const response = await fetch(`http://localhost:3001/api/decks/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nome }),
                });

                if (!response.ok) {
                    throw new Error('Falha ao editar o deck');
                }

                const deckAtualizado = await response.json();
                alert(`Deck editado com sucesso: ${deckAtualizado.nome}`);

                // Esconde a área de criação e o overlay
                document.getElementById('vaieditar').style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
                
                // Reabilita a interação com a página
                document.body.style.pointerEvents = 'auto';
                document.body.style.userSelect = 'auto'; // Reabilita seleção de texto

                loadDecks();
            } catch (error) {
                console.error('Erro ao editar o deck:', error);
                alert('Erro ao editar o deck');
            }
        };
    } catch (error) {
        console.error('Erro ao carregar o deck:', error);
        alert('Erro ao tentar editar o deck');
    }
}


async function deleteDeck(id) {
    if (confirm('Você tem certeza que deseja deletar este deck?')) {
        try {
            const response = await fetch(`http://localhost:3001/api/decks/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Deck deletado com sucesso');
                loadDecks();
            } else {
                alert('Erro ao deletar deck');
            }
        } catch (error) {
            console.error('Erro ao deletar o deck:', error);
            alert('Erro ao tentar deletar o deck');
        }
    }
}

function abrirMenu() {
    document.getElementById("menuLateral").style.right = "0px";
    document.getElementById("menuIcon").style.display = "none";
}

function fecharMenu() {
    document.getElementById("menuLateral").style.right = "-350px";
    document.getElementById("menuIcon").style.display = "block";
}

async function executarPrompt() {
    const prompt = document.getElementById('prompt').value;

    try {
        const response = await fetch('http://localhost:3001/api/prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        })
        const responseText = await response.text();
        const regex = /\{.*\}/s;  // modificador 's' permite capturar novas linhas
        const match = responseText.match(regex);
        let myJson = match[0]; 
        myJson = JSON.parse(myJson);
        console.log(myJson)
        await criarDeckComFlashcards(myJson);
    } catch (error) {
        console.error('Erro ao executar o prompt:', error);
    }
    loadDecks();
}


async function criarDeckComFlashcards(json) {
    const { deck_name, flashcards } = json;

    const responseDeck = await fetch('http://localhost:3001/api/decks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: deck_name }),
    });

    if (!responseDeck.ok) {
        throw new Error('Erro ao criar o deck');
    }

    const deckData = await responseDeck.json();
    const deckId = deckData.id;

    for (const flashcard of flashcards) {
        const { pergunta, resposta } = flashcard;

        const proximaRevisao = new Date(); // mudar isso dps

        const responseCard = await fetch(`http://localhost:3001/api/cartoes/${deckId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pergunta,
                resposta,
                proximaRevisao,
            }),
        });

        if (!responseCard.ok) {
            throw new Error(`Erro ao criar o flashcard: ${pergunta}`);
        }
    }

    console.log('Deck e flashcards criados com sucesso!');
}

window.onload = loadDecks;