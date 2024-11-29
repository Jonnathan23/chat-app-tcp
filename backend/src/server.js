const { Server } = require('net')

const server = new Server()
const port = 8000
const host = '0.0.0.0'

const END = 'END'

server.on('connection', (socket) => {    
    console.log(`Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);
    const {remotePort} = socket
    socket.setEncoding('utf-8')
    
    socket.on('data', (message) => {
      if (message === END) {
        console.log(`Conexion ${remotePort} finalizada`)
        socket.end()
        return
      }

      
      console.log(`Mensaje recibido: ${message}`);
      socket.write(`${remotePort} --> ${data}`)
    })
})

server.listen(port, host, () => {
    console.log(`Servidor TCP escuchando en el puerto ${port}`);
})