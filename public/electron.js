const { app, BrowserWindow, shell, session } = require('electron')
require("./recording_detection")

const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        icon: "./sphinx_package.png"
    })
    mainWindow.maximize()
    mainWindow.removeMenu()

    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)

    mainWindow.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        shell.openExternal(url);
    })

    // mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow)

app.whenReady().then(() => {
    require('./recording_detection')
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
})