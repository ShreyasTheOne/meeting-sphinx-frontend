//Frontend

export const routeHome = () => {
    return 'http://localhost:3000/'
}

// Backend 

export const apiBase = () => {
    return 'http://localhost:54321/api/'
}

export const apiAuthVerify = () => {
    return `${apiBase()}auth/verify/`
}

export const apiAuthLogin = () => {
    return `${apiBase()}auth/login/`
}

export const apiAuthLogout = () => {
    return `${apiBase()}auth/logout/`
}


export const googleRedirect = (state) => {
    if (state === '') state = ''
    return (`https://accounts.google.com/o/oauth2/v2/auth?` +
    `response_type=code&` +
    `client_id=202461073404-uop3qss4d9h4d445gff8tpit3n4lilou.apps.googleusercontent.com&` +
    `scope=openid%20profile%20email&` +
    `redirect_uri=http%3A//localhost:3000/redirect&` +
    `state=${state}`)
}