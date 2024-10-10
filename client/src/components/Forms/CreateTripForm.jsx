import { useState } from "react"
import { useDispatch } from "react-redux"

import { createATrip } from "../../api/reducers/tripReducer"

import FormButton from "../Buttons/FormButton"
import UserDropdown from "../Dropdowns/UserDropdown"
import UserInput from "../Input/UserInput"

const CreateTripForm = ({ owner, members }) => {
  const [tripName, setTripName] = useState('')
  const [tripDesc, setTripDesc] = useState('')
  const [friendArr, setFriendArr] = useState([])
  const [selectedMember, setSelectedMember] = useState([])

  const dispatch = useDispatch()

  const handleTripCreate = () => {
    const newTrip = {
      trip_name: tripName,
      trip_description: tripDesc,
      owner: owner
    }

    try {
      dispatch(createATrip(newTrip))
    } catch (error) {
      console.log(error)
    }

    setTripName('')
    setTripDesc('')
  }

  const handleFriendSelect = (e) => {

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
        <UserDropdown userArr={members} handleSelect={handleFriendSelect} />
      )}
      <FormButton type="submit" callToAction="Create Trip" />
    </form>
  )
}

export default CreateTripForm