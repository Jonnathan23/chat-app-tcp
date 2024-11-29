const { app, BrowserWindow, ipcMain } = require('electron');
const { Socket } = require('net')
const path = require('path');
const crypto = require('crypto');


// Clave secreta y algoritmo de encriptación (debe coincidir con el servidor)
const SECRET_KEY = '12345678901234567890123456789012'; // 32 caracteres
const ALGORITHM = 'aes-256-ctr';
let username = ''
let socket
const END = 'END'

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

        socket.on('data', (data) => {
            const decryptedMessage = decrypt(data.toString());
            console.log('Mensaje del servidor:', decryptedMessage);
            const mainWindow = BrowserWindow.getAllWindows()[0];
            if (mainWindow) {
                mainWindow.webContents.send('receive-message', decryptedMessage);
            }
        });

        socket.on('error', (err) => {
            console.error('Error del socket:', err.message);
        });

        socket.on('close', () => {
            console.log('Conexión cerrada.');
            let cont = 0
            setTimeout(() => {
                cont++
                console.log('Intentando reconectar...')
                cont <= 5 ? connectToServer(): console.log('No se pudo reconectar')
            }, 3000); // Intentar reconectar después de 3 segundos
        });

    } catch (error) {
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