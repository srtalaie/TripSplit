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
          <div>
            <p>You do not have any friends yet. Add your <Link to="/friends">friends</Link>!</p>
          </div>
        ) : (
          friends.map((friend) => (
            <tr>
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