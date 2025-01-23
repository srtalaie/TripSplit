import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import { addPayers, getAEvent } from "../api/reducers/eventReducer"

import PayerDropdown from "../components/Dropdowns/PayerDropdown"

const AddPayersPage = () => {
  const [selectedMemberArr, setSelectedMemberArr] = useState([])

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { tripId, id } = useParams()

  const token = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const user = useSelector((state) => state.users.users.find((user) => user._id === token.id))
  const trip = useSelector((state) => state.trips.find((trip) => trip._id.toString() === tripId))
  const event = useSelector((state) => state.events.selectedEvent)
  const filteredArr = trip.members.filter((obj) => obj.member._id !== user._id)

  useEffect(() => {
    const setSelectedEvent = async () => {
      // Set selectedEvent
      await dispatch(getAEvent(tripId, id))
    }
    setSelectedEvent()
  }, [])

  const handlePayerSelect = (e) => {
    const selectedFriendId = e.target.value
    if (selectedMemberArr.includes(selectedFriendId)) {
      let newArr = selectedMemberArr.filter((member) => member !== selectedFriendId)
      setSelectedMemberArr(newArr)
    } else {
      let newArr = selectedMemberArr.concat(selectedFriendId)
      setSelectedMemberArr(newArr)
    }
  }

  const handleAddPayers = async () => {
    if (selectedMemberArr.length > 0) {
      // Get member count and get total split cost based on amount. Round cost off to nearest cent
      const memberCount = (selectedMemberArr.length + 1)
      const costPerPayer = parseFloat((Math.round((event.cost / memberCount) * 100) / 100).toFixed(2))

      // Create new array to hold payers
      const payerArr = selectedMemberArr.map((payer) => {
        const newPayer = {
          payer: payer,
          split: costPerPayer,
        }
        return newPayer
      })
      try {
        const payersArr = { payersArr: payerArr }
        dispatch(addPayers(tripId, id, payersArr))
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div>
      <p>Add members on the trip that will be splitting the cost of this event.</p>
      <PayerDropdown userArr={filteredArr} handleSelect={handlePayerSelect} title={"Payers"} handleSubmit={handleAddPayers} />
    </div>
  )
}

export default AddPayersPage