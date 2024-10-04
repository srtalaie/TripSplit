import { useDispatch } from "react-redux"

import { loginUser } from "../api/reducers/userReducer"
import LoginForm from '../components/Forms/LoginForm'

const LoginPage = () => {
  const dispatch = useDispatch()
  
  const handleLogin = async (userCreds) => {
    try {
      dispatch(loginUser(userCreds))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="content-center">
      <LoginForm handleLogin={handleLogin} />
    </div>
  )
}

export default LoginPage