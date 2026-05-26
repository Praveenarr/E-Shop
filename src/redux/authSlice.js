import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.loading = false
      state.error = null
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    setAuthLoading(state) {
      state.loading = true
      state.error = null
    },
    setAuthError(state, action) {
      state.loading = false
      state.error = action.payload
    },
    clearAuthError(state) {
      state.error = null
    },
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    loadUserFromStorage(state) {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      if (!token || !user) return
      try {
        const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const padded = b64 + '=='.slice(0, (4 - b64.length % 4) % 4)
        const payload = JSON.parse(atob(padded))
        if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          return
        }
      } catch { /* load anyway if token is undecodable */ }
      state.token = token
      state.user = JSON.parse(user)
    },
  },
})

export const {
  setCredentials,
  setAuthLoading,
  setAuthError,
  clearAuthError,
  logout,
  loadUserFromStorage,
} = authSlice.actions

export const selectAuth = (state) => state.auth
export const selectIsAuthenticated = (state) => !!state.auth.token

export default authSlice.reducer
