import React, { Component } from 'react';

import './css/index.css'

import { Button, Icon } from 'semantic-ui-react'


class Meeting extends Component{

    constructor(props){
        super(props)
        this.state = {
            primaryVideo: null,
            partnerVideo: null,
            audioOn: false,
            videoOn: false,
            screenShare: false,
        }
        this.primaryVideoRef = React.createRef()
        this.secondaryVideoRef = React.createRef()
        this.control_buttons = [
            {
                key: "microphone",
                icon: "microphone",
                action: this.myAudio
            },
            {
                key: "video",
                icon: "video",
                action: this.myVideo
            },
            {
                key: "sreenshare",
                icon: "desktop",
                action: this.myDisplay
            },
        ]
    }

    componentDidMount(){

    }
    
    toggleAudio(){
        this.setState({
            audioOn: !this.state.audioOn,
        })
        return this.state.audioOn
    }

    toggleVideo(){
        this.setState({
            videoOn: !this.state.videoOn,
        })
        return this.state.videoOn
    }

    toggleShare(){
        this.setState({
            screenShare: !this.state.screenShare,
        })
        return this.state.screenShare
    }

    myAudio () {

    }

    myVideo () {
        if(!this.state.videoOn){
            navigator.mediaDevices.getUserMedia({video: { width: 1200, height: 680 }, audio:false}).then(
                stream => {
                    if(this.primaryVideoRef.current){
                        this.primaryVideoRef.current.srcObject = stream
                    }
                    this.setState({
                        videoOn: true
                    })
                },
                
                
            ).catch(err=>alert("Holaaaaa",err))
        }
        else{
            this.setState({
                videoOn: false
            })
            this.primaryVideoRef.current.srcObject.getTracks().forEach(element => {
                element.stop()
            }); 
        }      
        
    }

    myDisplay () {

        if(!this.state.screenShare){
            navigator.mediaDevices.getDisplayMedia({video:true, audio:false}).then(
                stream => {
                    if(this.primaryVideoRef.current){
                        this.primaryVideoRef.current.srcObject = stream
                    }
                    this.setState({
                        screenShare: true
                    })
                },
                
                
            ).catch(err=>alert("Holaaaaa",err))
        }
        else{
            this.setState({
                screenShare: false
            })
            this.primaryVideoRef.current.srcObject = null
        }
    }
    render(){
        const {primaryVideo, partnerVideo, videoOn, audioOn, screenShare} = this.state
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