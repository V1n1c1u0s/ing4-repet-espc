const message = document.getElementById("message");

function handleCadastro(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                // usuario ja existe
                message.innerText = errorData.error || 'Erro desconhecido';
                message.style.display = "block";
            });
        }
        
        return response.text()
    })
    .then(data => { 
        if(data) {
            message.innerHTML = data;
            message.style.display = "block"; 
        }
    })
    .catch(error => {
        console.error('Erro de conexão:', error);
        message.innerText = 'Erro de conexão. Tente novamente mais tarde.';
        message.style.display = "block";
    });
}

const form = document.querySelector('form');
form.addEventListener("submit", handleCadastro);
