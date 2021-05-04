import { 
    CHANGE_USER_LOGIN_LOADED_ERROR, 
    INITIALISE_USER 
} from "../actions/types"

let initialState = {
    loaded: false,
    login: false,
    data: {},
    error: false,
    googleState: '',
}

const userInformation = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_USER_LOGIN_LOADED_ERROR:
            return {
                ...state,
                login: action.payload.login,
                loaded: action.payload.loaded,
                error: action.payload.error
            }
        case INITIALISE_USER:
            return action.payload
        default:
            return state
    }
}

export default userInformation