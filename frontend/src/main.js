const { app, BrowserWindow } = require('electron')

const { Socket } = require('net')
const socket = new Socket()

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadFile('./src/index.html')
}

app.whenReady().then(() => {
    createWindow()
    socket.connect({
        host: 'localhost',
        port: 8000
    })    
    socket.write('hola')
})

/*
const useSocket = () => {
    socket.on('data', (data) => {
        if (data === END) {
            socket.end()
            process.exit(0)             
        }

        console.log(`Mensaje recibido: ${data}`);
    })
}
*/
module.exports = {
    socket
}