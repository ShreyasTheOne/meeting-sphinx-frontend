import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom'

import Login from './login/login'
import OnLogin from './login/on_login'
import Lobby from './lobby/lobby'
import Home from './home/index'
import { verifyUser } from '../actions/user'
import Dashboard from "./dashboard";

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login_status: null,
        }
        document.cookie = `current_meeting=gg;max-age=604800;path=/`
    }

    componentDidMount() {
        const { UserInformation } = this.props
        if (UserInformation.loaded === false) {
            const pathArray = window.location.pathname.split('/')
            if (pathArray[0] !== 'redirect') {
                this.props.VerifyUser()
            }
        }
    }

    render() {
        const { match, UserInformation } = this.props

        if (UserInformation.loaded === false) {
            return (
                <Router>
                    <Switch>
                        <Route
                            exact
                            path={`${match.path}redirect/`}
                            component={OnLogin}
                        />
                        <Redirect
                            to=''
                        />
                    </Switch>
                </Router>
            )
        } else if (UserInformation.login === true) {
            return (
                <Router>
                    <Switch>
                        <Route
                            exact
                            path={`${match.path}`}
                            component={Home}
                        />
                        <Route
                            exact
                            path={`${match.path}lobby/:code/`}
                            component={Lobby}
                        />
                        <Route
                            exact
                            path={`${match.path}dashboard/`}
                            component={Dashboard}
                        />
                        <Redirect to=''/>
                    </Switch>
                </Router>
            )
        } else if (UserInformation.login === false) {
            return (
                <Router>
                    <Switch>
                        <Route
                            exact
                            path={`${match.path}redirect/`}
                            component={OnLogin}
                        />
                        <Route
                            exact
                            path={`${match.path}`}
                            component={Login}
                        />
                        <Redirect
                            to='/'
                        />
                    </Switch>
                </Router>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        UserInformation: state.userInformation
    }
}

const mapDispatchToProps = dispatch => {
    return {
        VerifyUser: () => {
            return dispatch(verifyUser())
        },
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
