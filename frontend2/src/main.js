const { app, BrowserWindow, ipcMain } = require('electron');
const { Socket } = require('net')
const path = require('path');

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
    const socket = new Socket()
    const END = 'END'

    socket.connect({ host: 'localhost', port: 8000 }, () =>  console.log('Conectado al servidor'));

    // Manejar mensajes recibidos desde el servidor
    socket.on('data', (data) => {
        const mainWindow = BrowserWindow.getAllWindows()[0];
        if (mainWindow) {
            mainWindow.webContents.send('receive-message', data.toString());
        }
    });

    // Manejar mensajes desde el frontend
    ipcMain.on('message-to-server', (_, message) => {
        socket.write(message);
        
        if (message === END) {
            socket.end()
            process.exit()
        }
    });

    ipcMain.on('send-message', (_, message) => {
        if (socket && !socket.destroyed) {
            console.log('Enviando mensaje al servidor:', message);
            socket.write(message);
        } else {
            console.error('Socket no está conectado o está destruido');
        }
    });

    // Manejar errores de conexión
    socket.on('error', (err) => console.error('Socket error:', err));

    socket.on('close', () => process.exit(0))   
})