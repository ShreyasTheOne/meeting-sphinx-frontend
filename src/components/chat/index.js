import React, {Component} from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { connect } from 'react-redux'
import { Button, Segment, Label, Input, Message } from 'semantic-ui-react'
import { addMessage, initialiseChat } from '../../actions/chat'
import { apiWSChat } from '../../urls'
import {
    SEND_MESSAGE,
    MESSAGE_DATA
} from '../lobby/messageTypes'
import './css/index.css'

class Chat extends Component {

    constructor (props) {
        super(props)
        const meeting_code = this.props.meetingCode
        this.chatWebSocket = new WebSocket(apiWSChat(meeting_code))
    }

    componentDidMount () {
        this.chatWebSocket.onmessage = e => {
            const data = JSON.parse(e.data)
            const type = data.type
            const d = data.data

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
                default:
                    break
            }
        }
    }

    sendMessage = () => {
        this.chatWebSocket.send(JSON.stringify(
            {
                'content': "DINKU NOOOOOB"
            }
        ))
    }

    toTitleCase (input) {
        if (!input) return ''
        let words = input.split(' ');  
        let ans = [];  
        words.forEach(element => {  
            ans.push(element[0].toUpperCase() + element.slice(1, element.length).toLowerCase());  
        });  
        return ans.join(' '); 
    }

    render () {
        const { ChatInformation } = this.props
        const { messages } = ChatInformation
        return (
            <div id='chat-container'>
                <div id='chat-messages'>
                    <Scrollbars style={{height: '100%', width: '100%'}}>
                        {
                            messages.map((m, index) => {
                                return (
                                    <Message key={index} m={m}/>
                                )
                            })

                        }
                    </Scrollbars>
                </div>
                <div id='chat-input-container'>
                    <Input
                        size='small'
                        fluid
                        action='Send' 
                        placeholder='Type your message...' 
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ChatInformation: state.chatInformation
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
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat)
