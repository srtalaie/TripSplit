import { Link } from 'react-router-dom';

const TripCard = ({ tripId, tripName, tripDescription, tripOwner, tripURL }) => {
  return (
    <Link key={tripId} to={tripURL}>
      <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h4>{tripName}</h4>
        <p>{tripDescription}</p>
        <p>{tripOwner}</p>
      </div>
    </Link>
  )
}

export default TripCard