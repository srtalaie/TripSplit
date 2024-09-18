import axios from 'axios'
const baseURL = '/trips'

let token = null

const get_all_trips = async () => {
  const req = await axios.get(baseURL)
  return req.data
}

const get_trip = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.get(`${baseURL}/${id}`, config)
  return req.data
}

const create_trip = async (trip) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.post(`${baseURL}/create`, trip, config)
  return req.data
}

const update_trip = async (trip) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(`${baseURL}/update/${trip._id}`, trip, config)
  return req.data
}

const add_member = async (member) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(`${baseURL}/add_member/${member._id}`)
  return req.data
}

const delete_trip = async (trip) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.delete(`${baseURL}/delete/${trip._id}`)
  return req.data
}

export {
  add_member,
  create_trip,
  delete_trip,
  get_all_trips,
  get_trip,
  update_trip,
}