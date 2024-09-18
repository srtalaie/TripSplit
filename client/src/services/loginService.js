import axios from "axios"
const baseURL = "/users"

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const login = async (creds) => {
  const req = await axios.post(`${baseURL}/login`, creds)
  return req.data
}

export { login, setToken }

