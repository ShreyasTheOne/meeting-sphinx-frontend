import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { googleRedirect } from '../../urls'

class Login extends Component {

    login () {
        window.location =googleRedirect('pasta')
    }

    render () {
        return (
            <div>
                <Button
                    color='black'
                    onClick={this.login.bind(this)}
                >
                    Login With Google
                </Button>
            </div>
        )
    }
}

export default Login
