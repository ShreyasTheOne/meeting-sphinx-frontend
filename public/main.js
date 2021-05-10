const {app, BrowserWindow} = require('electron')

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

function init () {
    createWindow()
    require('./recording_detection')
}
    
app.on('ready', init)
