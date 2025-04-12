import axios from "axios"

const BASE_URL=import.meta.env.VITE_API_URL
axios.defaults.baseURL=BASE_URL
axios.defaults.withCredentials=true
export const LOGIN_USER=`${BASE_URL}/users/login`

export const GET_USER_INFO=(sessionId)=>`${BASE_URL}/users/user_info/${sessionId}`

export const GENERATE_QR=`${BASE_URL}/qr/generate`

export const GET_QR_DATA=(id)=>`${BASE_URL}/qr/data/${encodeURIComponent(id)}`