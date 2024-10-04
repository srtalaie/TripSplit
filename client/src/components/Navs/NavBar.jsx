
import { useSignedInUser } from "../../hooks/useSignedInUser"
import LoginPage from '../../Pages/LoginPage'
import LogoutButton from '../Buttons/LogoutButton'

const NavBar = () => {
  const signedInUser = useSignedInUser()
  return (
    <div>
      {window.localStorage.getItem('loggedInUser') ? (
        <LogoutButton />
      ): (
        <div>
          <LoginPage />
          <LogoutButton />
        </div>
        
      )}
    </div>
  )
}

export default NavBar