import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import TripCard from '../components/Cards/TripCard'

const MyTripsPage = () => {
  const trips = useSelector((state) => state.trips)

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