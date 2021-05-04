import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loginUser } from '../../actions/user'

class OnLogin extends Component {

    componentDidMount() {
        const params = new URLSearchParams(window.location.search)
        this.props.LoginUser(
            params.get('state'), 
            params.get('code')
        )
    }

    render() {
        return (
            <div/>
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
        LoginUser: (state, code) => {
            dispatch(loginUser(state, code))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OnLogin)