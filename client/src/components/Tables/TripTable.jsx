import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const TripTable = ({ trips }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Trips</th>
        </tr>
      </thead>
      <tbody>
        {trips.length === 0 ? (
          <tr>
            <td>You are not part of any trips yet</td>
          </tr>
        ) : (
          trips.map((trip) => (
            <tr key={trip._id}>
              <td><Link to={trip.url}>{trip.trip_name}</Link></td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

TripTable.propTypes = {
  trips: PropTypes.array
}

export default TripTable