import { createSlice } from '@reduxjs/toolkit'
import {
  add_member,
  create_trip,
  delete_trip,
  get_all_trips,
  update_trip,
} from '../services/tripService'

const tripSlice = createSlice({
  name: 'trips',
  initialState: [],
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
      state = state.map((trip) => (trip._id !== id ? trip : updatedTrip))
      return state
    },
    appendTrip(state, action) {
      state.push(action.payload)
    },
    setTrips(state, action) {
      state = action.payload
      return state
    },
    removeTrip(state, action) {
      let id = action.payload
      return state.filter((trip) => trip._id !== id)
    },
  },
})

export const { updateTrip, appendTrip, setTrips, removeTrip, getTrip } =
  tripSlice.actions

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

export const updateATrip = (tripId, trip) => {
  return async (dispatch) => {
    const updatedTrip = await update_trip(tripId, trip)
    dispatch(updateTrip(updatedTrip))
  }
}

export const addAMember = (tripId, memberId) => {
  return async (dispatch) => {
    const updatedTrip = await add_member(tripId, memberId)
    dispatch(updateTrip(updatedTrip))
  }
}

export const removeATrip = (tripId) => {
  return async (dispatch) => {
    await delete_trip(tripId)
    dispatch(removeTrip(tripId))
  }
}

export default tripSlice.reducer
