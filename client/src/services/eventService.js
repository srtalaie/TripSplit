import axios from 'axios'
const baseURL = '/api/events'

let token = null

const get_all_events = async (trip) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.get(`${baseURL}/${trip._id}`, config)
  return req.data
}

const get_event = async (trip, event) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.get(`${baseURL}/${trip._id}/${event._id}`, config)
  return req.data
}

const create_event = async (trip, event) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.post(`${baseURL}/create/${trip._id}`, event, config)
  return req.data
}

const update_event = async (trip, event) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(
    `${baseURL}/update/${trip._id}/${event._id}`,
    event,
    config
  )
  return req.data
}

const add_payers = async (trip, event, payersArr) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(
    `${baseURL}/add_payers/${trip._id}/${event._id}`,
    payersArr,
    config
  )
  return req.data
}

const delete_event = async (trip, event) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.delete(
    `${baseURL}/delete/${trip._id}/${event._id}`,
    config
  )
  return req.data
}

export {
  add_payers,
  create_event,
  delete_event,
  get_all_events,
  get_event,
  update_event,
}
