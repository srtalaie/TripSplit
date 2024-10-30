import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addFriend } from '../api/reducers/userReducer'

import UserInput from '../components/Input/UserInput'

const AddFriendsPage = () => {
  const [queryText, setQueryText] = useState("")
  const [queryNumber, setQueryNumber] = useState("")
  const [searchToggle, setSearchToggle] = useState(false)
  const [results, setResults] = useState([])

  const users = useSelector((state) => state.users.users)
  const token = JSON.parse(window.localStorage.getItem('loggedInUser'))

  const dispatch = useDispatch()

  // Filter our signed in user from list of friends
  const potentialFriends = users.filter((user) => user._id.toString() !== token.id)

  const handleUserNameInput = (e) => {
    setQueryText(e.target.value.toLowerCase())
    const filteredUsers = potentialFriends.filter((user) => {
      if (queryText === "") {
        return user
      } else {
        return user.full_name.toLowerCase().includes(queryText)
      }
    })
    setResults(filteredUsers)
  }

  const handleUserNumberInput = (e) => {
    setQueryNumber(e.target.value)
    const filteredUsers = potentialFriends.filter((user) => {
      if (queryNumber === "") {
        return user
      } else {
        return user.phone_number.includes(queryNumber)
      }
    })
    setResults(filteredUsers)
  }

  const handleSearchToggle = () => {
    setSearchToggle(!searchToggle)
  }

  const handleSubmit = (e) => {
    const friendId = e.target.value
    try {
      dispatch(addFriend(friendId))
    } catch (error) {
      alert("Could not add user, please check to see if the User is already a friend")
    }
  }

  return (
    <div>
      <h4>Find friends by searching for their name or number</h4>
      {searchToggle === false ? (
        <div>
          <UserInput type="text" value={queryText} handleChange={handleUserNameInput} identifier='search' label='Search Full Name' />
          <button onClick={handleSearchToggle}>Switch to Phone Number</button>
        </div>
      ) : (
        <div>
          <UserInput type="tel" value={queryNumber} handleChange={handleUserNumberInput} identifier='search' label='Search Phone Number' />
          <button onClick={handleSearchToggle}>Switch to Name</button>
        </div>
      )}
      {users.length === 0 ? (
        <div>No users found</div>
      ) : (
        results.map((user) => (
          <div key={user._id}>
            <p>{user.full_name}</p>
            <button value={user._id} onClick={handleSubmit}>Add Friend</button>
          </div>
        ))
      )}
    </div>
  )
}

export default AddFriendsPage