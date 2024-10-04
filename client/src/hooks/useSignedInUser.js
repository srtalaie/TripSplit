import { useSelector } from 'react-redux'

export const useSignedInUser = () => {
  const signedInUser = useSelector((state) => state.signedInUser)
  return signedInUser
}
