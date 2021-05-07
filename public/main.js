const {app, BrowserWindow} = require('electron')

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.removeMenu()
    mainWindow.loadURL(
        "http://localhost:3000/"
    )

    // createWindow()
} 

app.on('ready', createWindow)
