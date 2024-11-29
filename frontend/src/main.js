const { app, BrowserWindow, ipcMain } = require('electron');
const { Socket } = require('net')
const path = require('path');
const {encrypt, decrypt} = require('./js/encryptation.js');

let username = ''
let socket

/**
 * @description Contenedor de errores del socket
 */
const SocketErrors = {
    ECONNREFUSED: () => console.log('El servidor está inaccesible. Reintentando conexión...'),
    ECONNRESET: () => console.log('El servidor cerró la conexión inesperadamente. Reintentando...'),
    ETIMEDOUT: () => console.log('La conexión al servidor tardó demasiado. Reintentando...')
}
const SocketErrorDefualt = () => console.log('Error inesperado del socket')


/**
 * @description Conectar al servidor
 */
const connectToServer = () => {
    try {
        socket = new Socket();
        socket.connect({ host: 'localhost', port: 8000 }, () => {
            console.log('Conectado al servidor');
            if (username) {
                // Reenviar el nombre de usuario al reconectar
                const encryptedUsername = encrypt(username);
                socket.write(encryptedUsername);
            }
        });

        // Evento 'ready' indica que el socket está completamente inicializado
        socket.on('ready', () => console.log('Socket listo para enviar y recibir datos.'));

        // Evento 'end' indica que el servidor cerró la conexión de forma ordenada
        socket.on('end', () => console.log('Servidor solicitó cierre de conexión.'));

        // Evento 'timeout' indica que el socket no ha recibido actividad en un tiempo determinado
        socket.on('timeout', () => console.warn('El socket ha entrado en tiempo de espera (timeout).'));

        // Evento data, Recibe un mensaje del servidor
        socket.on('data', (data) => {
            const decryptedMessage = decrypt(data.toString());
            console.log('Mensaje del servidor:', decryptedMessage);

            const mainWindow = BrowserWindow.getAllWindows()[0];
            if (mainWindow) {
                mainWindow.webContents.send('receive-message', decryptedMessage);
            }
        });

        socket.on('error', (err) => {
            console.error(` ----| | Error del socket | |---- `);
            const error = SocketErrors[err.code] || SocketErrorDefualt
            error()
        });

        socket.on('close', () => {
            console.log('Conexión cerrada.');
            setTimeout(() => {
                console.log('Intentando reconectar...')
                connectToServer()
            }, 3000);
        });



    } catch (error) {
        console.log('Error al conectar al servidor')
        console.log(error)
    }
};


/**
 * @description Crea una ventana principal de Electron con las opciones predefinidas y
 * carga el archivo index.html en la misma. 
 * @returns {BrowserWindow} La ventana principal creada.
 */
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'js/preload.js'),
        }
    })

    mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(() => {
    createWindow()
    connectToServer();

    ipcMain.on('send-message', (_, message) => {
        if (socket && !socket.destroyed) {
            const encryptedMessage = encrypt(message);
            socket.write(encryptedMessage);
        } else {
            console.error('Socket no está conectado o está destruido');
        }

    });

    ipcMain.on('set-username', (_, user) => {
        username = user; // Guardar el nombre de usuario
        const encryptedUsername = encrypt(user);
        socket.write(encryptedUsername);
    });
})