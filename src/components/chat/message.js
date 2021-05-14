import React, {Component} from 'react'
import { Header, Image } from 'semantic-ui-react'
import { toTitleCase } from '../../utils'
import './css/message.css'
var moment = require('moment')  

class MyMessage extends Component {

    constructor (props) {
        super(props)
    }

    render () {
        const { m, again, self } = this.props

        const { type, message } = m
        console.log(m)
        if (type === 'chat') {
            const { creation_time, sender, content } = message
            const who = self === "true" ? 'self' : 'else'
            const showProfileInfo = again !== "true"
            return (
                <>
                    {
                        showProfileInfo &&
                        <div className='message-user-info'>
                            <div>
                                <Image
                                    style={{ cursor: 'pointer' }}
                                    src={sender.profile_picture}
                                    avatar
                                    size='mini'
                                />
                            </div>
                            <div
                                className='message-user-name' 
                            >
                                {toTitleCase(sender.full_name)}
                            </div>
                        </div>
                    }
                    <div
                        className={`message-${who}`}
                    >
                        <div 
                            className={'message-content'}
                        >
                            {content}
                        </div>
                        <div
                            className={'message-time'}
                        >
                            {moment(creation_time).format('LT')}
                        </div>
                    </div>
                </>
            )
        } else {
            const sender = message.user
            console.log("message", message, sender)
            const { start_time, end_time } = message
            const time = type === "rec_start" ? start_time : end_time
            return (
                <>
                    <div
                        className={`recording-message ${type}`}
                    >
                        <div className='message-user-info'>
                            <div>
                                <Image
                                    style={{ cursor: 'pointer' }}
                                    src={sender.profile_picture}
                                    avatar
                                    size='mini'
                                />
                            </div>
                            <div
                                className='message-user-name' 
                            >
                                {toTitleCase(sender.full_name)}
                            </div>
                        </div>
                        <div 
                            className={'message-content'}
                        >
                            {type === 'rec_start' && 'Started recording'}
                            {type === 'rec_stop' && 'Stopped recording'}
                        </div>
                        <div
                            className={'message-time'}
                        >
                            {moment(time).format('LT')}
                        </div>
                    </div>
                </>
            )
        }
        
    }
}

export default MyMessage
