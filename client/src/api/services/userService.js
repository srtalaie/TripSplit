import axios from 'axios'

const baseURL = '/api/users'

const get_all_users = async () => {
  const req = await axios.get(baseURL)
  return req.data
}

const get_user = async (userId) => {
  const req = await axios.get(`${baseURL}/${userId}`)
  return req.data
}

const create_user = async (user) => {
  const req = await axios.post(`${baseURL}/create`, user)
  return req.data
}

const update_user = async (userId, user, token) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(`${baseURL}/update/${userId}`, user, config)
  return req.data
}

const add_friend = async (friendId, token) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(`${baseURL}/add_friend/${friendId}`, {}, config)
  return req.data
}

const remove_friend = async (friendId, token) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(
    `${baseURL}/remove_friend/${friendId}`,
    {},
    config
  )
  return req.data
}

export {
  add_friend,
  create_user,
  get_all_users,
  get_user,
  remove_friend,
  update_user,
}
