import PropTypes from 'prop-types'

const LogoutButton = ({ handleLogout }) => {
  return (
    <button className='rounded-lg border-slate-500 bg-red-300 hover:bg-red-500 px-2.5 py-0.5' onClick={handleLogout}>Logout</button>
  )
}

LogoutButton.propTypes = {
  handleLogout: PropTypes.func.isRequired
}

export default LogoutButton