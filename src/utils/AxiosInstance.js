import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:8081",
  timeout: 2000,
  withCredentials: true
})

export default API
