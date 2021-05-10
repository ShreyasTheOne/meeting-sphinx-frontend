import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { 
    Button, 
    Container,
    Grid, 
    Modal,
    Input,
    Divider,
    Message
} from 'semantic-ui-react'
import NavBar from '../nav/index'
import { apiMeeting, apiMeetingJoin } from '../../urls'
import './css/index.css'
import { Redirect } from 'react-router'

class Home extends Component {

    constructor (props) {
        super(props)
        this.state = {
            createModalOpen: false ,
            joinModalOpen: false,
            joinModalInputError: false,
            joinErrorMessage: '',
            createModalInputError: false,
            createErrorMessage: '',
            meeting_joined: false,
            meeting_code: '',
        }
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
            if (error_code < 0) {
                this.setState({
                    meeting_joined: true,
                    meeting_code: meeting_code
                })
            } else {
                switch (error_code) {
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
            }
            
        }).catch(e => {
            console.log(e)
        })
    }

    createMeeting = (custom) => {
        const { meeting_link, meeting_title } = this.state
        if (!meeting_title) {
            this.setState({
                createModalInputError: true,
                createErrorMessage: "Please enter a meeting title!"
            })
            return
        }
        if (custom) {
            if (!meeting_link) {
                this.setState({
                    createModalInputError: true,
                    createErrorMessage: "Please enter a meeting link!"
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
                    this.setState({
                        meeting_joined: true,
                        meeting_code: res.data.meeting_code
                    })
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
                this.setState({
                    meeting_joined: true,
                    meeting_code: res.data.meeting_code
                })
            }).catch(err => {
                console.log(err)
            })
        }
    }

    render(){
        const { 
            createModalOpen, 
            joinModalOpen,
            createModalInputError,
            createErrorMessage,
            joinModalInputError,
            joinErrorMessage,
            meeting_joined,
            meeting_code
        } = this.state
        
        if (meeting_joined) {
            return (
                <Redirect to={`/lobby/${meeting_code}`} />
            )
        }

        return (
            <div id='home-container'>
                <NavBar show_button={false}/>
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
                    onClose={() => {this.setState({
                        createModalOpen: false, 
                        createModalInputError: false,
                        createErrorMessage: ''
                    })}}
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
                            Generate Sphinx Video Conference Link
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
                        {createModalInputError && 
                            <Message
                                content={createErrorMessage}
                                error
                            />
                        }
                    </Modal.Content>
                </Modal>
                <Modal
                    size='tiny'
                    closeIcon
                    closeOnDimmerClick
                    closeOnEscape
                    dimmer
                    open={joinModalOpen}
                    onClose={() => {this.setState({
                        joinModalOpen: false, 
                        joinModalInputError: false,
                        joinErrorMessage: ''
                    })}}
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
                            id='join-code-input'
                            size='big'
                            fluid
                            placeholder='Enter meeting code'
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