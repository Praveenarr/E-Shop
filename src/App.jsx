import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AppRoutes from './routes/AppRoutes'
import { loadUserFromStorage } from './redux/authSlice'
import { loadCartForUser } from './redux/cartSlice'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUserFromStorage())
    // Restore cart for the persisted session (page refresh)
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const { email } = JSON.parse(storedUser)
        dispatch(loadCartForUser(email))
      }
    } catch { /* ignore corrupt data */ }
  }, [dispatch])

  return <AppRoutes />
}
