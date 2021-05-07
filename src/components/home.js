import React, {Component} from 'react'
import {connect} from 'react-redux'

class Home extends Component {

    render(){
        const { UserInformation } = this.props
        const user = UserInformation.data
        
        return (
            <div>
                Hello {user.full_name}
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
        
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)
