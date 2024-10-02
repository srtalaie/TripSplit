import axios from 'axios'
const baseURL = '/api/users'

const setToken = (newToken) => {
  let token = `bearer ${newToken}`
  return token
}

const login = async (creds) => {
  const req = await axios.post(`${baseURL}/login`, creds)
  return req.data
}

export { login, setToken }
