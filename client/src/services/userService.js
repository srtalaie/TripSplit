import axios from "axios"
const baseURL = "/users"

let token = null

const get_all_users = async () => {
  const req = await axios.get(baseURL)
  return req.data
}

const get_user = async (id) => {
  const req = await axios.get(`${baseURL}/${id}`)
  return req.data
}

const create_user = async (user) => {
  const req = await axios.post(`${baseURL}/create`, user)
  return req.data
}

const update_user = async (user) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(`${baseURL}/update/${user._id}`, user, config)
  return req.data
}

const add_friend = async (friend) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(
    `${baseURL}/add_friend/${friend._id}`,
    {},
    config,
  )
  return req.data
}

const remove_friend = async (friend) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(
    `${baseURL}/remove_friend/${friend._id}`,
    {},
    config,
  )
  return req.data
}

export {
  add_friend,
  create_user,
  get_all_users,
  get_user,
  remove_friend,
  update_user
}

