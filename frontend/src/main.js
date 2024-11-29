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

    socket.connect({
        host: 'localhost',
        port: 8000
    })  

    // Manejar mensajes desde el servidor y reenviarlos al renderer
    socket.on('data', (data) => {
        const mainWindow = BrowserWindow.getAllWindows()[0]; // Obtener la ventana principal
        if (mainWindow) {
            mainWindow.webContents.send('receive-message', data.toString()); // Reenviar mensaje
        }
    });

    // Manejar mensajes desde el frontend
    ipcMain.on('message-to-server', (_, message) => {
        if (message === END) {
            socket.end()
            process.exit()
        }

        if (socket) {
            socket.write(message);
        }

    });

    socket.on('error', (err) => console.error('Socket error:', err));
})