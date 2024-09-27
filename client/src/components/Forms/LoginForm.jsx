import PropTypes from 'prop-types'
import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = (event) => {
    event.preventDefault()

    const user = {
      email,
      password,
    }

    handleLogin(user)

    setEmail('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={onLogin}>
        <label for="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          label="Email"
          onChange={({ target }) => setEmail(target.value)}
        />
        <label for="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          label="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm