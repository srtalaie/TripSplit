import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getAEvent } from "../api/reducers/eventReducer"

const EventPage = () => {
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventCost, setEventCost] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [memberArr, setMemberArr] = useState([])
  const [selectedMemberArr, setSelectedMemberArr] = useState([])

  const dispatch = useDispatch()

  const { tripId, id } = useParams()

  // Set selectedEvent
  dispatch(getAEvent(tripId, id))

  const trip = useSelector((state) => state.trips.find((trip) => trip._id.toString() === tripId))
  const event = useSelector((state) => state.events.selectedEvent)
  console.log(event)


  return (
    <div>
      {!event ? (<p>...Loading</p>) : (
        <div>
          <h4>{event.event_name}</h4>
          <p>{event.event_description}</p>
          <p>{event.payee.full_name}</p>
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
    </div>
  )
}

export default EventPage