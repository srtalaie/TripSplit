import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import { Route, Routes, useNavigate } from 'react-router-dom'

import './App.css'

import { loginUser, logoutAUser } from "./api/reducers/userReducer"

import LoginSignUpNav from './components/Navs/LoginSignUpNav'
import NavBar from './components/Navs/NavBar'
import AddFriendsPage from './Pages/AddFriendsPage'
import CreateTripPage from './Pages/CreateTripPage'
import CreateUser from './Pages/CreateUser'
import Home from './Pages/Home'
import LoginPage from './Pages/LoginPage'
import LogoutPage from './Pages/LogoutPage'
import MyTripsPage from './Pages/MyTripsPage'
import Profile from './Pages/Profile'
import TripPage from './Pages/TripPage'

function App() {
  const [userCheck, setUserCheck] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      setUserCheck(true)
    }
  }, [])

  const handleLogin = (userCreds) => {
    try {
      setUserCheck(true)
      dispatch(loginUser(userCreds))
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    setUserCheck(false)
    dispatch(logoutAUser())
    navigate('/logout')
  }

  return (
    <>
      {userCheck === true ? (
        <NavBar handleLogout={handleLogout} />
      ) : (
        <LoginSignUpNav />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends" element={<AddFriendsPage />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/trips" element={<MyTripsPage />} />
        <Route path="/trips/create" element={<CreateTripPage />} />
        <Route path="/trips/:trip" element={<TripPage />} />
        <Route path='/login' element={<LoginPage handleLogin={handleLogin} />} />
        <Route path='/logout' element={<LogoutPage />} />
      </Routes>
    </>
  )
}

export default App
