import PropTypes from 'prop-types'

const UserInput = ({ value, identifier, label, handleChange, type }) => {
  return (
    <div className='flex items-baseline	space-x-4 space-y-4 my-1.5'>
      <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor={identifier}>{label}:</label>
      <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type={type}
          name={identifier}
          value={value}
          id={identifier}
          label={label}
          onChange={handleChange}
        />
    </div>
  )
}

UserInput.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
}

export default UserInput