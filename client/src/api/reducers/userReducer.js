import { createSlice } from '@reduxjs/toolkit'

import {
  add_friend,
  create_user,
  get_all_users,
  get_user,
  remove_friend,
  update_user,
} from '../services/userService'

import { login, logout } from '../services/loginService'

const initialState = {
  signedInUser: {},
  users: [],
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoggedInUser(state, action) {
      state.signedInUser = action.payload
      return state
    },
    setUsers(state, action) {
      state.users = action.payload
      return state
    },
    appendUser(state, action) {
      state.users.push(action.payload)
    },
    getUser(state, action) {
      const user = action.payload
      const id = user._id
      return state.users.filter((user) => user._id === id)
    },
    updateUser(state, action) {
      const updatedUser = action.payload
      const id = updatedUser._id
      state.users = state.users.map((user) =>
        user._id !== id ? user : updatedUser
      )
      return state
    },
    logoutUser(state, action) {
      state.signedInUser = {}
    },
  },
})

export const {
  setLoggedInUser,
  setUsers,
  appendUser,
  getUser,
  updateUser,
  logoutUser,
} = userSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await get_all_users()
    dispatch(setUsers(users))
  }
}

export const loginUser = (creds) => {
  return async (dispatch) => {
    const user = await login(creds)
    dispatch(setLoggedInUser(user))
  }
}

export const logoutAUser = () => {
  return async (dispatch) => {
    await logout()
    dispatch(logoutUser())
  }
}

export const getAUser = (userId) => {
  return async (dispatch) => {
    const foundUser = await get_user(userId)
    dispatch(getUser(foundUser))
  }
}

export const createAUser = (user) => {
  return async (dispatch) => {
    const newUser = await create_user(user)
    dispatch(appendUser(newUser))
  }
}

export const updateAUser = (userId, user) => {
  return async (dispatch) => {
    const updatedUser = await update_user(userId, user)
    dispatch(updateUser(updatedUser))
  }
}

export const addFriend = (friendId) => {
  return async (dispatch) => {
    const updatedUser = await add_friend(friendId)
    dispatch(updateUser(updatedUser))
  }
}

export const removeFriend = (friendId) => {
  return async (dispatch) => {
    const updatedUser = await remove_friend(friendId)
    dispatch(updateUser(updatedUser))
  }
}

export default userSlice.reducer
