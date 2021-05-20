import React, {Component} from 'react'
import {Header, Card, Label, Image, Popup} from 'semantic-ui-react'
import './css/index.css'
import {toTitleCase} from "../../../utils";

class Videos extends Component {

    constructor (props) {
        super(props)
        this.attendee_stream_refs = this.props.attendee_stream_refs
        this.attendee_streams = this.props.attendee_streams
    }

    componentDidMount () {
        const { in_modal, attendee_stream_refs, attendee_streams} = this.props
        Object.keys(attendee_streams).map( userID => {
            if (!(attendee_streams[userID] && attendee_stream_refs[userID])) return
            const curr_stream = attendee_streams[userID]['stream']
            const curr_ref = in_modal ? attendee_stream_refs[userID][0] : attendee_stream_refs[userID][1]
            if (curr_ref.current) {
                curr_ref.current.srcObject = curr_stream
            }
        })
    }

    componentDidUpdate(prevProps) {
        if(this.props.attendee_stream_refs.length !== prevProps.attendee_stream_refs.length)
        {
            this.attendee_stream_refs = this.props.attendee_stream_refs
            this.attendee_streams = this.props.attendee_streams
        }
    }


    render () {
        const { in_modal, attendees, recording, attendee_streams, attendee_stream_refs } = this.props

        return (
            <div className='videos-scrollbars'>
                {this.props.show_header &&
                    <div
                        className={'videos-header'}
                    >
                        <Header inverted size={'huge'}>
                            Attendee Videos
                        </Header>
                    </div>
                }
                <Card.Group itemsPerRow={this.props.per_row}>
                    {

                        Object.keys(attendee_streams).map( userID => {
                            if(attendee_streams[userID] && attendee_streams[userID]['user']['full_name'] != null){
                                const curr_user = attendee_streams[userID]['user']
                                const curr_ref = in_modal ? attendee_stream_refs[userID][0] : attendee_stream_refs[userID][1]

                                const rec = (curr_user.id in recording && recording[curr_user.id]) ? 'true' : 'false'
                                let show_video = true
                                if (!attendee_streams[userID]['stream']) show_video = false

                                const hidden = show_video ? '' : 'hidden'
                                return (
                                    <Card
                                        key={userID}
                                    >
                                        <div
                                            className={`video-container recording-${rec}`}
                                        >
                                            <video
                                                className={`attendee-video ${hidden}`}
                                                ref={curr_ref}
                                                playsInline
                                                autoPlay
                                            />
                                            <div
                                                className={'video-content'}
                                            >
                                                {
                                                    show_video &&
                                                        <Label
                                                            as='a'
                                                            color={rec === 'true' ? 'red' : 'black'}
                                                            image
                                                            size={'small'}
                                                        >
                                                          <Image
                                                              src={curr_user['profile_picture']}
                                                              alt={(curr_user['full_name'])}
                                                              size={'small'}
                                                          />
                                                            {toTitleCase(curr_user['full_name'])}
                                                        </Label>
                                                }
                                            </div>
                                            {
                                                !show_video &&
                                                    <div
                                                        className={'videoPP'}
                                                    >
                                                        <Popup
                                                            basic
                                                            inverted
                                                            flowing
                                                            position={'top center'}
                                                            content={toTitleCase(curr_user['full_name'])}
                                                            trigger={
                                                                <Image

                                                                    style={{ cursor: 'pointer' }}
                                                                    src={curr_user['profile_picture']}
                                                                    avatar
                                                                    size='small'
                                                                />
                                                            }
                                                        />
                                                        </div>
                                            }
                                        </div>
                                    </Card>
                                )
                            }
                        })
                    }
                </Card.Group>
            </div>
            )
    }
}

export default Videos
