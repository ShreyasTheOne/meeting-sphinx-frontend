const {app, BrowserWindow, shell} = require('electron')
require("./recording_detection")

function createWindow () {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        icon:"public/sphinx_logo_icon.png"
    })
    mainWindow.maximize()
    mainWindow.removeMenu()
    mainWindow.loadURL(
        "http://localhost:3000/"
    )
    mainWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    })
} 

function init () {
    createWindow()
    require('./recording_detection')
}
    
app.on('ready', init)
