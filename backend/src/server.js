const { Server } = require('net')

const server = new Server()
const port = 8000
const host = '0.0.0.0'

const END = 'END'

server.on('connection', (socket) => {    
    console.log(`Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.setEncoding('utf-8')
    
    socket.on('data', (data) => {
      if (data === END) {
        socket.end()
        return
      }

      
      console.log(`Mensaje recibido: ${data}`);  
    })
})

server.listen(port, host, () => {
    console.log(`Servidor TCP escuchando en el puerto ${port}`);
})