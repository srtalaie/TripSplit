import { createSlice } from '@reduxjs/toolkit'
import {
  add_member,
  create_trip,
  delete_trip,
  get_all_trips,
  get_trip,
  update_trip,
} from '../services/tripService'

const tripSlice = createSlice({
  name: 'trips',
  initialState: [trips, selectedTrip],
  reducers: {
    createTrip(state, action) {
      const trip = action.payload
      state.push({
        trip_name: trip.trip_name,
        trip_description: trip.trip_description,
        events: trip.events,
        members: trip.members,
        owner: trip.owner,
      })
    },
    updateTrip(state, action) {
      const updatedTrip = action.payload
      const id = updatedTrip._id
      return state.trips.map((trip) => (trip._id !== id ? trip : updatedTrip))
    },
    appendTrip(state, action) {
      state.trips.push(action.payload)
    },
    setTrips(state, action) {
      return action.payload
    },
    removeTrip(state, action) {
      let id = action.payload
      return state.trips.filter((trip) => trip._id !== id)
    },
    getTrip(state, action) {
      state.selectedTrip = action.payload
    },
  },
})

export const { updateTrip, appendTrip, setTrips, removeTrip } =
  blogSlice.actions

export const initializeTrips = () => {
  return async (dispatch) => {
    const trips = await get_all_trips()
    dispatch(setTrips(trips))
  }
}

export const createATrip = (trip) => {
  return async (dispatch) => {
    const newTrip = await create_trip(trip)
    dispatch(appendTrip(newTrip))
  }
}

export const updateATrip = (trip) => {
  return async (dispatch) => {
    const updatedTrip = await update_trip(trip._id, trip)
    dispatch(updateTrip(updatedTrip))
  }
}

export const getATrip = (id) => {
  return async (dispatch) => {
    const foundTrip = await get_trip(id)
    dispatch(getTrip(foundTrip))
  }
}

export const addAMember = (trip, memberId) => {
  return async (dispatch) => {
    const updatedTrip = await add_member(trip, memberId)
    dispatch(updateTrip(updatedTrip))
  }
}

export const removeATrip = (trip) => {
  return async (dispatch) => {
    await delete_trip(trip)
    dispatch(removeTrip(trip))
  }
}

export default tripSlice.reducer
