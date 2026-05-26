import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import authReducer from './authSlice'
import productReducer from './productSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    products: productReducer,
  },
})

// Auto-save cart to localStorage keyed by user email on every state change
store.subscribe(() => {
  const { auth, cart } = store.getState()
  if (auth.user?.email) {
    localStorage.setItem(`cart_${auth.user.email}`, JSON.stringify(cart))
  }
})
