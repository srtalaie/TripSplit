import { useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

const EventPage = () => {
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventCost, setEventCost] = useState("")
  const [eventDate, setEventDate] = useState("")

  const { tripId, id } = useParams()
  const trip = useSelector((state) => state.trips.find((trip) => trip._id.toString() === tripId))
  const event = trip.events.find((event) => event._id.toString() === id)

  console.log(event);


  return (
    <div>EventPage</div>
  )
}

export default EventPage