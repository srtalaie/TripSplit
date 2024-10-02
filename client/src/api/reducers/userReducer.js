import { createSlice } from '@reduxjs/toolkit'

import {
  add_friend,
  create_user,
  get_all_users,
  get_user,
  remove_friend,
  update_user,
} from '../services/userService'

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    appendUser(state, action) {
      state.users.push(action.payload)
    },
    getUser(state, action) {
      state.signedInUser = action.payload
    },
    updateUser(state, action) {
      const updatedUser = action.payload
      const id = updatedUser._id
      return state.users.map((user) => (user._id !== id ? user : updatedUser))
    },
  },
})

export const { setUsers, appendUser, getUser, updateUser } = userSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await get_all_users()
    dispatch(setUsers(users))
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

export const updateAUser = (userId, user, token) => {
  return async (dispatch) => {
    const updatedUser = await update_user(userId, user, token)
    dispatch(updateUser(updatedUser))
  }
}

export const addFriend = (friendId, token) => {
  return async (dispatch) => {
    const updatedUser = await add_friend(friendId, token)
    dispatch(updateUser(updatedUser))
  }
}

export const removeFriend = (friendId, token) => {
  return async (dispatch) => {
    const updatedUser = await remove_friend(friendId, token)
    dispatch(updateUser(updatedUser))
  }
}

export default userSlice.reducer
