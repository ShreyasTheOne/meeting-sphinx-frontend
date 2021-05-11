import React, { Component } from 'react';

import './css/index.css'

import { Button, Icon } from 'semantic-ui-react'

import io, { Socket } from 'socket.io-client'
import Peer from "simple-peer"
import axios from 'axios';


class Meeting extends Component{

    constructor(props){
        super(props)
        this.state = {
            primaryVideo: null,
            secondaryVideo: null,
            audioOn: false,
            videoOn: false,
            myId: '',
            meetingDetails: false,
            isOrganiser: false,
        }

        // video refs
        this.primaryVideoRef = React.createRef()
        this.secondaryVideoRef = React.createRef()
        this.myStream = React.createRef()
        this.peer = new Peer(undefined, {
            path: "/peerjs",
            host: "/",
            port: "3030",
        })
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
        this.users = []

        // socket and peer refs
        this.socket = React.createRef()
        this.myPeer = React.createRef()
    }

    /*

       -------------------------------------------------------------------------------------------------------------------------

    */
    videoCall () {
        if(this.users.length != 0){
            navigator.mediaDevices.getUserMedia({video: { width: 240, height: 150 }, audio:false}).then(
                stream => {
                    if(this.secondaryVideoRef.current){
                        this.secondaryVideoRef.current.srcObject = stream
                    }
                }
            )
        }
        else{
            navigator.mediaDevices.getUserMedia({video: { width: 1200, height: 680 }, audio:false}).then(
                stream => {
                    if(this.primaryVideoRef.current){
                        this.primaryVideoRef.current.srcObject = stream
                    }
                }
            )            
        }

    }

    componentDidMount () {

        if(this.props.info.organisers[0].id === this.props.userInfo.data.id){
            this.setState({
                isOrganiser: true,
            })
        }

        this.socket.current = io.connect("/")

        this.socket.current.on("allUsers", (users) => {
            this.setState({
                users: users,
            })
        }) 

        this.socket.current.on("hey", (data) => {

        })
        
        this.peer.on("open", (id) => {
            this.socket.current.emit("join-room", this.props.info.info.meeting_code, id, this.props.userInfo)
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

        this.socket.current.on("user-connected", (userId) => {
            const call = this.peer.call(userId, this.state.myStream)

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

    /*

       -------------------------------------------------------------------------------------------------------------------------

    */



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
                        if(this.myStream.current){
                            this.myStream.current.srcObject = stream
                        }
                        this.setState({
                            videoOn: true
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
                    videoOn: false
                })
                if(this.primaryVideoRef.current){
                    this.primaryVideoRef.current.srcObject.getTracks().forEach(element => {
                        element.stop()
                    });                     
                }
                if(this.myStream.current){
                    this.myStream.current.srcObject.getTracks().forEach(element => {
                        element.stop()
                    }); 
                }
                
            }
        }
        else{
            if(!this.state.videoOn){
                navigator.mediaDevices.getUserMedia({video: { width: 240, height: 150 }, audio:false}).then(
                    stream => {
                        if(this.primaryVideoRef.current){
                            this.primaryVideoRef.current.srcObject = stream
                        }
                        if(this.myStream.current){
                            this.myStream.current.srcObject = stream
                        }
                        this.setState({
                            videoOn: true
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
                    videoOn: false
                })
                this.primaryVideoRef.current.srcObject.getTracks().forEach(element => {
                    element.stop()
                }); 
                this.myStream.current.srcObject.getTracks().forEach(element => {
                    element.stop()
                });                 
            }            
        }
    }
    // myVideo () {
    //     if(!this.state.videoOn){
    //         navigator.mediaDevices.getUserMedia({video: { width: 1200, height: 680 }, audio:false}).then(
    //             stream => {
    //                 if(this.primaryVideoRef.current){
    //                     this.primaryVideoRef.current.srcObject = stream
    //                 }
    //                 this.setState({
    //                     videoOn: true
    //                 })
    //             },
                
                
    //         ).catch(err=>alert("Holaaaaa",err))
    //     }
    //     else{
    //         this.setState({
    //             videoOn: false
    //         })
    //         this.primaryVideoRef.current.srcObject.getTracks().forEach(element => {
    //             element.stop()
    //         }); 
    //     }      
        
    // }
   
    
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
                        <video id='secondaryVideo' ref={this.secondaryVideoRef} autoPlay />
                    </div>
                </div>
    
            </div>
        )
    }
}

export default Meeting