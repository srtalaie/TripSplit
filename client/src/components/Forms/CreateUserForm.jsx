import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createAUser } from '../../api/reducers/userReducer'

import Button from '../Buttons/Button'
import UserInput from '../Input/UserInput'

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
      <form className='flexw-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4' onSubmit={handleUserCreate}>
        <UserInput
          value={firstName}
          type="text"
          identifier="firstName"
          label="First Name"
          handleChange={({ target }) => setFirstName(target.value)}
        />
        <UserInput
          value={lastName}
          type="text"
          identifier="lastName"
          label="Last Name"
          handleChange={({ target }) => setLastName(target.value)}
        />
        <UserInput
          value={username}
          type="text"
          identifier="username"
          label="Username"
          handleChange={({ target }) => setUsername(target.value)}
        />
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
        <Button type="submit" callToAction="Create User" />
      </form>
    </div>
  )
}

export default CreateUserForm
