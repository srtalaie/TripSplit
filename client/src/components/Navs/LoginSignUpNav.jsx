import { useState } from "react"
import { Link } from "react-router-dom"

const LoginSignUpNav = () => {
  const [nav, setNav] = useState(false)

  const handleNav = () => {
    setNav(!nav)
  }

  return (
    <nav className="bg-black text-white max-w-screen-xl flex flex-wrap items-center justify-end mx-auto p-4">
      {/* Desktop Navigation */}
      <div className="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
          <li>
            <Link className="rounded-lg border-slate-500 bg-green-300 hover:bg-green-500 px-2.5 py-0.5" to="/login">Login</Link>
          </li>
          <li>
            <Link to="/create-user">Create User</Link>
          </li>
        </ul>
      </div>
      {/* Mobile Navigation */}
      <div onClick={handleNav} className='block md:hidden'>
        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
      </div>
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] text-white ease-in-out duration-500'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        <li className='p-4 border-b rounded-xl hover:bg-[#fff] duration-300 hover:text-black cursor-pointer border-gray-600'>
          <Link className="rounded-lg border-slate-500 bg-green-300 hover:bg-green-500 px-2.5 py-0.5 text-black" to="/login">Login</Link>
        </li>
        <li className='p-4 border-b rounded-xl hover:bg-[#fff] duration-300 hover:text-black cursor-pointer border-gray-600'>
          <Link to="/create-user">Create User</Link>
        </li>
      </ul>
    </nav>
  )
}

export default LoginSignUpNav