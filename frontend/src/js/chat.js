
const { socket } = require('../main.js')

const listMessages = document.getElementById('list_messages')
const formChat = document.getElementById('form_chat')

formChat.addEventListener('submit', handleSubmit)

const handleSubmit = (e) => {    
    e.preventDefault()

    console.log('Form submit')
    const message = e.target.message.value

    if (!message) return

    socket.write(message)
    e.target.reset()
}

socket.on('data', (data) => {
    listMessages.innerHTML += `<li>${data}</li>`
})