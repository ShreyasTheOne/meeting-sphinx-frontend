import { 
    CHANGE_MEETING_LOADING_LOADED_ERROR, 
    INITIALISE_MEETING, 
    UPDATE_ATTENDEES,
    UPDATE_ORGANISERS,
    UPDATE_RECORDER,
} from "../actions/types"

let initialState = {
    loaded: false,
    loading: false,
    data: {},
    error: false,
    organisers: [],
    attendees: [],
    recording: {},
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
        case UPDATE_RECORDER:
            return {
                ...state,
                recording: {
                    ...state.recording,
                    [action.payload.user_id]: action.payload.rec_state,
                }
            }
        default:
            return state
    }
}

export default meetingInformation
