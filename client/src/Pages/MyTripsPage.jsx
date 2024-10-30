import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { get_user } from '../api/services/userService'

import TripCard from '../components/Cards/TripCard'

const MyTripsPage = () => {
  const [trips, setTrips] = useState([])

  useEffect(() => {
    const populateUserTrips = async () => {
      const token = JSON.parse(window.localStorage.getItem('loggedInUser'))
      if (token.token) {
        const user = await get_user(token.id)
        setTrips(user.trips)
      }
    }
    populateUserTrips()
  }, [])

  return (
    <div>
      {trips.length === 0 ? (
        <div>You have no trips yet.</div>
      ) : (
        <div>
          {trips.map((trip) => (
            <TripCard tripId={trip._id} tripName={trip.trip_name} tripDescription={trip.trip_description} tripURL={trip.url} />
          ))}
        </div>
      )}
      <Link className="rounded-lg bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold" to="/trips/create">Create a Trip</Link>
    </div>
  )
}

export default MyTripsPage