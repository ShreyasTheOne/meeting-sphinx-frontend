//Frontend
const isDev = true  // false for production

export const routeHome = () => {
    return isDev ? "http://localhost:3000/" : "./"
}

export const routeDashboard = () => {
    return `${routeHome()}dashboard/`
}

export const routeLobby = code => {
    return `${routeHome()}lobby/${code}/`
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

export const apiMeeting = () => {
    return `${apiBase()}meeting/`
}

export const apiMeetingJoin = () => {
    return `${apiBase()}meeting/join/`
}

export const apiGetMyMeetings = () => {
    return `${apiBase()}meeting/my/`
}

export const apiBanUser = () => {
    return `${apiBase()}meeting/ban/`
}

export const apiMeetingDetails = (id) => {
    return `${apiBase()}meeting/${id}/details/`
}

// Others

export const googleRedirect = (state) => {
    if (state === '') state = ''
    return (`https://accounts.google.com/o/oauth2/v2/auth?` +
    `response_type=code&` +
    `client_id=202461073404-uop3qss4d9h4d445gff8tpit3n4lilou.apps.googleusercontent.com&` +
    `scope=openid%20profile%20email&` +
    `redirect_uri=http%3A//localhost:3000/redirect&` +
    `state=${state}`)
}

export const logo_hosted_url = () => {
    // return "https://lh3.googleusercontent.com/MiTUT1y7aaBfz74E5iT3D1BgR-9865C6Najg2suYVnwKBQRCp0NWEsnYcDnc4n-BbNd1pIR-rhv087cTsDdxZT3VinDvtTctOf7hHpzXQxTQebSf36agb7ycLw2jOs6u3x8jTpiYyifaAUiPHuhbiWMy_fQR5S0Kgra_qDPiApWCviWLmPMyH2gpjJTdzMjDs_DvlrmfW3J57-CeS7uhHhURNHvcC69jnhc2JsZTi43sa9Qu5ZAAR7yG36TrLpJOj1fYkHhLBIhM65e46Mr_hkKggDD5M-wAvT4M1p_YtfVJ0jWq1GpU7Mdz4ozX_pb66uN6VA2VXqMgqVPtgqWIEI_eAsIMek8J0R2VMVPZIH0vMDHPVcCO0aLXYhOVXxF09OuOb83kb-F6K5Pe3GXk6-mysFyNM__oB8snLXhGs5WskEQm_p20rrHIKEeLOK76HF1KGhWEdJOCjjojOV_V-qw22a2vSA3tc61EM8KcRWplcoBHDE6BF6UZ_WVwrnbezVgRGl8GpGd4SVJt43wt9hU3tGlQliH0r980IOLqHEc3Zpubq_V9zYrSGgLvAhv9gBpkzI_WzvdjgJ3naPsPYdXI0beB3QK6BMNovy69LEK3xSvVH3dBMrXwcH_aiSHIeGjpvKPGJB42SkN7SinR7cc_JMUAqbF89D3oM8TAHk0NHXjGVOLqr_IWfRoNrwoq8r5QLGanuQxlIM2bSMhcTjKF=w271-h306-no?authuser=1"
    return 'https://i.postimg.cc/Y9JZwfmk/sphinxlogo.png'
} 

export function apiWSBase() {
    return 'ws://localhost:54321/ws/'
}

export function apiWSMeetings (meeting_code) {
    return `${apiWSBase()}meetings/${meeting_code}/`
}

export function apiWSChat (meeting_code) {
    return `${apiWSBase()}meetings/${meeting_code}/chat/`
}

export function apiWSVideoCall (meeting_code) {
    return `${apiWSBase()}meetings/${meeting_code}/video_call/`
}
