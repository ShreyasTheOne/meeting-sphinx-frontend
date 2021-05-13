import React, {Component} from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { Button, Segment, Label, Input } from 'semantic-ui-react'
import { addMessage, addRecMessage, initialiseChat } from '../../actions/chat'
import { apiWSChat } from '../../urls'
import {
    SEND_MESSAGE,
    MESSAGE_DATA,
    RECORDING_STARTED,
    RECORDING_STOPPED
} from '../lobby/messageTypes'
import MyMessage from './message'
import './css/index.css'

class Chat extends Component {

    constructor (props) {
        super(props)
        const meeting_code = this.props.meetingCode
        this.chatWebSocket = new WebSocket(apiWSChat(meeting_code))
        this.state = {message: null, sendingMessage: false}
    }

    componentDidMount () {
        this.scrollToBottom()

        const input_field = document.getElementById('message-input-box')
        input_field.addEventListener("keyup",  (e) => {
            if(e.key === "Enter"){
                this.sendMessage();
            }
        })

        this.chatWebSocket.onmessage = e => {
            const data = JSON.parse(e.data)
            const type = data.type
            const d = data.data
            this.setState({
                sendingMessage: false
            })
            switch (type) {
                case MESSAGE_DATA:
                    this.props.InitialiseChat(d)
                    break
                case SEND_MESSAGE:
                    this.props.AddMessage(
                        d,
                        this.props.ChatInformation.messages
                    )
                    break
                case RECORDING_STARTED:
                    this.props.AddRecMessage(
                        d,
                        this.props.ChatInformation.messages,
                        'start'
                    )
                    break
                case RECORDING_STOPPED:
                    this.props.AddRecMessage(
                        d,
                        this.props.ChatInformation.messages,
                        'stop'
                    )
                    break
                default:
                    break
            }
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" })
    }
      
    componentDidUpdate() {
        this.scrollToBottom()
    }

    sendMessage = () => {
        const {message} = this.state
        if (!message) return

        document.getElementById('message-input-box').value=''
        this.setState({
            sendingMessage: true
        })
        this.chatWebSocket.send(JSON.stringify(
            {
                'content': message
            }
        ))
    }

    updateMessage = d => {
        this.setState({
            message: d
        })
    }

    render () {
        const { ChatInformation, user } = this.props
        const { messages } = ChatInformation
        return (
            <div id='chat-container'>
                <div id='chat-messages'>
                    <Scrollbars style={{
                        height: '100%', 
                        width: '100%', 
                    }}
                    >
                        {
                            messages.map((m, index) => {
                                let again = false, self = false
                                if (m.type == 'chat') {
                                    if (
                                        index>0 && 
                                        messages[index-1].message.sender && 
                                        messages[index-1].message.sender.id === messages[index].message.sender.id
                                    ) {
                                        again = "true"
                                    } else {
                                        again = "false"
                                    }
                                    
                                    if (user.id === m.message.sender.id) {
                                        self = "true"
                                    } else {
                                        self = "false"
                                    }
                                }
                                return (
                                    <MyMessage 
                                        key={index} 
                                        m={m}
                                        again={again}
                                        self={self}
                                        attendees={this.props.attendees}
                                    />
                                )
                            })

                        }
                        <div style={{ float:"left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el }}>
                        </div>
                    </Scrollbars>
                </div>
                <div id='chat-input-container'>
                    <Input
                        size='small'
                        fluid
                        transparent
                        id='message-input-box'
                        action={
                            <Button
                                color='black'
                                inverted
                                content='Send'
                                loading={this.state.sendingMessage}
                                disabled={this.state.sendingMessage}
                                onClick={() => {
                                    this.sendMessage()
                                }}
                            />
                        }
                        onChange={(e,d) => {this.updateMessage(d.value)}}
                        placeholder='Type your message...' 
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ChatInformation: state.chatInformation,
        UserInformation: state.userInformation
    }
}

const mapDispatchToProps = dispatch => {
    return {
        InitialiseChat: (messages) => {
            return dispatch(initialiseChat(messages))
        },
        AddMessage: (n, m) => {
            return dispatch(addMessage(n, m))
        },
        AddRecMessage: (n, m, t) => {
            return dispatch(addRecMessage(n, m, t))
        }
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat)
