const form = document.getElementById('myForm');
const listMessages = document.getElementById('listMessages');
const classOther = 'other-message';
const classMy = 'my-message';

// Enviar mensajes al servidor
const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;

    if (message) {
        window.electron.sendMessage(message);
        addMessageToList(`Tú: ${message}`, classMy);
    }

    e.target.message.value = '';
};

// Mostrar mensajes en la lista
const addMessageToList = (message, classStyle) => {
    const li = document.createElement('li');
    li.classList.add(classStyle);
    li.textContent = message;
    listMessages.appendChild(li);
};

// Escuchar mensajes del servidor
window.electron.onMessage((message) => {
    addMessageToList(`${message}`, classOther);
});

// Manejar el evento del formulario
form.addEventListener('submit', handleSubmit);
