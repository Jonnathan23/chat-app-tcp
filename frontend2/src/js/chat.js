const form = document.getElementById('myForm');
const listMessages = document.getElementById('listMessages');

// Enviar mensajes al servidor
const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;

    if (message) {
        window.electron.sendMessage(message);
        addMyMessageToList(`Tú: ${message}`);
    }

    e.target.message.value = '';
};

// Mostrar mensajes en la lista
const addMessageToList = (message) => {
    const li = document.createElement('li');
    li.classList.add('other-message');
    li.textContent = message;
    listMessages.appendChild(li);
};

const addMyMessageToList = (message) => {
    const li = document.createElement('li');
    li.classList.add('my-message');
    li.textContent = message;
    listMessages.appendChild(li);
}


// Escuchar mensajes del servidor
window.electron.onMessage((message) => {
    addMessageToList(`${message}`);
});

// Manejar el evento del formulario
form.addEventListener('submit', handleSubmit);
