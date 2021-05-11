import React, { Component } from 'react';

import './css/index.css'
import {connect} from 'react-redux'

import { Button, Icon } from 'semantic-ui-react'

import Peer from "simple-peer"
import axios from 'axios'
import { apiWSMeetings } from '../../../urls';
import { MEETING_DATA, ORGANISER_LEFT, USER_JOINED, USER_LEFT } from '../messageTypes';


class Meeting extends Component{

    constructor(props){
        super(props)
        this.state = {
            primaryVideo: null,
            secondaryVideo: null,
            audioOn: false,
            videoOn: false,
            myStream: null,
            myId: '',
            meetingDetails: false,
            isOrganiser: false,
            users: []
        }
        this.control_buttons = [
            {
                key: "microphone",
                icon: "microphone",
                action: this.myAudio
            },
            {
                key: "video",
                icon: "video",
                action: this.setMyStream
            },
        ]

        // video refs
        this.primaryVideoRef = React.createRef()
        this.secondaryVideoRef = React.createRef()
        this.peerConnections = {}

        this.socket = new WebSocket( apiWSMeetings(this.props.info.info.meeting_code) )
        this.peer = new Peer(`${this.props.userInfo.id}`, 
            {
                host: 'localhost',
                port: 3030,
                path: '/peerjs',

            }
        )
        
    }

    handleUserConnected = user => {
        console.log("ids", this.props.userInfo.id, user.id)
        if (this.props.userInfo.id !== user.id) {
            this.peerConnections[user.id] = this.peer.connect(user.id)
            this.peerConnections[user.id].on('open', () => {
                this.peerConnections[user.id].send('hi')  
            })
        }
    }

    componentDidMount () {
        this.socket.onmessage = e => {
            const data = JSON.parse(e.data)
            const type = data.type
            const d = data.data
            switch (type) {
                case USER_JOINED:
                    console.log("user joined", d)
                    this.handleUserConnected(d.user_data)
                    break
                case USER_LEFT:
                    console.log("user left", d)
                    break
                case MEETING_DATA:
                    console.log( "meeting data", d)
                    break
                case ORGANISER_LEFT:
                    console.log("org left")
                    break
                default:
                    break
            }
        }

        if(this.props.info.organisers[0].id === this.props.userInfo.id){
            this.setState({
                isOrganiser: true,
            })
        }

        this.peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                console.log(data)
            })
            conn.on('open', () => {
                conn.send('hello!')
            })
        })

        this.peer.on("call", (call) => {

            call.answer(this.state.myStream, this.state.isOrganiser, this.props.userInfo)

            call.on("stream", (incomingStream, isMeetingOrganiser, newUserInfo) => {
                if(isMeetingOrganiser){
                    this.addOrganiserStream(incomingStream)
                }
                else{
                    this.addAttendeeStream(incomingStream)
                }
            })
        })

        
    }

    addOrganiserStream (stream) { 
        if(this.primaryVideoRef.current){
            this.primaryVideoRef.current.srcObject = stream
        }
    }
    
    addAttendeeStream (stream) {
        if(this.secondaryVideoRef.current){
            this.secondaryVideoRef.current.srcObject = stream
        }
    }

    myAudio () {

    }

    setMyStream(){
        if(this.state.isOrganiser){
            if(!this.state.videoOn){
                navigator.mediaDevices.getUserMedia({video: { width: 1200, height: 680 }, audio:false}).then(
                    stream => {
                        if(this.primaryVideoRef.current){
                            this.primaryVideoRef.current.srcObject = stream
                        }
                        this.setState({
                            videoOn: true,
                            myStream: stream
                        })
                    }
                ).catch(
                    err => {
                        alert("Video problems")
                    }
                )                
            }
            else{
                this.setState({
                    videoOn: false,
                    myStream: null
                })
                if(this.primaryVideoRef.current){
                    this.primaryVideoRef.current.srcObject.getTracks().forEach(element => {
                        element.stop()
                    });                     
                }
            }
        }
        else{
            if(!this.state.videoOn){
                navigator.mediaDevices.getUserMedia({video: { width: 240, height: 150 }, audio:false}).then(
                    stream => {
                        if(this.secondaryVideoRef.current){
                            this.secondaryVideoRef.current.srcObject = stream
                        }
                        this.setState({
                            videoOn: true,
                            myStream: stream
                        })
                    }
                ).catch(
                    err => {
                        alert("Video problems")
                    }
                )                
            }
            else{
                this.setState({
                    videoOn: false,
                    myStream: null
                })
                this.secondaryVideoRef.current.srcObject.getTracks().forEach(element => {
                    element.stop()
                })            
            }            
        }
    }
    
    render(){
        const {primaryVideo, secondaryVideo, videoOn, audioOn, screenShare} = this.state
        const conditions = [ audioOn, videoOn, screenShare ]
        
        return(
            <div id='meeting-container'>
                <div id="primaryVideoContainer">
                    <video id="primaryVideo" ref={this.primaryVideoRef} autoPlay/>
                </div>
                <div id='meeting-content'>
                    <div id="controlsContainer">
                        {
                            this.control_buttons.map((c, index) => {
                                return (
                                    <Button
                                        key={index}
                                        onClick={c.action.bind(this)}
                                        icon
                                        color='black'
                                    >
                                        <Icon 
                                            name={c.icon}
                                            color={conditions[index]?"green":"red"}
                                        />
                                    </Button>
                                )
                            })
                        }
                    </div>
                    <div id='secondaryVideoContainer'>
                        <video 
                            id='secondaryVideo' 
                            ref={this.secondaryVideoRef} 
                            autoPlay 
                        />
                    </div>
                </div>
    
            </div>
        )
    }
}

export default Meeting