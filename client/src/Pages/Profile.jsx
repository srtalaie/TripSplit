import { useDispatch, useSelector } from "react-redux"

import { removeFriend } from "../api/reducers/userReducer"

import FriendTable from "../components/Tables/FriendTable"

const Profile = () => {
  const dispatch = useDispatch()

  const token = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const user = useSelector((state) => state.users.users.find((user) => user._id === token.id))

  // useEffect(() => {

  // }, [])

  const handleRemoveFriend = (e) => {
    try {
      const friendId = e.target.id
      dispatch(removeFriend(friendId))
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <FriendTable
        friends={user.friends}
        handleRemove={handleRemoveFriend}
      />
    </div>
  )
}

export default Profile