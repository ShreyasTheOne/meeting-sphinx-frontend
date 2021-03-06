import React, {Component} from 'react'
import {connect} from 'react-redux'
import {apiBanUser, apiWSMeetings, routeHome} from '../../urls'
import  {
    USER_JOINED,
    USER_LEFT,
    MEETING_DATA,
    ORGANISER_LEFT,
    USER_BANNED,
    RECORDING_STARTED,
    RECORDING_STOPPED
} from './messageTypes'
import {
    initialiseMeeting, userJoin, userLeft
} from '../../actions/meeting'
import './css/index.css'
import NavBar from '../nav/index'
import { Button, Header, Icon, Loader, Modal } from 'semantic-ui-react'
import Chat from '../chat'
import People from './people'
import Meeting from './meeting'
import axios from "axios";


class Lobby extends Component {

    constructor(props) {
        super(props)

        const { code } = this.props.match.params
        this.meetingWebsocket = new WebSocket( apiWSMeetings(code) )

        this.state = {
            code,
            showEndMeetingModal: false,
            showBannedModal: false
        }
        
        document.cookie = `current_meeting=${code};max-age=604800;path=/`
    }

    handleUserBanned = d => {
        if (this.props.UserInformation.data.id === d.user_id) {
            this.setState({
                showBannedModal: true
            })
            setTimeout(
                () => { window.location = routeHome() },
                1500
            )
        }
    }

    componentDidMount () {
        this.meetingWebsocket.onmessage = e => {
            const data = JSON.parse(e.data)
            const type = data.type
            const d = data.data
            switch (type) {
                case USER_JOINED:
                    this.props.UserJoin(
                        d, 
                        this.props.MeetingInformation.organisers,
                        this.props.MeetingInformation.attendees
                    )
                    break
                case USER_LEFT:
                    this.props.UserLeft(
                        d, 
                        this.props.MeetingInformation.organisers,
                        this.props.MeetingInformation.attendees
                    )
                    break
                case MEETING_DATA:
                    this.props.InitialiseMeeting(d)
                    break
                case ORGANISER_LEFT:
                    this.leaveMeeting()
                    break
                case USER_BANNED:
                    this.handleUserBanned(d)
                    break
                default:
                    break
            }
        }
    }
    
    leaveMeeting = () => {
        this.meetingWebsocket.close()
        this.setState({
            showEndMeetingModal: true
        })
    }

    fitTitle = title => {
        if (title.length > 20) {
            return `${title.slice(0, 20)}...`
        } else {
            return title
        }
    }

    copyCode = code => {
        navigator.clipboard.writeText(code)
    }

    banUser = id => {
        this.meetingWebsocket.send(JSON.stringify({
            'type': 'user_banned',
            'data': {'user_id': id, 'meeting_id': this.props.MeetingInformation.info.id},
        }))
    }


    render(){
        const { code, joinModalOpen, showEndMeetingModal, showBannedModal } = this.state
        const { UserInformation, MeetingInformation } = this.props
        const { organisers, attendees, recording, info } = MeetingInformation
        const user = UserInformation.data
        console.log("recording", recording)
        if (MeetingInformation.loaded === false) {
            return (
                <Loader active />
            )
        } else {
            if (MeetingInformation.info.meeting_link === 'pasta') {
                return (
                    <div id='lobby-container' >
                    <NavBar show_button={true}/>
                    <div id='lobby-internal-container'>
                        <div id='lobby-meeting-info'>
                            <div>
                                <Header id='lobby-meeting-heading'>
                                    {this.fitTitle(MeetingInformation.info.title)}
                                </Header>
                            </div>
                            <Button.Group
                                id='lobby-joining-info'
                            >
                                <Button
                                    color='black'
                                    onClick={() => {this.setState({joinModalOpen: true})}}
                                >
                                    See Participants
                                </Button>
                                <Button
                                    labelPosition='right'
                                    icon
                                    primary
                                    id='code-button'
                                    onClick={() => {this.copyCode(MeetingInformation.info.meeting_code)}}
                                >
                                    Copy Joining Info
                                    <Icon name='copy' />
                                </Button>
                            </Button.Group>
                        <Meeting meeting_code={MeetingInformation.info.meeting_code} />
                            <Modal
                                size='large'
                                closeIcon
                                closeOnDimmerClick
                                closeOnEscape
                                dimmer
                                open={joinModalOpen}
                                onClose={() => {this.setState({
                                    joinModalOpen: false, 
                                })}}
                            >
                                <Modal.Content>
                                <People
                                    banUser={this.banUser.bind(this)}
                                    organisers={organisers}
                                    attendees={attendees}
                                    recording={recording}
                                    meeting_info={info}
                                    self_user={this.props.UserInformation.data}
                                />
                                </Modal.Content>
                            </Modal>
                            <Modal
                                size='tiny'
                                dimmer
                                open={showEndMeetingModal}
                                onClose={() => {window.location = routeHome()}}
                            >
                                <Modal.Content>
                                    <p>
                                        The organiser has ended this meeting!
                                    </p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button 
                                        color='green' 
                                        inverted 
                                        onClick={() => {window.location = routeHome()}}
                                    >
                                        Okay
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                            <Modal
                                size='tiny'
                                dimmer
                                open={showBannedModal}
                                onClose={() => {window.location = routeHome()}}
                            >
                                <Modal.Content>
                                    <p>
                                        You have been removed from this meeting by the organizer :)
                                    </p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button
                                        color='green'
                                        inverted
                                        onClick={() => {window.location = routeHome()}}
                                    >
                                        Okay
                                    </Button>
                                </Modal.Actions>
                            </Modal>                           
                        </div>
                        <div id='lobby-chat-div'>
                            <Chat 
                                meetingCode={MeetingInformation.info.meeting_code}
                                user={user}
                            />
                        </div>
                    </div>
                </div>
                )
            } else {
                return (
                    <div id='lobby-container' >
                        <NavBar show_button={true}/>
                        <div id='lobby-internal-container'>
                            <div id='lobby-meeting-info'>
                                <div>
                                    <Header id='lobby-meeting-heading'>
                                        {this.fitTitle(MeetingInformation.info.title)}
                                    </Header>
                                </div>
                                <Button.Group
                                    id='lobby-joining-info'
                                >
                                    <Button
                                        color='black'
                                        as={'a'}
                                        href={MeetingInformation.info.meeting_link}
                                        target='_blank'
                                    >
                                        Join Video Conference
                                    </Button>
                                    <Button
                                        labelPosition='right'
                                        icon
                                        primary
                                        id='code-button'
                                        onClick={() => {this.copyCode(MeetingInformation.info.meeting_code)}}
                                    >
                                        Copy Joining Info
                                        <Icon name='copy' />
                                    </Button>
                                </Button.Group>
                                <People
                                    banUser={this.banUser.bind(this)}
                                    organisers={organisers}
                                    attendees={attendees}
                                    recording={recording}
                                    meeting_info={info}
                                    self_user={this.props.UserInformation.data}
                                />
                                <Modal
                                    size='tiny'
                                    dimmer
                                    open={showEndMeetingModal}
                                    onClose={() => {window.location = routeHome()}}
                                >
                                    <Modal.Content>
                                        <p>
                                            The organiser has ended this meeting!
                                        </p>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button 
                                            color='green' 
                                            inverted 
                                            onClick={() => {window.location = routeHome()}}
                                        >
                                            Okay
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                                <Modal
                                    size='tiny'
                                    dimmer
                                    open={showBannedModal}
                                    onClose={() => {window.location = routeHome()}}
                                >
                                    <Modal.Content>
                                        <p>
                                            The organiser has ended this meeting!
                                        </p>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button
                                            color='green'
                                            inverted
                                            onClick={() => {window.location = routeHome()}}
                                        >
                                            Okay
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </div>
                            <div id='lobby-chat-div'>
                                <Chat 
                                    meetingCode={MeetingInformation.info.meeting_code}
                                    user={user}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }
}
const mapStateToProps = state => {
    return {
        UserInformation: state.userInformation,
        MeetingInformation: state.meetingInformation
    }
}

const mapDispatchToProps = dispatch => {
    return {
        InitialiseMeeting: (meeting_data) => {
            return dispatch(initialiseMeeting(meeting_data))
        },
        UserJoin: (data, orgs, atts) => {
            return dispatch(userJoin(data, orgs, atts))
        },
        UserLeft: (data, orgs, atts) => {
            return dispatch(userLeft(data, orgs, atts))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby)


