import React, {Component} from 'react'
import { 
    Button, 
    Image,
    Popup,
    Icon,
    Header,
    Divider,
    Modal
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import './css/index.css'
import { Redirect } from 'react-router-dom'
import {
    logoutUser
} from '../../actions/user'
import {routeDashboard, routeHome} from '../../urls'
import { toTitleCase } from '../../utils'

var moment = require('moment')

class NavBar extends Component {

    constructor (props) {
        super(props)
        this.state = {
            now: new Date(),
        }
    }

    componentDidMount () {
        this.tick()
    }

    tick = () => {
        setInterval(
            () => {
                this.setState({
                    now: new Date(),
                })
            }, 1000
        )
    }

    redirectToDashboard () {
       this.setState(({
           goToDashboard: true
       }))
    }
    
    goBackHome = () => {
        window.location = routeHome()
    }

    leaveMeeting = () => {
        const { UserInformation, MeetingInformation } = this.props
        const user = UserInformation.data
        const { organisers } = MeetingInformation
        for (let i=0; i<organisers.length; i++) {
            if (organisers[i].id === user.id) {
                this.setState({
                    confirmLeaveModalOpen: true
                })
                return
            }
        }

        this.goBackHome()
    }

    render () {
        const { UserInformation, show_button, dashboard_button, home_button } = this.props
        const user = UserInformation.data
        const { now } = this.state

        if (this.state.goToDashboard) {
            return (
                <Redirect to={'/dashboard'} />
            )
        }

        return (
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
                                onClick={() => this.props.LogOut()}
                            >
                                <Icon name='log out' />
                                Logout
                            </Button>
                        </Popup>
                    </div>
                    <Header id='home-header' size='huge'>
                        Hi, {toTitleCase(user.full_name)}!
                    </Header>
                </div>
                <div id='home-nav-right'>
                    {
                        show_button &&
                            <Button
                                color='red'
                                id='home-num-meetings'
                                size='large'
                                onClick={this.leaveMeeting.bind(this)}
                            >
                                Leave Meeting
                            </Button>
                    }
                    {
                        dashboard_button &&
                            <Button
                                color='black'
                                id='home-num-meetings'
                                size='large'
                                onClick={this.redirectToDashboard.bind(this)}
                            >
                                Dashboard
                            </Button>
                    }
                    {
                        home_button &&
                            <Button
                                color='blue'
                                id='home-num-meetings'
                                size='large'
                                onClick={this.goBackHome.bind(this)}
                            >
                                Go Home
                            </Button>
                    }
                    <Header id='home-time' size='huge'>
                        {moment(now).format('MMMM Do YYYY, h:mm:ss a')}
                    </Header>
                </div>
                <Modal
                    basic
                    onClose={() => this.setState({confirmLeaveModalOpen: false})}
                    open={this.state.confirmLeaveModalOpen}
                    size='small'
                >
                    <Header icon>
                        <Icon name='trash alternate outline' />
                        Leave Meeting?
                    </Header>
                    <Modal.Content>
                        <p>
                        You are the organiser of this meeting. If you leave, the meeting will end.
                        Are you sure you want to leave?
                        </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button 
                            basic 
                            color='red' 
                            inverted 
                            onClick={() => this.setState({confirmLeaveModalOpen: false})}
                        >
                            <Icon name='remove' /> No
                        </Button>
                        <Button 
                            color='green' 
                            inverted 
                            onClick={() => this.goBackHome()}
                        >
                            <Icon name='checkmark' /> Yes
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        UserInformation: state.userInformation,
        MeetingInformation: state.meetingInformation,  
    }
}

const mapDispatchToProps = dispatch => {
    return {
        LogOut: () => {
            return dispatch(logoutUser())
        },
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar)
