import { configureStore } from '@reduxjs/toolkit'

import tripReducer from './reducers/tripReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    users: userReducer,
    trips: tripReducer,
  },
})

export default store
