import React, {Component} from 'react'
import { Button, Image } from 'semantic-ui-react'
import { googleRedirect, logo_hosted_url } from '../../urls'
import './css/index.css'

class Login extends Component {

    login () {
        window.location =googleRedirect('pasta')
    }

    render () {
        return (
            <div id='login-container'>
                <div id='login-content'>
                    <div id='login-title'>
                        <div className='login-title-text'>
                            The
                        </div>
                        <div className='login-title-text'>
                            Meeting
                        </div>
                        <div className='login-title-text'>
                            Sphinx
                        </div>
                    </div>

                    <div id='login-button-div'>
                        <Image 
                            size={"large"} 
                            src={logo_hosted_url()}
                            id='sphinx-logo'
                        />
                        <Button
                            fluid={false}
                            color='black'
                            size={'huge'}
                            onClick={this.login.bind(this)}
                        >
                            Login With Google
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login
