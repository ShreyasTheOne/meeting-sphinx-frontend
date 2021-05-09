import React, {Component} from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import {connect} from 'react-redux'
import { apiWSMeetings } from '../../urls'
import  {
    USER_JOINED,
    USER_LEFT,
    MEETING_DATA
} from './messageTypes'
import {
    initialiseMeeting, userJoin, userLeft
} from '../../actions/meeting'
import './css/index.css'
import NavBar from '../nav/index'
import { Button, Card, Header, Icon, Image } from 'semantic-ui-react'
import Chat from '../chat'


class Lobby extends Component {

    constructor(props) {
        super(props)

        const { code } = this.props.match.params
        this.meetingWebsocket = new WebSocket( apiWSMeetings(code) )

        this.state = {
            code
        }
    }

    componentDidMount () {
        this.meetingWebsocket.addEventListener(
            "open",
            event => {
                // console.log(event)
            }
        )

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
                default:
                    break
            }
        }
    }

    fitTitle = title => {
        if (title.length > 20) {
            return `${title.slice(0, 20)}...`
        } else {
            return title
        }
    }

    toTitleCase (input) {
        if (!input) return ''
        let words = input.split(' ');  
        let ans = [];  
        words.forEach(element => {  
            ans.push(element[0].toUpperCase() + element.slice(1, element.length).toLowerCase());  
        });  
        return ans.join(' '); 
    }

    copyCode = code => {
        navigator.clipboard.writeText(code)
    }

    render(){
        const { code } = this.state
        const { UserInformation, MeetingInformation } = this.props
        const { organisers, attendees } = MeetingInformation
        const user = UserInformation.data
        if (MeetingInformation.loaded === false) {
            return (
                <>
                    <div>
                        MEETING CODE: {code}
                    </div>
                    <div>
                        USER INFO: {user.full_name}, {user.email}
                    </div>
                </>
            )
        } else {
            return (
                <div id='lobby-container' >
                    <NavBar/>
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
                                    // onClick={() => {window.open(MeetingInformation.info.meeting_link)}}
                                    onClick={() => {alert("https://www.google.com")}}
                                    // onClick={() => {window.open("https://www.google.com")}}
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
                            <Scrollbars style={{ width: 1000, height: 600 }}>
                                <div id='lobby-scrollbars'>
                                <Header id='lobby-orgs'>
                                    Organisers
                                </Header>
                                <Card.Group itemsPerRow={3}>
                                    {
                                        organisers.map((p, index) => {
                                            return (
                                                <Card
                                                    key={index}
                                                    color={'black'}
                                                    fluid
                                                >
                                                    <Card.Content>
                                                        <div className='lobby-person-card'>
                                                            <Image className='lobby-ppp' circular size={"mini"} src={p['profile_picture']}/>
                                                            <span
                                                                className='lobby-pfn'
                                                            >
                                                                {this.toTitleCase(p['full_name'])}
                                                            </span>
                                                        </div>
                                                    </Card.Content>
                                                </Card>
                                            )
                                        })
                                    }
                                </Card.Group>
                                <Header id='lobby-atts'>
                                    Attendees
                                </Header>
                                <Card.Group itemsPerRow={3}>
                                    {
                                        attendees.map((p, index) => {
                                            return (
                                                <Card
                                                    key={index}
                                                    color={'blue'}
                                                    fluid
                                                >
                                                    <Card.Content>
                                                        <div className='lobby-person-card'>
                                                            <Image className='lobby-ppp' circular size={"mini"} src={p['profile_picture']}/>
                                                            <span
                                                                className='lobby-pfn'
                                                            >
                                                                {this.toTitleCase(p['full_name'])}
                                                            </span>
                                                        </div>
                                                    </Card.Content>
                                                </Card>
                                            )
                                        })
                                    }
                                </Card.Group>
                                </div>
                            </Scrollbars>
                        </div>
                        <div id='lobby-chat-div'>
                            <Chat meetingCode={MeetingInformation.info.meeting_code}/>
                        </div>
                    </div>
                </div>
            )
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


