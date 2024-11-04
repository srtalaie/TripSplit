import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import { addAMember } from "../api/reducers/tripReducer"

import UserDropdown from "../components/Dropdowns/UserDropdown"

const TripPage = () => {
  const [friendArr, setFriendArr] = useState([])
  const [selectedMemberArr, setSelectedMemberArr] = useState([])

  const { id } = useParams()

  const dispatch = useDispatch()

  const token = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const user = useSelector((state) => state.users.users.find((user) => user._id === token.id))
  const trip = useSelector((state) => state.trips.find((trip) => trip._id.toString() === id))

  console.log(trip);

  useEffect(() => {
    const populateFriends = () => {
      if (user) {
        setFriendArr(user.friends)
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
                    <li key={obj.member._id}>{obj.member.full_name}</li>
                  ))}
                </ul>
              </div>
            )}
          <p>Events:</p>
          {trip.events.length <= 0 ? (<p>Add events to your trip!</p>) :
            (
              <div>

              </div>
            )}
          {friendArr.length === 0 ? (
            <p>You must have friends to add members to the trip.</p>
          ) : (
            <UserDropdown userArr={friendArr} handleSelect={handleFriendSelect} title={"Trip Members"} handleSubmit={handleAddMember} />
          )}
        </div>
      )}
    </div>
  )
}

export default TripPage