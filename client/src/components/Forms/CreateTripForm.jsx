import { useState } from "react"
import { useDispatch } from "react-redux"

import { createATrip } from "../../api/reducers/tripReducer"

import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import FormButton from "../Buttons/FormButton"
import UserInput from "../Input/UserInput"

const CreateTripForm = () => {
  const [tripName, setTripName] = useState('')
  const [tripDesc, setTripDesc] = useState('')

  const dispatch = useDispatch()

  const token = JSON.parse(window.localStorage.getItem('loggedInUser'))

  const handleTripCreate = (event) => {
    event.preventDefault()
    const newTrip = {
      trip_name: tripName,
      trip_description: tripDesc,
      owner: token.id
    }

    try {
      dispatch(createATrip(newTrip))
      toast.success("Trip was created.")
    } catch (error) {
      toast.error("Something went wrong :(")
    }

    setTripName('')
    setTripDesc('')
  }



  return (
    <div>
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
        <FormButton type="submit" callToAction="Create Trip" />
      </form>
      <button className='rounded-lg border-slate-500 bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold'><Link to="/trips">My Trips</Link></button>
    </div>
  )
}

export default CreateTripForm