import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {
    Loader,
    Header,
    Table,
} from 'semantic-ui-react'
import Scrollbars from 'react-custom-scrollbars'
import People from '../../lobby/people'
import NavBar from '../../nav/index'
import './css/index.css'
import { apiMeetingDetails } from '../../../urls'
var moment = require('moment')

class MeetingDetails extends Component {

    constructor (props) {
        super(props)
        this.state = {
            meeting_id: null
        }
    }

    componentDidMount() {
        axios({
            url: apiMeetingDetails(this.props.match.params.id),
            method: 'get',
        }).then(res => {
            console.log(res.data)
            const { title, organizers, start_time, end_time, recordings } = res.data
            const new_attendees = res.data.attendees
            let attendees = []
            new_attendees.forEach(a => {
                attendees.push(a.user)
            })
            this.setState({
                title, organizers, attendees, start_time, end_time, recordings ,meeting_id : res.data.id
            })
        }).catch(e => {

        })
    }

    fitTitle = title => {
        if (title.length > 20) {
            return `${title.slice(0, 20)}...`
        } else {
            return title
        }
    }

    render(){
        const {
            title,
            organizers,
            attendees,
            start_time,
            end_time,
            recordings,
            meeting_id
        } = this.state
        const { UserInformation } = this.props
        const user = UserInformation.data
        if (!meeting_id) {
            return (
                <Loader active={'true'} />
            )
        }

        return (
            <div id='details-container'>
                <NavBar show_button={false} home_button={true}/>
                <div id='details-content-container'>
                    <div id='details-people-info'>
                        <div>
                            <Header id='details-meeting-heading'>
                                {this.fitTitle(title)}
                            </Header>
                        </div>
                        <div>
                            <Header> {moment(start_time).format('LLL')} - {moment(end_time).format('LLL')} </Header>
                        </div>
                        <People organisers={organizers} attendees={attendees} self_user={user}/>
                    </div>
                    {
                    recordings &&
                    <div id='details-recording-info' >
                        <div>
                            <Header id='details-meeting-heading'>
                                Recordings Log
                            </Header>
                        </div>

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
                                    {recordings.map((rec, index) => {
                                        return (
                                            <Table.Row key={index}>
                                                <Table.Cell>
                                                    <Header>
                                                        {rec.user.full_name}
                                                    </Header>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Header> {moment(rec.start_time).format('LLL')} - {moment(rec.end_time).format('LLL')}</Header>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                    {
                                        recordings.length === 0 &&
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
                    }
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
)(MeetingDetails)