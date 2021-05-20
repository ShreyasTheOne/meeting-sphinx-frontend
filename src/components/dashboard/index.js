import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {
    Button,
    Loader,
    Header,
    Table
} from 'semantic-ui-react'
import Scrollbars from 'react-custom-scrollbars'
import NavBar from '../nav/index'
import {apiGetMyMeetings, routeLobby} from '../../urls'
import './css/index.css'
import { Redirect } from 'react-router'

class Dashboard extends Component {

    constructor (props) {
        super(props)
        this.state = {
            past_meetings: null,
            ongoing_meetings: null,
            meeting_id: null,
            meeting_code: null,
        }
    }

    componentDidMount() {
        axios({
            url: apiGetMyMeetings(),
            method: 'get',
        }).then(res => {
            const { past_meetings, ongoing_meetings } = res.data
            this.setState({
                past_meetings, ongoing_meetings
            })
        }).catch(e => {

        })
    }

    goToMeeting = code => {
        this.setState({
            go_to_meeting: true,
            meeting_code: code
        })
    }

    seeMeetingDetails = id => {
        this.setState({
            see_meeting_details: true,
            meeting_id: id
        })
    }

    render(){
        const {
            past_meetings,
            ongoing_meetings
        } = this.state

        if (!past_meetings) {
            return (
                <Loader active={'true'} />
            )
        }

        if (this.state.go_to_meeting) {
            return (
                <Redirect to={`/lobby/${this.state.meeting_code}`} />
            )
        }
        if (this.state.see_meeting_details) {
            return (
                <Redirect to={`/details/${this.state.meeting_id}`} />
            )
        }

        return (
            <div id='dashboard-container'>
                <NavBar show_button={false} home_button={true}/>
                <div id='dashboard-content-container'>
                    <div id='dashboard-content'>

                        <div id='ongoing-meetings-container'>
                            <Header>
                                Ongoing Meetings
                            </Header>
                            <Scrollbars>
                                <Table
                                    basic={'very'}
                                >
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>
                                                Title
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>

                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                            {ongoing_meetings.map((meeting, index) => {
                                                return (
                                                    <Table.Row key={index}>
                                                        <Table.Cell>
                                                            <Header>
                                                                {meeting.title}
                                                            </Header>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Button
                                                                color={'black'}
                                                                onClick={() => {this.goToMeeting(meeting.meeting_code)}}
                                                            >
                                                                Join
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}
                                            {
                                                ongoing_meetings.length === 0 &&
                                                    <Table.Row>
                                                        <Table.Cell>
                                                            None
                                                        </Table.Cell>
                                                        <Table.Cell/>
                                                    </Table.Row>
                                            }
                                    </Table.Body>
                                </Table>
                            </Scrollbars>
                        </div>
                        <div id='past-meetings-container'>
                            <Header>
                                Past Meetings
                            </Header>
                            <Scrollbars>
                                <Table
                                    basic={'very'}
                                >
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>
                                                Title
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>

                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                            {past_meetings.map((meeting, index) => {
                                                return (
                                                    <Table.Row key={index}>
                                                    <Table.Cell>
                                                        <Header>
                                                            {meeting.title}
                                                        </Header>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Button
                                                            onClick={() => {this.seeMeetingDetails(meeting.id)}}
                                                        >
                                                            See Details
                                                        </Button>
                                                    </Table.Cell>
                                                    </Table.Row>
                                                )
                                            })}
                                            {
                                                past_meetings.length === 0 &&
                                                    <Table.Row>
                                                        <Table.Cell>
                                                            None
                                                        </Table.Cell>
                                                        <Table.Cell/>
                                                    </Table.Row>
                                            }
                                    </Table.Body>
                                </Table>
                            </Scrollbars>
                        </div>
                    </div>
                </div>
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
    null
)(Dashboard)