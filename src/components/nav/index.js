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
import { routeHome } from '../../urls'

class NavBar extends Component {

    constructor (props) {
        super(props)
        this.state = {
            now: new Date().toLocaleString(),
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
        const { UserInformation, show_button } = this.props
        const user = UserInformation.data
        const { now } = this.state
        return (
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
                    {
                        show_button &&
                            <Button
                            color='red'
                            id='home-num-meetings'
                            size='large'
                            onClick={() => window.location=routeHome()}
                        >
                            Leave Meeeting
                        </Button>
                    }
                    <Header id='home-time' size='huge'>
                        {now}
                    </Header>
                </div>
            </div>
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
