import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addFriend } from '../../api/reducers/userReducer'
import UserDropdown from '../Dropdowns/UserDropdown'

const AddMemberForm = () => {
  const [selectedUser, setSelectedUser] = useState('')
  const [members, setMembers] = useState([])

  const dispatch = useDispatch()

  const user = useSelector((state) => state.users.signedInUser)

  useEffect(() => {
    const populateMembers = async () => {
      if (user) {
        const userInfo = await get_user(user.id)
        setMembers(...userInfo.friends)
      }
    }
    populateMembers()
  }, [])

  const handleUserSelect = (e) => {
    setSelectedUser(e.target.id)
  }

  const handleAddFriend = () => {
    if (selectedUser) {
      try {
        dispatch(addFriend(selectedUser))
      } catch (error) {
        console.log(error);

      }
    }
  }

  return (
    <div>
      <UserDropdown handleSelect={handleUserSelect} handleSubmit={handleAddFriend} title={'Member'} userArr={members} />
    </div>
  )
}

export default AddMemberForm