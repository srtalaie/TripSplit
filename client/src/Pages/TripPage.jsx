import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"

import { addAMember, removeATrip, updateATrip } from "../api/reducers/tripReducer"

import FormButton from "../components/Buttons/FormButton"
import UserDropdown from "../components/Dropdowns/UserDropdown"
import UserInput from "../components/Input/UserInput"

const TripPage = () => {
  const [friendArr, setFriendArr] = useState([])
  const [selectedMemberArr, setSelectedMemberArr] = useState([])
  const [editModeToggle, setEditModeToggle] = useState(false)
  const [tripName, setTripName] = useState("")
  const [tripDesc, setTripDesc] = useState("")

  const { id } = useParams()
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const token = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const user = useSelector((state) => state.users.users.find((user) => user._id === token.id))
  const trip = useSelector((state) => state.trips.find((trip) => trip._id.toString() === id))

  useEffect(() => {
    const populateFriends = () => {
      if (user) {
        if (trip.members.length > 1) {
          // Remove logged in User from members array to prep for comparison with Friends array
          const userMemberIndex = trip.members.findIndex((obj) => obj.member._id === user._id)
          let membersArr = trip.members.toSpliced(userMemberIndex, 1)

          // Format members arr to inlcude user object within member
          const formattedMembersArr = []
          membersArr.forEach((obj) => formattedMembersArr.push(obj.member))

          // Create an array only with friends who are already NOT members on the current trip
          let uniquesArr = []
          user.friends.forEach((friend) => {
            if (formattedMembersArr.find((member) => member._id === friend._id)) {
              return
            } else {
              uniquesArr.push(friend)
            }
          })
          setFriendArr(uniquesArr)
        } else {
          setFriendArr(user.friends)
        }
      }
    }
    populateFriends()
  }, [])

  const handleFriendSelect = (e) => {
    const selectedFriendId = e.target.value
    if (selectedMemberArr.includes(selectedFriendId)) {
      let newArr = selectedMemberArr.filter((member) => member !== selectedFriendId)
      setSelectedMemberArr(newArr)
    } else {
      let newArr = selectedMemberArr.concat(selectedFriendId)
      setSelectedMemberArr(newArr)
    }
  }

  const handleAddMember = () => {
    if (selectedMemberArr.length > 0) {
      selectedMemberArr.forEach((memberId) => {
        try {
          dispatch(addAMember(id, memberId))
        } catch (error) {
          console.log(error)
        }
      })
    }
  }

  const handleDeleteTrip = async () => {
    try {
      dispatch(removeATrip(id))
      navigate('/trips', { replace: true })
    } catch (error) {
      console.log(error)

    }
  }

  const handleEditToggle = () => {
    setEditModeToggle(!editModeToggle)
  }

  const handleTripEdit = (e) => {
    e.preventDefault()

    const updatedTrip = {
      trip_name: tripName ? tripName : trip.trip_name,
      trip_description: tripDesc ? tripDesc : trip.trip_description
    }

    try {
      dispatch(updateATrip(trip._id, updatedTrip))
      setEditModeToggle(!editModeToggle)
      setTripName("")
      setTripDesc("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {!trip ? (<p>...Loading</p>) : (
        <div>
          <h4>{trip.trip_name}</h4>
          <p>{trip.trip_description}</p>
          <p>{trip.owner.full_name}</p>
          <p>Members:</p>
          {trip.members.length <= 0 ? (<p>Add members to your trip!</p>) :
            (
              <div>
                <ul>
                  {trip.members.map((obj) => (
                    <li key={obj.member._id} id={obj.member._id}>{obj.member.full_name}</li>
                  ))}
                </ul>
              </div>
            )}
          <p>Events:</p>
          {trip.events.length <= 0 ? (
            <div>
              <p>Add events to your trip!</p>
              <button className='rounded-lg border-slate-500 bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold'><Link to={`/${id}/events/create`}>Create an Event</Link></button>
            </div>
          ) : (
            <div>
              <button className='rounded-lg border-slate-500 bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold'><Link to={`/${id}/events/create`}>Create an Event</Link></button>
            </div>
          )}
          {friendArr.length === 0 ? (
            <p>You must have friends to add members to the trip! Or all of your friends are already part of this trip!</p>
          ) : (
            <UserDropdown userArr={friendArr} handleSelect={handleFriendSelect} title={"Trip Members"} handleSubmit={handleAddMember} />
          )}
          <button className='rounded-lg border-slate-500 bg-red-300 hover:bg-red-500 py-2 px-4 font-bold' onClick={handleDeleteTrip}>Delete Trip</button>
          <button className='rounded-lg border-slate-500 bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold' onClick={handleEditToggle}>Edit Info</button>
          {editModeToggle ? (
            <form onSubmit={handleTripEdit}>
              <UserInput
                value={tripName}
                type="text"
                identifier="tripName"
                label="Trip Name"
                handleChange={({ target }) => setTripName(target.value)}
              />
              <UserInput
                value={tripDesc}
                type="text"
                identifier="tripDesc"
                label="Trip Description"
                handleChange={({ target }) => setTripDesc(target.value)}
              />
              <FormButton type="submit" callToAction="Update Trip Info" />
              <button className='rounded-lg border-slate-500 bg-red-300 hover:bg-red-500 py-2 px-4 font-bold' onClick={handleEditToggle}>Cancel</button>
            </form>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  )
}

export default TripPage