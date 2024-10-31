import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { updateAUser } from '../../api/reducers/userReducer'
import FormButton from '../Buttons/FormButton'
import UserInput from '../Input/UserInput'

const UserInfoForm = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [editModeToggle, setEditModeToggle] = useState(false)

  const dispatch = useDispatch()

  const token = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const user = useSelector((state) => state.users.users.find((user) => user._id === token.id))

  useEffect(() => {
    const populateUserInfo = () => {
      if (user) {
        setFirstName(user.first_name)
        setLastName(user.last_name)
        setUsername(user.username)
        setEmail(user.email)
        setPhoneNumber(user.phone_number)
      }
    }
    populateUserInfo()
  }, [])

  const handleEditToggle = () => {
    setEditModeToggle(!editModeToggle)
  }

  const handleUserEdit = async (e) => {
    e.preventDefault()

    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      username: username,
      password: password
    }

    try {
      dispatch(updateAUser(user._id, updatedUser))
      setEditModeToggle(!editModeToggle)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {editModeToggle ? (
        <form onSubmit={handleUserEdit}>
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
            value={password}
            type="password"
            identifier="password"
            label="Password"
            handleChange={({ target }) => setPassword(target.value)}
          />
          <FormButton type="submit" callToAction="Update User Info" />
          <button onClick={handleEditToggle}>Cancel</button>
        </form>
      ) : (
        <div>
          <h4>User Info</h4>
          <p>First Name: {firstName}</p>
          <p>Last Name: {lastName}</p>
          <p>Username: {username}</p>
          <p>Email: {email}</p>
          <p>Phone Number: {phoneNumber}</p>
          <button onClick={handleEditToggle}>Edit Info</button>
        </div>
      )}
    </div>
  )
}

export default UserInfoForm