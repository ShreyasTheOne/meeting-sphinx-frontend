import { 
    CHANGE_MEETING_LOADING_LOADED_ERROR, 
    INITIALISE_MEETING, 
    UPDATE_ATTENDEES,
    UPDATE_ORGANISERS,
    UPDATE_RECORDER_TRUE,
    UPDATE_RECORDER_FALSE,
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
        case UPDATE_RECORDER_TRUE:
            return{
                ...state,
                recording: {
                    ...state.recording,
                    [action.payload]: `true`,
                }
            }
        case UPDATE_RECORDER_FALSE:
            return{
                ...state,
                recording: {
                    ...state.recording,
                    [action.payload]: `false`,
                }
            }
        default:
            return state
    }
}

export default meetingInformation
