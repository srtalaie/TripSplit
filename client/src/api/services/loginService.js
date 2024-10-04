import axios from 'axios'
const baseURL = '/api/users'

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'))

  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token }
  } else {
    return {}
  }
}

const login = async (creds) => {
  const req = await axios.post(`${baseURL}/login`, creds)
  window.localStorage.setItem('loggedInUser', JSON.stringify(req.data))
  return req.data
}

const logout = async () => {
  const loggedInUser = window.localStorage.getItem('loggedInUser')
  if (loggedInUser) {
    window.localStorage.removeItem('loggedInUser')
  }
}

export { authHeader, login, logout }
