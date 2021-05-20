import { INITIALISE_MEETING, UPDATE_ATTENDEES, UPDATE_ORGANISERS } from './types'


export const initialiseMeeting = (meeting_data) => {
    return dispatch => {

        let meeting_info  = {}
        meeting_info['title'] = meeting_data['title']
        meeting_info['id'] = meeting_data['id']
        meeting_info['meeting_code'] = meeting_data['meeting_code']
        meeting_info['meeting_link'] = meeting_data['meeting_link']
        meeting_info['start_time'] = meeting_data['start_time']
        let attendees = []
        meeting_data['attendees'].forEach( a => {
            attendees.push(a['user'])
        })
        dispatch({
            type: INITIALISE_MEETING,
            payload: {
                loaded: true,
                error: false,
                loading: false,
                info: meeting_info,
                organisers: meeting_data['organizers'],
                attendees: attendees,
                recording: {}
            }
        })
    }
}

export const userJoin = (data, organisers, attendees) => {
    return dispatch => {
        const { user_data, rights } = data
        let index = -1;
        for (let i=0; i < organisers.length; i++) {
            if (organisers[i].id === user_data.id) {
                index = i; break;
            }
        }
        if (index !== -1) {
            if (rights === "Organiser") {
                return
            } else {
                organisers.splice(index, index)
                dispatch({
                    type: UPDATE_ORGANISERS,
                    payload: {organisers}
                })
                
                return
            }
        }

        index = -1;
        for (let i=0; i < attendees.length; i++) {
            if (attendees[i].id === user_data.id) {
                index = i; break;
            }
        }
        if (index !== -1) {
            if (rights === "Attendee") {
                return
            } else {
                attendees.splice(index, index)
                dispatch({
                    type: UPDATE_ATTENDEES,
                    payload: {attendees}
                })
                return
            }
        }

        if (rights === "Attendee") {
            attendees.push(user_data)
            dispatch({
                type: UPDATE_ATTENDEES,
                payload: {attendees}
            })
        } else {
            organisers.push(user_data)
            dispatch({
                type: UPDATE_ORGANISERS,
                payload: {organisers}
            })
        }
        return
    }
}

export const userLeft = (user_data, organisers, attendees) => {
    return dispatch => {
        
        let new_orgs = []
        for (let i=0; i < organisers.length; i++) {
            if (organisers[i].id === user_data.id) {
                continue;
            }
            new_orgs.push(organisers[i])
        }
        dispatch({
            type: UPDATE_ORGANISERS,
            payload: {organisers: new_orgs}
        })
        
        let new_atts = []
        for (let i=0; i < attendees.length; i++) {
            if (attendees[i].id === user_data.id) {
                continue;
            }
            new_atts.push(attendees[i])
        }
        dispatch({
            type: UPDATE_ATTENDEES,
            payload: {attendees: new_atts}
        })
    }
}
