const { app, BrowserWindow, ipcMain } = require('electron');
const { Socket } = require('net')
const path = require('path');
const crypto = require('crypto');


// Clave secreta y algoritmo de encriptación (debe coincidir con el servidor)
const SECRET_KEY = '12345678901234567890123456789012'; // 32 caracteres
const ALGORITHM = 'aes-256-ctr';


/**
 * @description Encriptar un mensaje
 * @param {*} text 
 * @returns 
 */
const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Vector de inicialización
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};


/**
 * @description Desencriptar un mensaje
 * @param {*} encryptedText 
 * @returns 
 */
const decrypt = (encryptedText) => {
    const [iv, content] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
    return decrypted.toString('utf-8');
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
    const socket = new Socket()
    const END = 'END'

    socket.connect({ host: 'localhost', port: 8000 }, () =>  console.log('Conectado al servidor'));

    // Manejar mensajes recibidos desde el servidor
    socket.on('data', (data) => {
        const decryptedMessage = decrypt(data.toString());
        const mainWindow = BrowserWindow.getAllWindows()[0];

        if (mainWindow) {
            mainWindow.webContents.send('receive-message', decryptedMessage.toString());
        }
    });

    ipcMain.on('send-message', (_, message) => {
        const encryptedMessage = encrypt(message);
        socket.write(encryptedMessage);

    });

    // Manejar errores de conexión
    socket.on('error', (err) => console.error('Socket error:', err));

    socket.on('close', () => process.exit(0))   
})