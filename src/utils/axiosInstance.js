import axios from "axios"

const API = axios.create({
    baseURL: "http://localhost:5173/",
    timeout: 2000,
    withCredentials: true
})

export default API
