const {app, BrowserWindow, shell, session} = require('electron')
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

    // const cookie = { url: 'http://localhost:54321/', name: 'current_meeting', value: 'lol' }
    // session.defaultSession.cookies.set(cookie).then(() => {}, (error) => { console.error(error) })

    // mainWindow.webContents.openDevTools()
} 

// function init () {
//     createWindow()
//     require('./recording_detection')
// }
    
app.on('ready', createWindow)

app.whenReady().then(() => {
    require('./recording_detection')
})
