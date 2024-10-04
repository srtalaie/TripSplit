import { useDispatch } from "react-redux"

import { logoutAUser } from "../../api/reducers/userReducer"

const LogoutButton = () => {
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutAUser())
  }

  return (
    <button className='rounded-lg border-slate-500 bg-red-300 hover:bg-red-500 py-2 px-4 font-bold' onClick={handleLogout}>Logout</button>
  )
}

export default LogoutButton