import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


import TripCard from '../components/Cards/TripCard'

const MyTripsPage = () => {
  const [trips, setTrips] = useState([])
  const user = useSelector((state) => state.users.signedInUser)

  useEffect(() => {
    const populateUserTrips = async () => {
      if (user) {
        setTrips(user.user_info.trips)
      }
    }
    populateUserTrips()
  }, [])

  return (
    <div>
      {trips.length === 0 ? (
        <div>You have no trips yet.</div>
      ) : (
        trips.map((trip) => {
          <TripCard tripId={trip._id} tripName={trip.name} tripDescription={trip.description} tripOwner={trip.owner} tripURL={trip.url} />
        })
      )}
      <Link className="rounded-lg bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold" to="/trips/create">Create a Trip</Link>
    </div>
  )
}

export default MyTripsPage