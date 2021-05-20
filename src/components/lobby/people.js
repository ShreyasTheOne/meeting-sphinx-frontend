import React, {Component} from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { Header, Card, Image, Button } from 'semantic-ui-react'
import axios from 'axios'
import './css/index.css'
import {apiBanUser} from "../../urls";

class People extends Component {

    constructor (props) {
        super(props)
    }

    toTitleCase (input) {
        if (!input) return ''
        let words = input.split(' ')
        let ans = []
        words.forEach(element => {  
            ans.push(element[0].toUpperCase() + element.slice(1, element.length).toLowerCase());  
        })
        return ans.join(' ')
    }

    render () {
        const { organisers, attendees, recording, self_user } = this.props
        let org_ids = []
        organisers.forEach(o => {org_ids.push(o.id)})

        return (
            <Scrollbars style={{ width: 1000, height: 600 }}>
                <div id='lobby-scrollbars'>
                <Header id='lobby-orgs'>
                    Organiser
                </Header>
                <Card.Group itemsPerRow={3}>
                    {
                        organisers.map((p, index) => {
                            return (
                                <Card
                                    key={index}
                                    color={'black'}
                                    fluid
                                >
                                    <Card.Content>
                                        <div className='lobby-person-card'>
                                            <Image className='lobby-ppp' circular size={"mini"} src={p['profile_picture']}/>
                                            <span
                                                className='lobby-pfn'
                                            >
                                                {this.toTitleCase(p['full_name'])}
                                            </span>
                                        </div>
                                    </Card.Content>
                                </Card>
                            )
                        })
                    }
                </Card.Group>
                <Header id='lobby-atts'>
                    Attendees
                </Header>
                <Card.Group itemsPerRow={3}>
                    {   
                       
                        attendees.map((p, index) => {
                            if(p['full_name'] !== undefined){
                                
                                const rec = (p.id in recording && recording[p.id]) ? 'true' : 'false'

                                return (
                                    <Card
                                        className={`recording-${rec}`}
                                        key={index}
                                        color={`blue`}
                                        fluid
                                    >
                                        <Card.Content>
                                            <div className={`lobby-person-card`}>
                                                <Image className='lobby-ppp' circular size={"mini"} src={p['profile_picture']}/>
                                                <span
                                                    className='lobby-pfn'
                                                >
                                                    {this.toTitleCase(p['full_name'])}
                                                </span>
                                                {
                                                    org_ids.includes(self_user.id) &&
                                                        <Button
                                                            className={'ban-btn'}
                                                            onClick={() => this.props.banUser(p['id'])}
                                                            circular
                                                            size={'tiny'}
                                                            icon={'ban'}
                                                            color={rec === 'true' ? 'black' : 'red'}
                                                        />
                                                }
                                            </div>
                                        </Card.Content>
                                    </Card>
                                ) 
                            }                               
                        })
                    }
                </Card.Group>
                </div>
            </Scrollbars>
            )
    }
}

export default People
