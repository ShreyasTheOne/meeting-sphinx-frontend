import { combineReducers } from 'redux'

import userInformation  from './user'
import meetingInformation from './meeting'
import chatInformation from './chat'

const reducers = combineReducers({
    userInformation,
    meetingInformation,
    chatInformation
})

export default reducers