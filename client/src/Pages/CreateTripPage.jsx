import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { addAMember, createATrip } from "../api/reducers/tripReducer"

import { get_user } from "../api/services/userService"
import CreateTripForm from "../components/Forms/CreateTripForm"

const CreateTripPage = () => {
  const [members, setMembers] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])

  const user = useSelector((state) => state.users.signedInUser)
  const dispatch = useDispatch()

  useEffect(() => {
    const populateMembers = async () => {
      if (user) {
        const userInfo = await get_user(user.id)
        setMembers(...userInfo.friends)
      }
    }
    populateMembers()
  }, [])

  const handleTripCreate = () => {


    dispatch(createATrip)
    dispatch(addAMember)
  }

  const handleFriendSelect = (e) => {

  }

  return (
    <div>
      <CreateTripForm />
    </div>
  )
}

export default CreateTripPage