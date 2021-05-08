let psList
let recordersDetected = []
let standardRecorders =['obs-ffmpeg-mux',]


function checkNewRecorders(){
    psList = require('ps-list')
    psList().then(data => {
        data.forEach(function(process){
            standardRecorders.forEach(function(rec){
                if(process.name == rec){
                    if(recordersDetected.includes(process.name) == false){
                        recordersDetected.push(process.name)
                        console.log("Detected screen-recording by the process ", process.name)
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
            }
        })
    })    
}

function hasRecordingStopped(){
    if(recordersDetected.length == 0)
        console.log("No recorders found")
    else 
        console.log("Recording still ongoing")
}

setInterval(function(){
    checkNewRecorders()
},500)

setInterval(function(){
    updateRecorders()
},1000)

setInterval(function(){
    hasRecordingStopped()
}, 2000)