import React, { Component } from 'react'
import Peer from 'simple-peer'
import { connect } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
import {
    USER_JOINED,
    ALL_USERS,
    HEY,
    CALL_ACCEPTED,
    USER_TURNED_OFF_VIDEO,
    SENDING_SIGNAL,
    RETURNING_SIGNAL
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
        navigator.mediaDevices.getUserMedia({video: { width: 1200, height: 680 }, audio: false})
            .then( stream => {
                this.myStream = stream
                users.forEach(userID => {
                    if (userID === user.id) return
                    const peer = new Peer({
                        initiator: true,
                        trickle: false,
                        stream: stream,
                    })

                    peer.on("signal", signal => {
                        this.videoCallWebsocket.send(JSON.stringify({
                            "type": "sending_signal",
                            "data": {signal: signal, from: user.id, to: userID}
                        }))
                    })

                    peer.on("stream", stream => {
                        console.log("GETTING STREAM")
                        if (this.primaryVideoRef.current) {
                            this.primaryVideoRef.current.srcObject = stream
                            // console.log("stream")
                        }
                    })
                    this.peers[userID] = peer
                })
                // this.state.users.forEach(userID => {
                //     if (userID === user.id) return
                //     console.log("ek na ek to hona hi hai")
                //     if (this.acceptingPeers[userID]) {
                //         console.log("adding to acceptingPeers", userID)
                //         this.acceptingPeers[userID].addStream(stream)
                //     } else if (this.peers[userID]) {
                //         console.log("adding to peers", userID)
                //         this.peers[userID].addStream(stream)
                //     } else {
                //         alert("Neither lol")
                //     }
                // })
                this.setState({
                    myVideoOn: true,
                })
            })
            .catch( err => {
                console.log("err", err)
            })
        // users.forEach(userID => {
        //     if (userID === user.id) return
        //     const peer = new Peer({
        //         initiator: true,
        //         trickle: false,
        //         stream: null,
        //     })
        //
        //     peer.on("signal", signal => {
        //         this.videoCallWebsocket.send(JSON.stringify({
        //             "type": "sending_signal",
        //             "data": {signal: signal, from: user.id, to: userID}
        //         }))
        //     })
        //
        //     peer.on("stream", stream => {
        //         console.log("GETTING STREAM")
        //         if (this.primaryVideoRef.current) {
        //             this.primaryVideoRef.current.srcObject = stream
        //             // console.log("stream")
        //         }
        //     })
        //     this.peers[userID] = peer
        // })
    }

    // handleUserJoined = users => {
    //     const user = this.props.UserInformation.data
    //     this.setState({
    //         users: users.filter(u => {
    //             return u.id !== user.id
    //         })
    //     })
    // }

    handleSendingSignal = d => {
        const user = this.props.UserInformation.data
        if (d.to === user.id) {
            if (!this.acceptingPeers[d.from] || this.acceptingPeers[d.from].destroyed) {
                console.log("New accepting")

                let temp_users = this.state.users.filter(u => {return u !== d.from})
                temp_users.push(d.from)
                this.setState({
                    users: temp_users
                })

                const peer = new Peer({
                    initiator: false,
                    trickle: false,
                    stream: this.myStream,
                })

                peer.on("signal", signal => {
                    this.videoCallWebsocket.send(JSON.stringify({
                        "type": "returning_signal",
                        "data": {signal: signal, from: d.from, to: d.to}
                    }))
                })
                peer.on("stream", stream => {
                    console.log("GETTING STREAM")
                    if (this.primaryVideoRef.current) {
                        this.primaryVideoRef.current.srcObject = stream
                        // console.log("stream")
                    }
                })
                peer.signal(d.signal)
                this.acceptingPeers[d.from] = peer
            }
        }
    }

    handleReturningSignal = d => {
        const user = this.props.UserInformation.data
        if (d.from === user.id) {
            this.peers[d.to].signal(d.signal)
        }
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
                    // this.handleUserJoined(d)
                    break
                case SENDING_SIGNAL:
                    this.handleSendingSignal(d)
                    break
                case RETURNING_SIGNAL:
                    this.handleReturningSignal(d)
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
        return

        if (curr) {

            for (const [user_id, peer] of Object.entries(this.peers)) {
                peer.removeStream(this.myStream)
            }
            for (const [user_id, peer] of Object.entries(this.acceptingPeers)) {
                peer.removeStream(this.myStream)
            }

            this.myStream.getTracks().forEach(
                track => track.stop()
            )
            this.myStream = null

            if (this.myVideoRef.current) {
                this.myVideoRef.current.srcObject.getTracks().forEach(
                    track => track.stop()
                )
                this.myVideoRef.current.srcObject = null
            }
            this.setState({
                myVideoOn: false,
            })

        } else {
            navigator.mediaDevices.getUserMedia({video: { width: 1200, height: 680 }, audio: false})
                .then( stream => {
                    this.myStream = stream
                    this.state.users.forEach(userID => {
                        if (userID === user.id) return
                        console.log("ek na ek to hona hi hai")
                        if (this.acceptingPeers[userID]) {
                            console.log("adding to acceptingPeers", userID)
                            this.acceptingPeers[userID].addStream(stream)
                        } else if (this.peers[userID]) {
                            console.log("adding to peers", userID)
                            this.peers[userID].addStream(stream)
                        } else {
                            alert("Neither lol")
                        }
                    })
                    this.setState({
                        myVideoOn: true,
                    })
                })
                .catch( err => {
                    console.log("err", err)
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