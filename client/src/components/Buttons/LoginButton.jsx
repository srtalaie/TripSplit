import { Link } from "react-router-dom"

const LoginButton = () => {
  return (
    <button className='rounded-lg border-slate-500 bg-green-300 hover:bg-green-500 py-2 px-4'><Link to="/login">Login</Link></button>
  )
}

export default LoginButton