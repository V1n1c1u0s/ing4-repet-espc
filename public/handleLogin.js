const message = document.getElementById("message");

function handleLogin(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                // Exibe o erro acima do campo de senha
                message.innerText = errorData.error || 'Erro desconhecido';
                message.style.display = "block";
            });
        }
        window.location.href = '/';
    })
    .catch(error => {
        console.error('Erro de conexão:', error);
        message.innerText = 'Erro de conexão. Tente novamente mais tarde.';
    });
}

const form = document.querySelector('form');
form.addEventListener("submit", handleLogin);
