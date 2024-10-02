import axios from 'axios'
const baseURL = '/api/events'

const get_all_events = async (tripId, token) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.get(`${baseURL}/${tripId}`, config)
  return req.data
}

const get_event = async (tripId, eventId, token) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.get(`${baseURL}/${tripId}/${eventId}`, config)
  return req.data
}

const create_event = async (tripId, event, token) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.post(`${baseURL}/create/${tripId}`, event, config)
  return req.data
}

const update_event = async (tripId, eventId, event, token) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(
    `${baseURL}/update/${tripId}/${eventId}`,
    event,
    config
  )
  return req.data
}

const add_payers = async (tripId, eventId, payersArr, token) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(
    `${baseURL}/add_payers/${tripId}/${eventId}`,
    payersArr,
    config
  )
  return req.data
}

const delete_event = async (tripId, eventId, token) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.delete(
    `${baseURL}/delete/${tripId}/${eventId}`,
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
