import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { 
    Button, 
    Container,
    Grid, 
    Header, 
    Popup, 
    Modal,
    Image, 
    Icon,
    Input,
    Divider,
    Message
} from 'semantic-ui-react'
import { apiAuthLogout, apiMeeting, apiMeetingJoin, routeHome, routeLobby } from '../../urls'

import './css/index.css'

class Home extends Component {

    constructor (props) {
        super(props)
        this.state = {
            now: new Date().toLocaleString(),
            createModalOpen: false ,
            joinModalOpen: false,
            joinModalInputError: false,
            joinErrorMessage: '',
            createModalInputError: false,
            createErrorMessage: '',
            num_meetings: 0,
        }
    }

    logout = () => {
        axios({
            url: apiAuthLogout(),
            method: 'post',
        }).then(res => {
            window.location = routeHome()
        }).catch(e => {
            window.location = routeHome()
        })
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

    componentDidMount () {
        this.tick()
    }

    tick = () => {
        setInterval(
            () => {
                this.setState({
                    now: new Date().toLocaleString(),
                })
            }, 1000
        )
    }

    joinMeeting = () => {
        const { meeting_code } = this.state
        axios({
            url: apiMeetingJoin(),
            method: 'post',
            data: {meeting_code}
        }).then(res => {
            const error_code = res.data['error']
            const meeting_code = res.data['meeting_code']
            switch (error_code) {
                case -1:
                    // Enter meeting as attendee
                    window.location = routeLobby(meeting_code)
                    break
                case -2:
                    // Enter meeting as organiser
                    window.location = routeLobby(meeting_code)
                    break
                case -3:
                    // Enter meeting as attendee
                    window.location = routeLobby(meeting_code)
                    break
                case 1:
                    // User banned
                    this.setState({
                        joinModalInputError: true,
                        joinErrorMessage: "You are not allowed in this meeting!"
                    })
                    break
                case 2:
                    // Invalid meeting code
                    this.setState({
                        joinModalInputError: true,
                        joinErrorMessage: "Invalid meeting code!"
                    })
                    break
                default:
                    break
            }
        }).catch(e => {
            console.log(e)
        })
    }

    createMeeting = (custom) => {
        const { meeting_link, meeting_title } = this.state
        
        if (custom) {
            if (!meeting_link) {
                this.setState({
                    createModalInputError: true,
                })
                return
            } else {
                this.setState({
                    createModalOpen: false
                })
                const data = {
                    title: meeting_title,
                    meeting_link: meeting_link,
                }
                axios({
                    url: apiMeeting(),
                    method: 'post',
                    data: data
                }).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
            }
        } else {
            this.setState({
                createModalOpen: false
            })
            const data = {
                title: meeting_title,
            }
            axios({
                url: apiMeeting(),
                method: 'post',
                data: data
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    render(){
        const { UserInformation } = this.props
        const { 
            now, 
            createModalOpen, 
            joinModalOpen,
            createModalInputError,
            joinModalInputError,
            joinErrorMessage,
            num_meetings
        } = this.state
        const user = UserInformation.data
        
        return (
            <div id='home-container'>
                <div id='home-nav'>
                    <div id='home-nav-left'>
                        <div>
                            <Popup
                                hideOnScroll
                                position='bottom center'
                                on="click"
                                style={{ padding: "0px" }}
                                trigger={
                                    <Image
                                        style={{ cursor: 'pointer' }}
                                        src={user.profile_picture}
                                        avatar
                                        size='tiny'
                                    />
                                }
                            >
                                <Button
                                    color='black'
                                    size='large'
                                    fluid
                                    onClick={this.logout}
                                >
                                    <Icon name='log out' />
                                    Logout
                                </Button>
                            </Popup>
                        </div>
                        <Header id='home-header' size='huge'>
                            Hi, {this.toTitleCase(user.full_name)}!
                        </Header>
                    </div>
                    <div id='home-nav-right'>
                        <Button
                            color='red'
                            id='home-num-meetings'
                            size='large'
                        >
                            {num_meetings} ongoing meetings
                        </Button>
                        <Header id='home-time' size='huge'>
                            {now}
                        </Header>
                    </div>
                </div>
                <div id='home-content-container'>
                    <div id='home-content'>
                        <div id='home-title'>
                            <div className='home-title-text'>
                                The
                            </div>
                            <div className='home-title-text'>
                                Meeting
                            </div>
                            <div className='home-title-text'>
                                Sphinx
                            </div>
                        </div>

                        <div id='home-button-div'>
                            <Container id='home-seg'> 
                                <Grid divided='vertically' id='home-grid'>
                                    <Grid.Row id='home-grid-top'>
                                        <Button 
                                            size={'massive'}
                                            color='black'
                                            onClick={() => {this.setState({joinModalOpen: true})}}
                                            basic
                                        >
                                            Join a Meeting
                                        </Button>
                                    </Grid.Row>
                                    <Grid.Row id='home-grid-bottom'>
                                        <Button 
                                            size={'massive'}
                                            color='black'
                                            onClick={() => {this.setState({createModalOpen: true})}}
                                        >
                                            Create a Meeting
                                        </Button>
                                    </Grid.Row>
                                </Grid>
                            </Container>
                        </div>
                    </div>
                </div>

                <Modal
                    size='tiny'
                    closeIcon
                    closeOnDimmerClick
                    closeOnEscape
                    open={createModalOpen}
                    onClose={() => {this.setState({createModalOpen: false})}}
                >
                    <Modal.Header>
                        <Input
                            placeholder='Enter title of meeting'
                            transparent
                            fluid
                            onChange={(e, d) => this.setState({meeting_title: d.value})}
                        />
                    </Modal.Header>
                    <Modal.Content
                        id='createModalContent'
                    >
                        <Button
                            size='big'
                            fluid
                            color='red'
                            inverted
                            onClick={() => this.createMeeting(false)}
                        >
                            Generate Sphinx Meeting Link
                        </Button>
                        <Divider horizontal>Or</Divider>
                        <Input
                            error={createModalInputError}
                            action={{
                                color:'red',
                                content: 'Create',
                                onClick: () => this.createMeeting(true)
                            }}
                            onChange={(e, d) => this.setState({meeting_link: d.value})}
                            size='big'
                            fluid
                            placeholder='Enter a custom meeting link...'
                        />
                    </Modal.Content>
                </Modal>
                <Modal
                    size='tiny'
                    closeIcon
                    closeOnDimmerClick
                    closeOnEscape
                    dimmer
                    open={joinModalOpen}
                    onClose={() => {this.setState({joinModalOpen: false})}}
                >
                    <Modal.Header>
                        Join a Meeting
                    </Modal.Header>
                    <Modal.Content>
                        <Input
                            error={joinModalInputError}
                            action={{
                                color:'red',
                                content: 'Join',
                                onClick: () => this.joinMeeting()
                            }}
                            onChange={(e, d) => this.setState({
                                meeting_code: d.value, 
                                joinModalInputError: false
                            })}
                            size='big'
                            fluid
                            placeholder='Enter a custom meeting link...'
                        />
                        {joinModalInputError && 
                            <Message
                                content={joinErrorMessage}
                                error
                            />
                        }
                    </Modal.Content>
                </Modal>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        UserInformation: state.userInformation
    }
}

const mapDispatchToProps = dispatch => {
    return {
        
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)
