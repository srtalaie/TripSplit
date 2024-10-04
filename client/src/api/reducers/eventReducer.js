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
      state.push({
        event_name: event.event_name,
        event_description: event.event_description,
        cost: event.cost,
        payee: event.payee,
        trip: event.trip,
        payers: event.payers,
      })
    },
    updateEvent(state, action) {
      const updatedEvent = action.payload
      const id = updatedEvent._id
      return state.events.map((event) =>
        event._id !== id ? event : updatedEvent
      )
    },
    appendEvent(state, action) {
      state.events.push(action.payload)
    },
    setEvents(state, action) {
      return action.payload
    },
    removeEvent(state, action) {
      let id = action.payload
      return state.events.filter((event) => event._id !== id)
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
    dispatch(removeEvent(eventId))
  }
}

export default eventSlice.reducer
