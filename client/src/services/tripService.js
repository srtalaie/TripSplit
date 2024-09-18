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
}
