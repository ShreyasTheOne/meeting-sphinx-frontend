import axios from 'axios'
import { apiAuthLogin, apiAuthVerify, routeHome } from '../urls'
import { 
    CHANGE_USER_LOGIN_LOADED_ERROR, 
    INITIALISE_USER, 
} from './types'

export const verifyUser = () => {
    return dispatch => {
        axios.get(
            apiAuthVerify()
        ).then(res => {
            const login_state = res.data['login_status']
            if (login_state === true) {
                dispatch({
                    type: INITIALISE_USER,
                    payload: {
                        login: true,
                        loaded: true,
                        error: false,
                        data: res.data['user']
                    }
                })
            } else {
                dispatch({
                    type: INITIALISE_USER,
                    payload: {
                        login: false,
                        loaded: true,
                        error: false,
                        data: {}
                    }
                })
            }
        }).catch(e => {
            dispatch({
                type: CHANGE_USER_LOGIN_LOADED_ERROR,
                payload: {
                    login: false,
                    loaded: false,
                    error: true,
                }
            })
        })
    }
}

export const loginUser = (state, code) => {
    return dispatch => {
        if (state === 'pasta') {
            console.log("loginUserINSIDE")
            axios({
                url: apiAuthLogin(),
                method: 'post',
                data: {'code': code},
            }).then(res => {
                window.location = routeHome()
            }).catch(e => {
                dispatch({
                    type: CHANGE_USER_LOGIN_LOADED_ERROR,
                    payload: {
                        login: false,
                        loaded: true,
                        error: true
                    }
                })
                window.location = routeHome()
            })
        } else {
            dispatch({
                type: CHANGE_USER_LOGIN_LOADED_ERROR,
                payload: {
                    login: false,
                    loaded: true,
                    error: true
                }
            })
            window.location = routeHome()
        }
    }
}
