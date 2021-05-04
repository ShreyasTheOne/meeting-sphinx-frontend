import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'

import Login from './login/login'
import OnLogin from './login/on_login'
import Home from './home'
import { verifyUser } from '../actions/user'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login_status: null,
        }
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
                    </Switch>
                </Router>
            )
        } else if (UserInformation.login === false) {
            return (
                <Router>
                    <Switch>
                        <Route
                            exact
                            path={`${match.path}`}
                            component={Login}
                        />
                        <Route
                            exact
                            path={`${match.path}redirect/`}
                            component={OnLogin}
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
