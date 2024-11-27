const net = require('net');

const host = '127.0.0.1';
const port = 1234;


const server = net.createServer((socket) => {
    console.log('Cliente conectado:', socket.remoteAddress);

    // Maneja datos recibidos
    socket.on('data', (data) => {
        console.log('Mensaje recibido:', data.toString());        
        socket.write(`Servidor: Recibido "${data}"`);
    });

    // Maneja la desconexión
    socket.on('end', () => console.log('Cliente desconectado.'));
});

server.listen(port, host, () => {
    console.log('Servidor TCP escuchando en el puerto 1234');
});