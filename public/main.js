const {app, BrowserWindow} = require('electron')
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

    // createWindow()
} 

app.on('ready', createWindow)
