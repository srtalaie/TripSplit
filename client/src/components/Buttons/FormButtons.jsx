import PropTypes from 'prop-types'

const FormButton = ({ type, callToAction }) => {
  return (
    <button className='rounded-lg border-slate-500 bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold' type={type}>{callToAction}</button>
  )
}

FormButton.propTypes = {
  type: PropTypes.string.isRequired,
  callToAction: PropTypes.string.isRequired,
}

export default FormButton