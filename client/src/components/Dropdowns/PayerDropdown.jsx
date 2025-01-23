import { useState } from "react"

const PayerDropdown = ({ userArr, handleSelect, handleSubmit, title }) => {
  const [dropdownToggle, setdropdownToggle] = useState(false)
  const [queryText, setQueryText] = useState("")
  const [results, setResults] = useState(userArr)

  const handleDropdownClick = (e) => {
    setdropdownToggle(!dropdownToggle)
  }

  const handleUserNameInput = (e) => {
    setQueryText(e.target.value.toLowerCase())
    const filteredUsers = userArr.filter((user) => {
      if (queryText === "") {
        return user
      } else {
        return user.full_name.toLowerCase().includes(queryText)
      }
    })
    setResults(filteredUsers)
  }

  return (
    <div>
      <button onClick={handleDropdownClick} id="dropdownSearchButton" data-dropdown-placement="bottom" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Add {title}<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
      </svg>
      </button>
      {dropdownToggle ? (
        <div id="dropdownSearch" className="z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700">
          <div className="p-3">
            <label htmlFor="input-group-search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input onChange={handleUserNameInput} type="text" id="input-group-search" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search user" />
            </div>
          </div>
          <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
            {userArr.length === 0 ? (
              <li className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">No Users Found :(</li>
            ) : (
              results.map(user => (
                <li key={user.member._id}>
                  <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input id={user.member._id} type="checkbox" value={user.member._id} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" onChange={handleSelect} />
                    <label htmlFor={user.member._id} className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{`${user.member.first_name} ${user.member.last_name}`}</label>
                  </div>
                </li>
              ))
            )}
          </ul>
          <button className='rounded-lg border-slate-500 bg-cyan-300 hover:bg-cyan-500 py-2 px-4 font-bold' onClick={handleSubmit}>Add {title}</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default PayerDropdown