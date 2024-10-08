import LogoutButton from "../Buttons/LogoutButton"

const NavBar = ({ handleLogout }) => {
  return (
  <div>
      <LogoutButton handleLogout={handleLogout} />
  </div>

  )
}

export default NavBar