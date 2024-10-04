import PropTypes from 'prop-types'
import { useState } from 'react'

import Button from '../Buttons/Button'
import UserInput from '../Input/UserInput'

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
        <UserInput
          value={email}
          type="email"
          identifier="email"
          label="Email"
          handleChange={({ target }) => setEmail(target.value)}
        />
        <UserInput
          value={password}
          type="password"
          identifier="password"
          label="Password"
          handleChange={({ target }) => setPassword(target.value)}
        />   
        <Button type="submit" callToAction="Login" />
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm