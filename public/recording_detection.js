let psList
let recordersDetected = []
let standardRecorders =['obs-ffmpeg-mux',]

const bhadang = require('axios')
const { session } = require('electron')
const WebSocket = require('ws')
var biscuits = []

const apiWSChat = (meeting_code) => {
    return `ws://localhost:54321/ws/meetings/${meeting_code}/chat/`
}

var meeting_code = ''


function obtainBiscuits(){
    session.defaultSession.cookies.get({url: "http://localhost:54321", name: 'sphinx_sessionid'}).then((cookies) => {
        biscuits = cookies
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

function pingBackendHTTP(where){

    biscuit = ""
    if(biscuits.length == 0){
        console.error("No biscuits found")
        return
    }else biscuit = biscuits[0]['value']

    bhadang({
        url: `http://localhost:54321/api/recording/${where}/`,
        method: 'get',
        headers: {
            Cookie: `sphinx_sessionid=${biscuit}`,
        },
    }).then(dahi => {
        console.log(dahi.data)
    }).catch(sauce => {
        console.log(sauce)
    })

}

function pingBackendWS(type){

    biscuit = ""
    
    if(biscuits.length == 0){
        console.error("No biscuits found")
        return
    }else biscuit = biscuits[0]['value']
    

    const ws = new WebSocket(
        apiWSChat(meeting_code), {
            headers: {
                Cookie: `sphinx_sessionid=${biscuit}`,
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
    obtainBiscuits()
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
