import React, {Component} from 'react'
import { Image, Segment } from 'semantic-ui-react'
import './css/message.css'

class Message extends Component {

    render () {
        const { m, again } = this.props
        const { creation_time, sender, content } = m
        if (again) {
            return (
                <>
                    <div className='message-box'>
                        <Image avatar size={'tiny'} src={sender['profile_picture']}/>
                        {sender['full_name']}
                        <div className='mesage-content'>
                            {content}
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className='message-box'>
                        <Image avatar size={'tiny'} src={sender['profile_picture']}/>
                        {sender['full_name']}
                        <div className='mesage-content'>
                            {content}
                        </div>
                    </div>
                </>
            )
        }
    }
}

export default Message
