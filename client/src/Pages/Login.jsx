import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// import { loginUser } from '../api/reducers/userReducer'
import { setToken } from '../api/services/loginService'
import LoginForm from '../components/Forms/LoginForm'
  
const Login = () => {
  const [user, setUser] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  const handleLogin = async (userCreds) => {
    
  }

  return (
    <div>
      <LoginForm />
    </div>
  )
}

export default Login