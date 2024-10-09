import { useState } from "react"

import FormButton from "../Buttons/FormButton"
import FriendDropdown from "../Dropdowns/FriendDropdown"
import UserInput from "../Input/UserInput"

const CreateTripForm = ({ handleTripCreate, handleFriendSelect }) => {
  const [tripName, setTripName] = useState('')
  const [tripDesc, setTripDesc] = useState('')
  const [friendArr, setFriendArr] = useState([])

  const handleTripCreate = () => {
    handleTripCreate()

    setTripName('')
    setTripDesc('')
  }

  return (
    <form className='flexw-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4' onSubmit={handleTripCreate}>
      <UserInput
        value={tripName}
        type="text"
        identifier="tripName"
        label="Trip Name"
        handleChange={({ target }) => setTripName(target.value)}
      />
      <UserInput
        value={tripDesc}
        type="textarea"
        identifier="tripDesc"
        label="Trip Description"
        handleChange={({ target }) => setTripDesc(target.value)}
      />
      {friendArr.length === 0 ? (
        <p>You must have friends to add members to the trip.</p>
      ) : (
        <FriendDropdown friendArr={friendArr} handleFriendSelect={handleFriendSelect} />
      )}
      <FormButton type="submit" callToAction="Create Trip" />
    </form>
  )
}

export default CreateTripForm