import React, {Component} from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { Header, Card, Image } from 'semantic-ui-react'
import './css/index.css'

class People extends Component {

    constructor (props) {
        super(props)
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
        const { organisers, attendees, recording } = this.props
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
                            if(p['full_name'] != undefined){
                                
                                var rec = `false`
                                if(recording !== undefined)
                                    rec = recording[p['id']]
                                else 
                                    rec = `false`

                                return (
                                    <Card className={`recording-${rec}`} 
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
