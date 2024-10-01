import PropTypes from 'prop-types'

const Button = ({ type, callToAction }) => {
  return (
    <button className='rounded-lg border-slate-500 bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold' type={type}>{callToAction}</button>
  )
}

Button.propTypes = {
  type: PropTypes.string.isRequired,
  callToAction: PropTypes.string.isRequired,
}

export default Button