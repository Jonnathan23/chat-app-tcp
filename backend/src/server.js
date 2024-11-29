const { Server } = require('net')

const server = new Server()
const port = 8000
const host = '0.0.0.0'
const END = 'END'

const connections = new Map()

/**
 * @description Enviar un mensaje a todos los clientes excepto el origen
 * @param {*} message --> mensaje de socket
 * @param {*} origin  --> Socket origen
 */
const sendMessage = (message, origin) => {

}

server.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);
  const { remotePort } = socket
  socket.setEncoding('utf-8')

  socket.on('data', (message) => {

    if (!connections.has(socket)) {
      console.log(`Username: ${message} set for ${remotePort}`)
      connections.set(socket, message)

    } else if (message === END) {
      console.log(`Conexion ${remotePort} finalizada`)
      socket.end()

    } else {
      console.log(`Mensaje recibido: ${message}`);
      socket.write(`${remotePort} --> ${message}`)

    }




  })

  socket.on('close', () => {
    console.log(`Conexion ${remotePort} finalizada`)
  })
})

server.listen(port, host, () => {
  console.log(`Servidor TCP escuchando en el puerto ${port}`);
})