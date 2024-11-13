import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'

import CurrencyInput from 'react-currency-input-field'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

import FormButton from '../Buttons/FormButton'
import UserInput from '../Input/UserInput'

const CreateEventForm = () => {
  const [eventName, setEventName] = useState("")
  const [eventDesc, setEventDesc] = useState("")
  const [totalCost, setTotalCost] = useState(0.0)
  const [eventDate, setEventDate] = useState(new Date())

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { tripId } = useParams()

  const token = JSON.parse(window.localStorage.getItem('loggedInUser'))
  const user = useSelector((state) => state.users.users.find((user) => user._id === token.id))

  const handleEventCreate = (event) => {
    event.preventDefault()

    let formattedCost = 0
    if (totalCost) {
      formattedCost = parseFloat(totalCost)
    }

    const newEvent = {
      event_name: eventName,
      event_description: eventDesc,
      cost: formattedCost,
      date: eventDate,
      trip: tripId,
      payee: user._id,
    }

    console.log(newEvent);

  }

  return (
    <div>
      <form className='flexw-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4' onSubmit={handleEventCreate}>
        <UserInput
          value={eventName}
          type="text"
          identifier="eventName"
          label="Event Name"
          handleChange={({ target }) => setEventName(target.value)}
        />
        <UserInput
          value={eventDesc}
          type="textarea"
          identifier="eventDesc"
          label="Event Description"
          handleChange={({ target }) => setEventDesc(target.value)}
        />
        <label className='block text-gray-700 text-sm font-bold' htmlFor='totalCost'>Total Cost:</label>
        <CurrencyInput
          value={totalCost}
          onValueChange={(value) => setTotalCost(value)}
          decimalScale={2}
          defaultValue={0.00}
          placeholder='0.00'
          fixedDecimalLength={2}
          allowNegativeValue={false}
          step={.01}
          prefix="$"
          id='totalCost'
        />
        <label className='block text-gray-700 text-sm font-bold' htmlFor='date'>Date:</label>
        <DatePicker selected={eventDate} onChange={(date) => setEventDate(date)} />
        <FormButton type="submit" callToAction="Create Event" />
      </form>
      <button className='rounded-lg border-slate-500 bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold'><Link to="/trips">My Trips</Link></button>
    </div>
  )
}

export default CreateEventForm