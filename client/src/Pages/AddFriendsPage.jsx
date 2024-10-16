import { useState } from 'react'
import { useSelector } from 'react-redux'
import UserInput from '../components/Input/UserInput'

const AddFriendsPage = () => {
  const [queryText, setQueryText] = useState("")
  const [queryNumber, setQueryNumber] = useState("")
  const [results, setResults] = useState([])

  const users = useSelector((state) => state.users)


  //TODO add handleInput for searching by phone number
  //Add check to see if user is using the phone number field or the name search field
  const handleUserInput = (e) => {
    setQueryText(e.target.value.toLowerCase())
    const filteredUsers = users.filter((user) => {
      if (queryText === "") {
        return user
      } else {
        console.log(user);

        return user.full_name.toLowerCase().includes(queryText)
      }
    })
    setResults(filteredUsers)
  }

  const handleSubmit = () => {

  }

  return (
    <div>
      <h4>Find friends by searching for their name</h4>
      <UserInput type="text" value={queryText} handleChange={handleUserInput} identifier='search' label='Search' />
      <UserInput type="tel" value={queryNumber} handleChange={handleUserInput} identifier='search' label='Search' />
      {users.length === 0 ? (
        <div>Something went wrong</div>
      ) : (
        results.map((user) => (
          <p key={user._id}>{user.full_name}</p>
        ))
      )}
    </div>
  )
}

export default AddFriendsPage