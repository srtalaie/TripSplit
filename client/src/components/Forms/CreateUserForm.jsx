import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createAUser } from '../../api/reducers/userReducer'

const CreateUserForm = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleUserCreate = (event) => {
    event.preventDefault()

    const newUser = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email,
      password: password,
    }

    try {
      dispatch(createAUser(newUser))
    } catch (error) {
      console.log(error)
    }
    
    setFirstName('')
    setLastName('')
    setEmail('')
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={handleUserCreate}>
        <label for="firstName">First Name:</label>
        <input
          type="text"
          name="firstName"
          value={firstName}
          id="firstName"
          label="First Name"
          onChange={({ target }) => setFirstName(target.value)}
        />
        <label for="lastName">Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={lastName}
          id="lastName"
          label="Last Name"
          onChange={({ target }) => setLastName(target.value)}
        />
        <label for="username">Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          id="username"
          label="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
        <label for="email">Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          id="email"
          label="Email"
          onChange={({ target }) => setEmail(target.value)}
        />
        <label for="password">Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          id="password"
          label="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="submit">Create User</button>
      </form>
    </div>
  )
}

export default CreateUserForm
