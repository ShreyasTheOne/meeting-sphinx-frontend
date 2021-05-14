import { ADD_MESSAGE, INITIALISE_CHAT, UPDATE_RECORDER_TRUE, UPDATE_RECORDER_FALSE } from './types'


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

export const addRecMessage = (new_message, messages, type) => {
    return dispatch => {
        let new_message_append = {
            'type': `rec_${type}`,
            'message': new_message
        }

        messages.push(new_message_append)
        dispatch({
            type: ADD_MESSAGE,
            payload: {messages}
        })

        if(type == "start"){
            dispatch({
                type: UPDATE_RECORDER_TRUE,
                payload: new_message.id,
            })
        }
        else{
            dispatch({
                type: UPDATE_RECORDER_FALSE,
                payload: new_message.id,
            })            
        }
    }
}
