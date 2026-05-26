import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../context/ToastContext'
import CartItem from '../components/CartItem'
import { formatPrice } from '../utils/formatters'

export default function Cart() {
  const { items, summary, coupon, applyCode, removeCode } = useCart()
  const { isAuthenticated } = useAuth()
  const { show: showToast } = useToast()
  const navigate = useNavigate()

  const [couponInput, setCouponInput] = useState('')

  const { subtotal, discount, tax, total } = useMemo(() => summary, [summary])

  const prevCouponRef = useRef(coupon.code)

  // useEffect — show success toast when a coupon is applied successfully
  useEffect(() => {
    if (coupon.code && coupon.code !== prevCouponRef.current) {
      showToast(`Coupon "${coupon.code}" applied — ${coupon.data?.label}!`)
    }
    prevCouponRef.current = coupon.code
  }, [coupon.code, coupon.data, showToast])

  const handleApply = () => {
    if (!couponInput.trim()) return
    applyCode(couponInput)
    setCouponInput('')
  }

  const handleRemoveCoupon = () => {
    removeCode()
    showToast('Coupon removed', 'info')
  }

  const handleCheckout = () => {
    if (!isAuthenticated) navigate('/login')
    else navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <div className="text-7xl sm:text-8xl mb-5 sm:mb-6">🛒</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          Shopping Cart{' '}
          <span className="text-gray-400 font-normal text-base sm:text-lg">
            ({items.length} item{items.length > 1 ? 's' : ''})
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline mt-2"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary panel */}
          <div className="space-y-4">
            {/* Coupon section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Coupon Code</h3>

              {coupon.code ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div>
                    <span className="text-green-700 font-semibold text-sm">{coupon.code}</span>
                    <p className="text-green-600 text-xs">{coupon.data?.label} applied!</p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-400 hover:text-red-600 text-xs font-medium ml-2 flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleApply()}
                    placeholder="Enter code…"
                    className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    onClick={handleApply}
                    className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex-shrink-0"
                  >
                    Apply
                  </button>
                </div>
              )}

              {coupon.error && (
                <p className="text-red-500 text-xs mt-2">{coupon.error}</p>
              )}
              {!coupon.code && !coupon.error && (
                <p className="text-gray-400 text-xs mt-2">
                  Try: SAVE10 · FLAT200 · FIRST20 · SUMMER15
                </p>
              )}
            </div>

            {/* Price breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">Order Summary</h3>
              <div className="space-y-2.5 sm:space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({coupon.code})</span>
                    <span>− {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-gray-900">
                  <span>Total</span>
                  <span className="text-indigo-700">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg active:scale-95"
              >
                Proceed to Checkout
              </button>
              {!isAuthenticated && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  You'll be asked to login first
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
