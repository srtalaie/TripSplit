import { useEffect, useState } from 'react'
import { useDispatch } from "react-redux"
import { Route, Routes, useNavigate } from 'react-router-dom'

import './App.css'

import { loginUser, logoutAUser } from "./api/reducers/userReducer"

import LoginButton from './components/Buttons/LoginButton'
import NavBar from './components/Navs/NavBar'
import Home from './Pages/Home'
import LoginPage from './Pages/LoginPage'
import LogoutPage from './Pages/LogoutPage'

function App() {
  const [userCheck, setUserCheck] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  useEffect(() => {
    const loggedInUserJSON  = window.localStorage.getItem('loggedInUser')
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
      ): (   
          <LoginButton />
      )}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<LoginPage handleLogin={handleLogin} />} />
        <Route path='/logout' element={<LogoutPage />} />
      </Routes>
    </>
  )
}

export default App
