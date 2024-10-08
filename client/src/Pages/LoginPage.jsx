import LoginForm from '../components/Forms/LoginForm'

const LoginPage = ({ handleLogin }) => {

  return (
    <div className="content-center">
      <LoginForm handleLogin={handleLogin} />
    </div>
  )
}

export default LoginPage