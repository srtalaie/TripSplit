import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import { addPayers, getAEvent } from "../api/reducers/eventReducer"

import CurrencyInput from 'react-currency-input-field'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

import FormButton from "../components/Buttons/FormButton"
import UserDropdown from "../components/Dropdowns/UserDropdown"
import UserInput from "../components/Input/UserInput"

const EventPage = () => {
  const [eventName, setEventName] = useState("")
  const [eventDesc, setEventDesc] = useState("")
  const [eventCost, setEventCost] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [selectedMemberArr, setSelectedMemberArr] = useState([])
  const [splitCost, setSplitCost] = useState(0)
  const [editModeToggle, setEditModeToggle] = useState(false)
  const [addPayersToggle, setAddPayersToggle] = useState(false)

  const dispatch = useDispatch()

  const { tripId, id } = useParams()

  useEffect(() => {
    const setSelectedEvent = async () => {
      // Set selectedEvent
      await dispatch(getAEvent(tripId, id))
    }
    setSelectedEvent()
  }, [])

  const trip = useSelector((state) => state.trips.find((trip) => trip._id.toString() === tripId))
  const event = useSelector((state) => state.events.selectedEvent)

  const handleEditToggle = () => {
    setEditModeToggle(!editModeToggle)
  }

  const handleAddPayersToggle = () => {
    setAddPayersToggle(!addPayersToggle)
  }

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

  const handleAddPayers = () => {
    if (selectedMemberArr.length > 0) {
      // Get member count and get total split cost based on amount. Round cost off to nearest cent
      const memberCount = (selectedMemberArr.length + 1)
      const costPerPayer = (Math.round((event.cost / memberCount) * 100) / 100).toFixed(2)
      setSplitCost(costPerPayer)
      // Create new array to hold payers
      const payerArr = selectedMemberArr.map((payer) => {
        const newPayer = {
          payer: payer._id,
          split: splitCost,
          user_owed: event.payee
        }
        return newPayer
      })
      try {
        dispatch(addPayers(tripId, id, payerArr))
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleEventEdit = () => {

  }

  return (
    <div>
      {!event || Object.keys(event).length === 0 ? (<p>...Loading</p>) : (
        <div>
          <h4>{event.event_name}</h4>
          <p>{event.formatted_date}</p>
          <p>{event.event_description}</p>
          <p>{event.payee.full_name}</p>
          <p>${event.cost}</p>
          <p>Split cost: ${splitCost}</p>
          <p>Members:</p>
          {trip.members.length <= 0 ? (<p>Add members to your trip!</p>) :
            (
              <div>
                <ul>
                  {trip.members.map((obj) => (
                    <li key={obj.member._id} id={obj.member._id}>{obj.member.full_name}</li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}
      {/* Add Payers Section */}
      <button className='rounded-lg border-slate-500 bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold' onClick={handleAddPayersToggle}>Add Payers</button>
      {addPayersToggle ? (
        <div>
          <p>Add members on the trip that will be splitting the cost of this event.</p>
          <UserDropdown userArr={trip.members} handleSelect={handlePayerSelect} title={"Trip Members"} handleSubmit={handleAddMember} />
        </div>
      ) : (
        <></>
      )}
      {/* Edit Section */}
      <button className='rounded-lg border-slate-500 bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold' onClick={handleEditToggle}>Edit Info</button>
      {editModeToggle ? (
        <form onSubmit={handleEventEdit}>
          <UserInput
            value={eventName}
            type="text"
            identifier="eventName"
            label="Event Name"
            handleChange={({ target }) => setEventName(target.value)}
          />
          <UserInput
            value={eventDesc}
            type="text"
            identifier="eventDesc"
            label="Event Description"
            handleChange={({ target }) => setEventDesc(target.value)}
          />
          <CurrencyInput
            value={eventCost}
            onValueChange={(value) => setEventCost(value)}
            decimalScale={2}
            defaultValue={0.00}
            placeholder='0.00'
            fixedDecimalLength={2}
            allowNegativeValue={false}
            step={.01}
            prefix="$"
            id='eventCost'
          />
          <label className='block text-gray-700 text-sm font-bold' htmlFor='date'>Date:</label>
          <DatePicker selected={eventDate} onChange={(date) => setEventDate(date)} />
          <FormButton type="submit" callToAction="Update Event Info" />
          <button className='rounded-lg border-slate-500 bg-red-300 hover:bg-red-500 py-2 px-4 font-bold' onClick={handleEditToggle}>Cancel</button>
        </form>
      ) : (
        <></>
      )}
    </div>
  )
}

export default EventPage