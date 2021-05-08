import { 
    CHANGE_MEETING_LOADING_LOADED_ERROR, 
    INITIALISE_MEETING, 
    UPDATE_ATTENDEES,
    UPDATE_ORGANISERS
} from "../actions/types"

let initialState = {
    loaded: false,
    loading: false,
    data: {},
    error: false,
    organisers: [],
    attendees: []
}

const meetingInformation = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_MEETING_LOADING_LOADED_ERROR:
            return {
                ...state,
                loading: action.payload.loading,
                loaded: action.payload.loaded,
                error: action.payload.error
            }
        case INITIALISE_MEETING:
            return action.payload
        case UPDATE_ATTENDEES:
            return {
                ...state,
                attendees: action.payload.attendees
            }
        case UPDATE_ORGANISERS:
            return {
                ...state,
                organisers: action.payload.organisers
            }
        default:
            return state
    }
}

export default meetingInformation
