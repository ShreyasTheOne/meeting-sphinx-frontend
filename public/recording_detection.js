let psList
let recordersDetected = []
let standardRecorders =['obs-ffmpeg-mux',]

const bhadang = require('axios')
const { session } = require('electron')
var biscuits = {}

obtainBiscuits()

function obtainBiscuits(){
    session.defaultSession.cookies.get({url: "http://localhost:54321", name: 'sphinx_sessionid'}).then((cookies) => {
        biscuits = cookies
    }).catch((err) => {
        console.log(err)
    })
}

function pingBackend(where){

    biscuit = ""
    if(biscuits.length == 0){
        console.error("No biscuits found")
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

function checkNewRecorders(){
    psList = require('ps-list')
    psList().then(data => {
        data.forEach(function(process){
            standardRecorders.forEach(function(rec){
                if(process.name == rec){
                    if(recordersDetected.includes(process.name) == false){
                        recordersDetected.push(process.name)
                        console.log("Detected screen-recording by the process ", process.name)
                        pingBackend('start')
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
                    pingBackend('stop')
                }
            }
        })
    })    
}

function hasRecordingStopped(){
    if(recordersDetected.length == 0){
        console.log("No recorders found")
        // pingBackend('test')
    }
    else{
        console.log("Recording still ongoing")
    }
}

setInterval(function(){
    obtainBiscuits()
}, 1000)

setInterval(function(){
    checkNewRecorders()
},500)

setInterval(function(){
    updateRecorders()
},1000)

setInterval(function(){
    hasRecordingStopped()
}, 2000)