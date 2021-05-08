import React, {Component} from 'react'
import { 
    Button, 
    Image,
    Popup,
    Icon,
    Header,
    Divider
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import './css/index.css'
import {
    logoutUser
} from '../../actions/user'

class NavBar extends Component {

    constructor (props) {
        super(props)
        this.state = {
            now: new Date().toLocaleString(),
            num_meetings: 0
        }
    }

    componentDidMount () {
        this.tick()
    }

    tick = () => {
        setInterval(
            () => {
                this.setState({
                    now: new Date().toLocaleString(),
                })
            }, 1000
        )
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
        const { UserInformation } = this.props
        const user = UserInformation.data
        const { now, num_meetings } = this.state
        return (
            <span>
            <div id='home-nav'>
                <div id='home-nav-left'>
                    <div>
                        <Popup
                            hideOnScroll
                            position='bottom center'
                            on="click"
                            style={{ padding: "0px" }}
                            trigger={
                                <Image
                                    style={{ cursor: 'pointer' }}
                                    src={user.profile_picture}
                                    avatar
                                    size='tiny'
                                />
                            }
                        >
                            <Button
                                color='black'
                                size='large'
                                fluid
                                onClick={() => this.props.LogOut()}
                            >
                                <Icon name='log out' />
                                Logout
                            </Button>
                        </Popup>
                    </div>
                    <Header id='home-header' size='huge'>
                        Hi, {this.toTitleCase(user.full_name)}!
                    </Header>
                </div>
                <div id='home-nav-right'>
                    <Button
                        color='red'
                        id='home-num-meetings'
                        size='large'
                    >
                        {num_meetings} ongoing meetings
                    </Button>
                    <Header id='home-time' size='huge'>
                        {now}
                    </Header>
                </div>
            </div>
            <Divider/>
            </span>
        )
    }
}

const mapStateToProps = state => {
    return {
        UserInformation: state.userInformation
    }
}

const mapDispatchToProps = dispatch => {
    return {
        LogOut: () => {
            return dispatch(logoutUser())
        },
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar)
