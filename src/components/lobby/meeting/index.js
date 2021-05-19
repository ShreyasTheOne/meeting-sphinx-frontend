import React, { Component } from 'react'
import Peer from 'simple-peer'
import { connect } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
import {
    USER_JOINED,
    ALL_USERS,
    HEY,
    CALL_ACCEPTED,
    USER_TURNED_OFF_VIDEO
} from "../messageTypes"
import { apiWSVideoCall } from '../../../urls'
import './css/index.css'

class Meeting extends Component {

    constructor(props){
        super(props)
        this.state = {
            myAudioOn: false,
            myVideoOn: false,
            users: []
        }
        this.myStream = null

        this.primaryVideoRef = React.createRef()
        this.myVideoRef = React.createRef()
        this.peers = {}
        this.acceptingPeers = {}
        this.videoCallWebsocket = new WebSocket(apiWSVideoCall(this.props.meeting_code))
    }

    // IN GENERAL

    setUsers = users => {
        const user = this.props.UserInformation.data
        this.setState({
            users: users.filter(u => {
                return u.id !== user.id
            })
        })
    }

    handleUserJoined = d => {
        const user = this.props.UserInformation.data
        const {
            myVideoOn,
            users
        } = this.state
        if (d !== user.id) {
            if (myVideoOn) {
                this.callUser(d, user.id, this.myStream)
            }
            users.push(d)
            this.setState({
                users
            })
        }
    }

    handleUserTurnedOffVideo = d => {
        console.log("destroying accepting peer")
        this.acceptingPeers[d.user_id].destroy()
        this.acceptingPeers[d.user_id] = null
        if (this.primaryVideoRef.current) {
            this.primaryVideoRef.current.srcObject = null
        }
    }

    // CALLER METHODS

    callUser = (receiver_id, caller_id, stream) => {
        // this.peer = new Peer({
        //     initiator: true,
        //     trickle: false,
        //     stream
        // })
        //
        // this.peer.on("signal", signal => {
        //     this.videoCallWebsocket.send(JSON.stringify({
        //         "type": "call_user",
        //         "data": {signal, from: caller_id, to: receiver_id}
        //     }))
        // })
        //
        // this.peer.on("stream", stream => {
        //     console.log("GETTING STREAM")
        //     if (this.primaryVideoRef.current) {
        //         this.primaryVideoRef.current.srcObject = stream
        //     }
        // })
        this.peers[receiver_id] = new Peer({
            initiator: true,
            trickle: false,
            stream
        })

        this.peers[receiver_id].on("signal", signal => {
            this.videoCallWebsocket.send(JSON.stringify({
                "type": "call_user",
                "data": {signal, from: caller_id, to: receiver_id}
            }))
        })

        this.peers[receiver_id].on("stream", stream => {
            console.log("GETTING STREAM")
            if (this.primaryVideoRef.current) {
                this.primaryVideoRef.current.srcObject = stream
            }
        })

    }

    handleCallAccepted = d => {
        const user = this.props.UserInformation.data
        if (d.from === user.id) {
            console.log(this.peers)
            this.peers[d.to].signal(d.signal)
        }
    }

    // RECEIVER METHODS

    handleHey = d => {
        const user = this.props.UserInformation.data
        if (d.to === user.id) {
            this.acceptCall(d.from, d.signal, d.to)
        }
    }

    acceptCall = (caller, caller_signal, receiver) => {
        this.acceptingPeers[caller] = new Peer({
            initiator: false,
            trickle: false,
            stream: this.myStream,
        })

        this.acceptingPeers[caller].on("signal", data => {
            this.videoCallWebsocket.send(JSON.stringify({
                'type': 'accept_call',
                'data': {
                    'signal': data,
                    'to': receiver,
                    'from': caller,
                }
            }))
        })

        this.acceptingPeers[caller].on("stream", stream => {
            console.log("GETTING STREAM")
            if (this.primaryVideoRef.current) {
                console.log("Setting incoming stream")
                // if (!stream) {
                //     this.primaryVideoRef.current.srcObject = stream
                // } else {
                //     alert("Stream coming in is null!")
                // }
                console.log("Stream", stream == null, stream)
                this.primaryVideoRef.current.srcObject = stream
            }
        })

        this.acceptingPeers[caller].signal(caller_signal)
    }

    componentDidMount() {
        this.videoCallWebsocket.onmessage = e => {
            const data = JSON.parse(e.data)
            const type = data.type
            const d = data.data
            console.log(type, d)
            switch (type) {
                case ALL_USERS:
                    this.setUsers(d)
                    break
                case USER_JOINED:
                    this.handleUserJoined(d)
                    break
                case HEY:
                    this.handleHey(d)
                    break
                case CALL_ACCEPTED:
                    this.handleCallAccepted(d)
                    break
                case USER_TURNED_OFF_VIDEO:
                    this.handleUserTurnedOffVideo(d)
                    break
                default:
                    break
            }
        }

    }

    toggleVideo () {
        const curr = this.state.myVideoOn
        const {UserInformation} = this.props
        const user = UserInformation.data

        if (curr) {
            // this.videoCallWebsocket.send(JSON.stringify({
            //     'type': 'user_turned_off_video',
            //     'data': {
            //         'user_id': user.id
            //     }
            // }))

            for (const [user_id, peer] of Object.entries(this.peers)) {
                console.log("destroying calling peer")
                peer.destroy()
                this.peers[user_id] = null
            }
            this.myStream.getTracks().forEach(
                track => track.stop()
            )
            this.myStream = null
            this.setState({
                myVideoOn: false,
            })
            if (this.myVideoRef.current) {
                this.myVideoRef.current.srcObject.getTracks().forEach(
                    track => track.stop()
                )
                this.myVideoRef.current.srcObject = null
            }

        } else {
            navigator.mediaDevices.getUserMedia({video: { width: 1200, height: 680 }, audio: false})
                .then( stream => {
                    this.state.users.forEach(userID => {
                        if (userID === user.id) return
                        if (this.acceptingPeers[userID]) {
                            console.log("Already exists")
                            // this.acceptingPeers[userID].removeStream(this.myStream)
                            this.acceptingPeers[userID].addStream(stream)
                        } else {
                            this.callUser(userID, user.id, stream)
                        }
                    })
                    this.myStream = stream
                    this.setState({
                        myVideoOn: true,
                    })
                })
                .catch( err => {
                    alert("Error turning on video myStream")
                })

            navigator.mediaDevices.getUserMedia({video: { width: 240, height: 150 }, audio: false})
                .then( stream => {
                    if (this.myVideoRef.current) {
                        this.myVideoRef.current.srcObject = stream
                    }
                    this.setState({
                        myVideoOn: true,
                    })
                })
                .catch( err => {
                    alert("Error turning on video selfStream")
                })
        }
    }

    toggleAudio () {

    }
    

    render(){
        const {myVideoOn, myAudioOn, screenShare} = this.state
        
        return(
            <div id='meeting-container'>
                <div id="primaryVideoContainer">
                    <video
                        id="primaryVideo"
                        ref={this.primaryVideoRef}
                        autoPlay
                    />
                </div>
                <div id='meeting-content'>
                    <div id="controlsContainer">
                        <Button
                            onClick={this.toggleAudio.bind(this)}
                            icon
                            circular
                            color='black'
                        >
                            <Icon
                                name={"microphone"}
                                color={myAudioOn?"green":"red"}
                            />
                        </Button>
                        <Button
                            onClick={this.toggleVideo.bind(this)}
                            icon
                            circular
                            color='black'
                        >
                            <Icon
                                name={"video"}
                                color={myVideoOn?"green":"red"}
                            />
                        </Button>
                        <Button
                            onClick={() => {}}
                            icon
                            circular
                            color='black'
                        >
                            <Icon
                                name={"desktop"}
                                color={screenShare?"green":"red"}
                            />
                        </Button>
                    </div>
                    <div id='myVideoContainer' className={myVideoOn ? '' : 'hide'}>
                        <video id='myVideo' ref={this.myVideoRef} muted autoPlay />
                    </div>
                </div>
    
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        UserInformation: state.userInformation,
        MeetingInformation: state.meetingInformation
    }
}

export default connect(
    mapStateToProps,
    null
)(Meeting)