import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import { getAEvent } from "../api/reducers/eventReducer"

import FormButton from "../components/Buttons/FormButton"
import UserInput from "../components/Input/UserInput"

const EventPage = () => {
  const [eventName, setEventName] = useState("")
  const [eventDesc, setEventDesc] = useState("")
  const [eventCost, setEventCost] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [memberArr, setMemberArr] = useState([])
  const [selectedMemberArr, setSelectedMemberArr] = useState([])
  const [editModeToggle, setEditModeToggle] = useState(false)

  const dispatch = useDispatch()

  const { tripId, id } = useParams()

  useEffect(() => {
    const setSelectedEvent = async () => {
      // Set selectedEvent
      await dispatch(getAEvent(tripId, id))
    }
    setSelectedEvent()
  }, [])

  const trip = useSelector((state) => state.trips.find((trip) => trip._id.toString() === tripId))
  const event = useSelector((state) => state.events.selectedEvent)

  const handleEditToggle = () => {
    setEditModeToggle(!editModeToggle)
  }

  const handleEventEdit = () => {

  }

  return (
    <div>
      {!event || Object.keys(event).length === 0 ? (<p>...Loading</p>) : (
        <div>
          <h4>{event.event_name}</h4>
          <p>{event.formatted_date}</p>
          <p>{event.event_description}</p>
          <p>{event.payee.full_name}</p>
          <p>${event.cost}</p>
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
        </div>
      )}
      <button className='rounded-lg border-slate-500 bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold' onClick={handleEditToggle}>Edit Info</button>
      {editModeToggle ? (
        <form onSubmit={handleEventEdit}>
          <UserInput
            value={eventName}
            type="text"
            identifier="eventName"
            label="Event Name"
            handleChange={({ target }) => setEventName(target.value)}
          />
          <UserInput
            value={eventDesc}
            type="text"
            identifier="eventDesc"
            label="Event Description"
            handleChange={({ target }) => setEventDesc(target.value)}
          />
          <FormButton type="submit" callToAction="Update Event Info" />
          <button className='rounded-lg border-slate-500 bg-red-300 hover:bg-red-500 py-2 px-4 font-bold' onClick={handleEditToggle}>Cancel</button>
        </form>
      ) : (
        <></>
      )}
    </div>
  )
}

export default EventPage