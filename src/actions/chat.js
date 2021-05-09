import { ADD_MESSAGE, INITIALISE_CHAT } from './types'


export const initialiseChat = (messages) => {
    return dispatch => {
        dispatch({
            type: INITIALISE_CHAT,
            payload: {
                loaded: true,
                error: false,
                loading: false,
                messages
            }
        })
    }
}

export const addMessage = (new_message, messages) => {
    return dispatch => {
        messages.push(new_message)
        dispatch({
            type: ADD_MESSAGE,
            payload: {messages}
        })
    }
}
