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

  connections.set(socket)

  socket.on('data', (message) => {
    /*
      if (!connections.has(socket)) {
        connections.set(socket, message)
        socket.write(`Bienvenido ${message}`)
        return
      }
  
      if (message === END) {
        socket.end()
        return
      }
      /*
          for (const username of connections.values()) {
            console.log(username)
          }
    

    const fullMessage = `${connections.get(socket)}:${message}`
    socket.write(message)
    //sendMessage(message, socket)
    */

    if (message === END) {
      console.log(`Conexion ${remotePort} finalizada`)
      socket.end()
      return
    }


    console.log(`Mensaje recibido: ${message}`);
    socket.write(`${remotePort} --> ${message}`)


  })

  socket.on('close', () => {
    console.log(`Conexion ${remotePort} finalizada`)
  })
})

server.listen(port, host, () => {
  console.log(`Servidor TCP escuchando en el puerto ${port}`);
})