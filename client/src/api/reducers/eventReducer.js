import { createSlice } from '@reduxjs/toolkit'
import {
  add_payers,
  create_event,
  delete_event,
  get_all_events,
  get_event,
  update_event,
} from '../services/eventService'

const initialState = {
  selectedEvent: {},
  events: [],
}

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    createEvent(state, action) {
      const event = action.payload
      state.push(event)
    },
    updateEvent(state, action) {
      const updatedEvent = action.payload
      state.selectedEvent = updatedEvent
      return state
    },
    appendEvent(state, action) {
      state.events.push(action.payload)
    },
    setEvents(state, action) {
      return action.payload
    },
    removeEvent(state, action) {
      let { tripId, eventId } = action.payload
      console.log(state.trips)

      return state.events.filter((event) => event._id !== eventId)
    },
    getEvent(state, action) {
      state.selectedEvent = action.payload
    },
  },
})

export const {
  createEvent,
  updateEvent,
  appendEvent,
  setEvents,
  removeEvent,
  getEvent,
} = eventSlice.actions

export const getAllEvents = (tripId) => {
  return async (dispatch) => {
    const events = await get_all_events(tripId)
    dispatch(setEvents(events))
  }
}

export const getAEvent = (tripId, eventId) => {
  return async (dispatch) => {
    const foundEvent = await get_event(tripId, eventId)
    dispatch(getEvent(foundEvent))
  }
}

export const createAnEvent = (tripId, event) => {
  return async (dispatch) => {
    const newEvent = await create_event(tripId, event)
    dispatch(appendEvent(newEvent))
  }
}

export const updateAnEvent = (tripId, eventId, event) => {
  return async (dispatch) => {
    const updatedEvent = await update_event(tripId, eventId, event)
    dispatch(updateEvent(updatedEvent))
  }
}

export const addPayers = (tripId, eventId, payersArr) => {
  return async (dispatch) => {
    const updatedEvent = await add_payers(tripId, eventId, payersArr)
    dispatch(updateEvent(updatedEvent))
  }
}

export const deleteAnEvent = (tripId, eventId) => {
  return async (dispatch) => {
    await delete_event(tripId, eventId)
    const ids = { tripId, eventId }
    dispatch(removeEvent(ids))
  }
}

export default eventSlice.reducer
