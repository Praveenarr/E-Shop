import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import {
  setCredentials,
  setAuthLoading,
  setAuthError,
  clearAuthError,
  logout,
  selectAuth,
  selectIsAuthenticated,
} from '../redux/authSlice'
import { mergeCartOnLogin, clearCart, selectCartItems } from '../redux/cartSlice'
import { loginUser, signupUser } from '../services/authService'

export function useAuth() {
  const dispatch = useDispatch()
  const auth = useSelector(selectAuth)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const guestItems = useSelector(selectCartItems)

  const signIn = useCallback(async (credentials) => {
    dispatch(setAuthLoading())
    try {
      const result = await loginUser(credentials)
      dispatch(setCredentials(result))
      dispatch(mergeCartOnLogin({ email: result.user.email, guestItems }))
    } catch (e) {
      dispatch(setAuthError(e.message))
    }
  }, [dispatch, guestItems])

  const signUp = useCallback(async (data) => {
    dispatch(setAuthLoading())
    try {
      const result = await signupUser(data)
      dispatch(setCredentials(result))
      dispatch(clearCart())
    } catch (e) {
      dispatch(setAuthError(e.message))
    }
  }, [dispatch])

  const signOut = useCallback(() => {
    dispatch(logout())
    dispatch(clearCart())
  }, [dispatch])

  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch])

  return { ...auth, isAuthenticated, signIn, signUp, signOut, clearError }
}
