let psList
let recordersDetected = []
let standardRecorders =['obs-ffmpeg-mux', 'kazam', 'peek', 'simplescreenrec', ]

const apiRequest = require('axios')
const { session } = require('electron')
const WebSocket = require('ws')
var electron_cookies = []

const apiWSChat = (meeting_code) => {
    return `ws://localhost:54321/ws/meetings/${meeting_code}/chat/`
}

var meeting_code = ''


function obtainCookies(){
    session.defaultSession.cookies.get({url: "http://localhost:54321", name: 'sphinx_sessionid'}).then((cookies) => {
        electron_cookies = cookies
    }).catch((err) => {
        console.log(err)
    })

    session.defaultSession.cookies.get({name: 'current_meeting', path:'/'}).then((cookies) => {
        let meeting_codes = cookies
        try{
            meeting_code = meeting_codes[0]['value']
            
        }catch{
            console.log("No cookie set")
        }
    }).catch((err) => {
        console.log(err)
    })
}

// This function would be used if GET requests are to be made to the backend
function pingBackendHTTP(where){

    electron_cookie = ""
    if(electron_cookies.length == 0){
        console.error("No electron cookies found")
        return
    }else electron_cookie = electron_cookies[0]['value']

    apiRequest({
        url: `http://localhost:54321/api/recording/${where}/`,
        method: 'get',
        headers: {
            Cookie: `sphinx_sessionid=${electron_cookie}`,
        },
    }).then(res => {
        console.log(res.data)
    }).catch(err => {
        console.log(err)
    })

}

function pingBackendWS(type){

    electron_cookie = ""
    
    if(electron_cookies.length == 0){
        console.error("No electron_cookies found")
        return
    }else electron_cookie = electron_cookies[0]['value']
    

    const ws = new WebSocket(
        apiWSChat(meeting_code), {
            headers: {
                Cookie: `sphinx_sessionid=${electron_cookie}`,
            }
        }
    )
    ws.on('open', function open(){
        console.log("recording", type)
        ws.send(JSON.stringify({
            'type': type
        })) 
    })
}

function checkNewRecorders(){
    psList = require('ps-list')
    psList().then(data => {
        data.forEach(function(process){
            standardRecorders.forEach(function(rec){
                if(process.name == rec){
                    if(recordersDetected.includes(process.name) == false){
                        recordersDetected.push(process.name)
                        console.log('user_record_start')
                        pingBackendWS('user_recrd_start')
                    }
                }
            })

        })
    });
}

function updateRecorders(){
    psList = require('ps-list')
    var flag = false
    psList().then(data=>{
        recordersDetected.forEach(function(drec){
            flag = false
            data.forEach(function(process){
                if(drec == process.name){
                    flag = true
                }
            })
            if(flag == false){
                const index = recordersDetected.indexOf(drec)
                recordersDetected.splice(index, 1)
                if(recordersDetected.length === 0){
                    console.log('user_record_stop')
                    pingBackendWS('user_recrd_stop')
                }
            }
        })
    })    
}

setInterval(function(){
    obtainCookies()
}, 1000)

setTimeout(
    function() {
        setInterval(function(){
            checkNewRecorders()
        },500)
        
        setInterval(function(){
            updateRecorders()
        },1000)
    },
    2000
)
