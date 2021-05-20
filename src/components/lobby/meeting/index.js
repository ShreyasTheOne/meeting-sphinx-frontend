import React, { Component } from 'react'
import Peer from 'simple-peer'
import { connect } from 'react-redux'
import {Button, Icon, Modal, Label, Header, Image, Popup} from 'semantic-ui-react'
import {
    USER_JOINED,
    ALL_USERS,
    HEY,
    CALL_ACCEPTED,
    USER_TURNED_OFF_VIDEO,
    SENDING_SIGNAL,
    RETURNING_SIGNAL,
    USER_LEFT
} from "../messageTypes"
import {apiWSVideoCall, routeHome} from '../../../urls'
import './css/index.css'
import { toTitleCase } from '../../../utils'
import Videos from './videos'

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
        this.attendee_streams = {}
        this.attendee_stream_refs = {}
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

        let organisers = this.props.MeetingInformation.organisers
        let org_ids = []
        organisers.forEach(o => {org_ids.push(o.id)})

        if (org_ids.includes(user.id)) {
            console.log("I'm an org")
            navigator.mediaDevices.getUserMedia({video: { width: 1200, height: 680 }, audio: false})
                .then( stream => {
                    this.myStream = stream
                    if (this.primaryVideoRef.current)
                        this.primaryVideoRef.current.srcObject = stream
                    let {attendees} = this.props.MeetingInformation
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
                            let new_stream = {}
                            new_stream['user'] = {'id': userID}
                            attendees.forEach(a => {
                                if (a.id === userID) {
                                    new_stream['user'] = a
                                }
                            })
                            new_stream['stream'] = stream
                            this.attendee_streams[userID] = new_stream
                            this.attendee_stream_refs[userID] = [React.createRef(), React.createRef()]
                        })
                        this.peers[userID] = peer
                    })
                    this.setState({
                        myVideoOn: true,
                    })
                })
                .catch( err => {
                    console.log("err", err)
                })
        } else {
            console.log("I'm NOT an org")
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
                    window.location = routeHome()
                })
            navigator.mediaDevices.getUserMedia({video: {width: 345, height: 195}, audio: false})
                .then(stream => {
                    this.myStream = stream
                    users.forEach(userID => {
                        if (userID === user.id) return
                        // if (!org_ids.includes(userID)) return

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
                            let organisers = this.props.MeetingInformation.organisers
                            let attendees = this.props.MeetingInformation.attendees
                            let org_ids = []
                            organisers.forEach(o => {org_ids.push(o.id)})

                            if (!org_ids.includes(userID)){
                                let new_stream = {}
                                new_stream['user'] = {'id': userID}
                                console.log("attendees length", attendees.length)
                                console.log("attendees", attendees)
                                attendees.forEach(a => {
                                    // console.log("attends", a.user.id, userID)
                                    if (a && a.id === userID) {

                                        new_stream['user'] = a
                                    }
                                })
                                new_stream['stream'] = stream
                                this.attendee_streams[userID] = new_stream
                                this.attendee_stream_refs[userID] = React.createRef()
                            } else {
                                if (this.primaryVideoRef.current) {
                                    this.primaryVideoRef.current.srcObject = stream
                                }
                            }
                        })
                        this.peers[userID] = peer
                    })
                    this.setState({
                        myVideoOn: true,
                    })
                })
                .catch(err => {
                    console.log("err", err)
                })
        }
    }

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
                    const userID = d.from
                    let organisers = this.props.MeetingInformation.organisers
                    let attendees = this.props.MeetingInformation.attendees
                    let org_ids = []
                    organisers.forEach(o => {org_ids.push(o.id)})
                    if (!org_ids.includes(userID)){
                        let new_stream = {}
                        new_stream['user'] = {'id': userID}
                        attendees.forEach(a => {
                            if (a.id === userID) {
                                new_stream['user'] = a
                            }
                        })
                        new_stream['stream'] = stream
                        this.attendee_streams[userID] = new_stream
                        this.attendee_stream_refs[userID] = [React.createRef(), React.createRef()]
                    } else {
                        if (this.primaryVideoRef.current) {
                            this.primaryVideoRef.current.srcObject = stream
                        }
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

    handleUserLeft = d => {
        if (this.attendee_streams[d]) {
            this.attendee_streams[d] = null
        }
        if (this.attendee_stream_refs[d]) {
            this.attendee_stream_refs[d] = null
        }
        if (this.peers[d]) {
            this.peers[d].destroy()
            this.peers[d] = null
        }
        if (this.acceptingPeers[d]) {
            this.acceptingPeers[d].destroy()
            this.acceptingPeers[d] = null
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
                case USER_LEFT:
                    this.handleUserLeft(d)
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
            navigator.mediaDevices.getUserMedia({video: { width: 1200, height: 680 }, audio: true})
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
                        }
                    })
                    this.setState({
                        myVideoOn: true,
                    })
                })
                .catch( err => {
                    console.log("err", err)
                })


        }
    }

    showPeople () {
        this.setState({
            showPeopleModalOpen: true
        })
    }
    

    render(){
        const {myVideoOn, myAudioOn, screenShare} = this.state
        let organisers = this.props.MeetingInformation.organisers
        const {attendees, recording} = this.props.MeetingInformation
        let org_ids = []
        organisers.forEach(o => {org_ids.push(o.id)})
        const user = this.props.UserInformation.data
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
                    <Modal
                        closeIcon
                        id={'videos-modal'}
                        closeOnDimmerClick
                        closeOnEscape
                        dimmer
                        basic
                        open={this.state.showPeopleModalOpen}
                        onClose={() => {this.setState({
                            showPeopleModalOpen: false,
                        })}}
                    >
                        <Modal.Content>
                            <Videos
                                ughh={new Date().toLocaleString()}
                                show_header={true}
                                in_modal={true}
                                per_row={5}
                                organisers={organisers}
                                attendees={attendees}
                                recording={recording}
                                attendee_streams={this.attendee_streams}
                                attendee_stream_refs={this.attendee_stream_refs}
                            />
                        </Modal.Content>
                    </Modal>
                    <div id="controlsContainer">
                        <Popup
                            basic
                            inverted
                            flowing
                            position={'top right'}
                            content={'See all attendees'}
                            trigger={
                                <Button
                                    onClick={this.showPeople.bind(this)}
                                    icon
                                    size={"large"}
                                    circular
                                    color='white'
                                >
                                    <Icon
                                        name={"user outline"}
                                        color={"black"}
                                    />
                                </Button>
                            }
                        />
                        {
                            (organisers[0] && !org_ids.includes(user.id)) ?
                                <Label
                                    style={{marginLeft: '1rem'}}
                                    as='a'
                                    color='black'
                                    image
                                    size={'medium'}
                                >
                                  <img src={organisers[0]['profile_picture']} />
                                    {toTitleCase(organisers[0]['full_name'])}
                                  <Label.Detail>Organiser</Label.Detail>
                                </Label>
                                :
                                <span style={{marginLeft: '1rem', fontSize: '2rem', color: 'white'}}>
                                    You are the organiser
                                </span>
                        }
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