import React, {Component} from 'react'
import {connect} from 'react-redux'

class Lobby extends Component {

    constructor(props) {
        super(props)
        const { code } = this.props.match.params
        this.state = {
            code
        }
    }

    componentDidMount () {

    }

    render(){
        const { code } = this.state
        const { UserInformation } = this.props
        const user = UserInformation.data
        
        return (
            <>
                <div>
                    MEETING CODE: {code}
                </div>
                <div>
                    USER INFO: {user.full_name}, {user.email}
                </div>
            </>
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
        
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby)