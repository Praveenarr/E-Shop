import { createSlice, createSelector } from '@reduxjs/toolkit'

const TAX_RATE = 0.18 // 18% GST

const COUPON_FORMAT_REGEX = /^[A-Z0-9]{4,12}$/

const COUPONS = {
  SAVE10: {
    discount: 0.10,
    minValue: 500,
    label: '10% off',
    expiry: '2026-12-31',
    categories: null,
  },
  FLAT200: {
    discount: 200,
    type: 'flat',
    minValue: 1000,
    label: '₹200 flat off',
    expiry: '2026-08-31',
    categories: ['electronics'],
  },
  FIRST20: {
    discount: 0.20,
    minValue: 0,
    label: '20% off',
    expiry: '2026-12-31',
    categories: null,
  },
  SUMMER15: {
    discount: 0.15,
    minValue: 300,
    label: '15% off on clothing',
    expiry: '2026-09-30',
    categories: ["men's clothing", "women's clothing"],
  },
}

const initialState = {
  items: [],
  couponCode: '',
  couponData: null,
  couponError: '',
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((i) => i.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    increaseQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) item.quantity += 1
    },
    decreaseQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload)
      if (item && item.quantity > 1) {
        item.quantity -= 1
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload)
      }
    },
    clearCart(state) {
      state.items = []
      state.couponCode = ''
      state.couponData = null
      state.couponError = ''
    },
    applyCoupon(state, action) {
      const code = action.payload.trim().toUpperCase()

      if (!COUPON_FORMAT_REGEX.test(code)) {
        state.couponError = 'Invalid format. Coupon must be 4–12 uppercase letters/numbers.'
        state.couponData = null
        state.couponCode = ''
        return
      }

      const coupon = COUPONS[code]
      if (!coupon) {
        state.couponError = 'Coupon code not found.'
        state.couponData = null
        state.couponCode = ''
        return
      }

      if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
        state.couponError = `Coupon "${code}" has expired.`
        state.couponData = null
        state.couponCode = ''
        return
      }

      const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      if (subtotal < coupon.minValue) {
        state.couponError = `Minimum cart value of ₹${coupon.minValue} required for this coupon.`
        state.couponData = null
        state.couponCode = ''
        return
      }

      if (coupon.categories) {
        const hasEligible = state.items.some((i) =>
          coupon.categories.includes(i.category?.toLowerCase())
        )
        if (!hasEligible) {
          state.couponError = `This coupon is valid only for: ${coupon.categories.join(', ')}.`
          state.couponData = null
          state.couponCode = ''
          return
        }
      }

      state.couponCode = code
      state.couponData = coupon
      state.couponError = ''
    },
    removeCoupon(state) {
      state.couponCode = ''
      state.couponData = null
      state.couponError = ''
    },
    loadCartForUser(state, action) {
      const email = action.payload
      try {
        const saved = localStorage.getItem(`cart_${email}`)
        if (saved) {
          const { items, couponCode, couponData } = JSON.parse(saved)
          state.items = items ?? []
          state.couponCode = couponCode ?? ''
          state.couponData = couponData ?? null
          state.couponError = ''
        } else {
          state.items = []
          state.couponCode = ''
          state.couponData = null
          state.couponError = ''
        }
      } catch { /* ignore corrupt data */ }
    },
    // Called by useAuth after successful login to merge guest cart into user's saved cart
    mergeCartOnLogin(state, action) {
      const { email, guestItems } = action.payload
      try {
        const saved = localStorage.getItem(`cart_${email}`)
        if (saved) {
          const { items: savedItems, couponCode, couponData } = JSON.parse(saved)
          const merged = [...(savedItems ?? [])]
          guestItems.forEach((guestItem) => {
            const existing = merged.find((i) => i.id === guestItem.id)
            if (existing) {
              existing.quantity += guestItem.quantity
            } else {
              merged.push(guestItem)
            }
          })
          state.items = merged
          state.couponCode = couponCode ?? ''
          state.couponData = couponData ?? null
          state.couponError = ''
        } else {
          state.items = [...guestItems]
          state.couponCode = ''
          state.couponData = null
          state.couponError = ''
        }
      } catch {
        state.items = [...guestItems]
      }
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  loadCartForUser,
  mergeCartOnLogin,
} = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0)

export const selectCoupon = createSelector(
  (state) => state.cart.couponCode,
  (state) => state.cart.couponData,
  (state) => state.cart.couponError,
  (code, data, error) => ({ code, data, error })
)

export const selectCartSummary = createSelector(
  (state) => state.cart.items,
  (state) => state.cart.couponData,
  (items, couponData) => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    let discount = 0
    if (couponData) {
      discount = couponData.type === 'flat'
        ? Math.min(couponData.discount, subtotal)
        : subtotal * couponData.discount
    }
    const taxable = subtotal - discount
    const tax = taxable * TAX_RATE
    const total = taxable + tax
    return { subtotal, discount, tax, total }
  }
)

export const TAX_RATE_VALUE = TAX_RATE

export default cartSlice.reducer
