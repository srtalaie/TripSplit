import { configureStore } from '@reduxjs/toolkit'

import eventReducer from './reducers/eventReducer'
import tripReducer from './reducers/tripReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    users: userReducer,
    trips: tripReducer,
    events: eventReducer,
  },
})

export default store
