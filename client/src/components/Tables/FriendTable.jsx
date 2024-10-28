import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const FriendTable = ({ handleRemove, friends }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Friends</th>
        </tr>
      </thead>
      <tbody>
        {friends.length === 0 ? (
          <tr>
            <td>You do not have any friends yet. Add your <Link to="/friends">friends</Link>!</td>
          </tr>
        ) : (
          friends.map((friend) => (
            <tr key={friend._id}>
              <td>{friend.full_name}</td>
              <td><button id={friend._id} onClick={handleRemove}>Remove Friend?</button></td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

FriendTable.propTypes = {
  handleRemove: PropTypes.func.isRequired,
  friends: PropTypes.array
}

export default FriendTable