import { 
    INITIALISE_CHAT,
    ADD_MESSAGE
} from "../actions/types"

let initialState = {
    loaded: false,
    loading: false,
    messages: []
}

const chatInformation = (state = initialState, action) => {
    switch (action.type) {
        case INITIALISE_CHAT:
            return action.payload
        case ADD_MESSAGE:
            return {
                ...state,
                messages: action.payload.messages
            }
        default:
            return state
    }
}

export default chatInformation
