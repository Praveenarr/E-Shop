import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  setDetailLoading,
  setSelectedProduct,
  setDetailError,
  clearSelected,
  selectSelectedProduct,
  selectDetailLoading,
  selectProducts,
} from '../redux/productSlice'
import { fetchProductById } from '../services/productService'
import { useCart } from '../hooks/useCart'
import { useToast } from '../context/ToastContext'
import { formatPrice, capitalize } from '../utils/formatters'
import Loader from '../components/Loader'

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const product = useSelector(selectSelectedProduct)
  const loading = useSelector(selectDetailLoading)
  const allProducts = useSelector(selectProducts)
  const { add, isInCart, increase, decrease, items } = useCart()
  const { show: showToast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    // Check Redux list first — covers locally-added products with Date.now() ids
    const existing = allProducts.find((p) => String(p.id) === String(id))
    if (existing) {
      dispatch(setSelectedProduct(existing))
      return
    }
    const load = async () => {
      dispatch(setDetailLoading())
      try {
        const data = await fetchProductById(id)
        dispatch(setSelectedProduct(data))
      } catch (e) {
        dispatch(setDetailError(e.message))
      }
    }
    load()
    return () => dispatch(clearSelected())
  }, [dispatch, id]) // intentionally omit allProducts — check runs once per navigation

  useEffect(() => {
    if (product) setAdded(isInCart(product.id))
  }, [product, isInCart, items])

  const handleAddToCart = () => {
    if (added) return
    for (let i = 0; i < quantity; i++) add(product)
    setAdded(true)
    showToast(`Added ${quantity > 1 ? `${quantity}× ` : ''}to cart!`)
  }

  const handleBuyNow = () => {
    if (!added) {
      for (let i = 0; i < quantity; i++) add(product)
      setAdded(true)
    }
    navigate('/checkout')
  }

  const handleDecrement = () => {
    if (added) decrease(product.id)
    else setQuantity((q) => Math.max(1, q - 1))
  }

  const handleIncrement = () => {
    if (added) increase(product.id)
    else setQuantity((q) => q + 1)
  }

  const cartItem = product ? items.find((i) => i.id === product.id) : null
  const displayQty = added ? (cartItem?.quantity ?? 1) : quantity

  if (loading) return <Loader text="Loading product…" />

  if (!product) return (
    <div className="text-center py-24 px-4">
      <p className="text-gray-400">Product not found.</p>
      <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 hover:underline">
        Back to Shop
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        <nav className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 flex flex-wrap gap-x-2 gap-y-1 items-center">
          <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-indigo-600">{capitalize(product.category)}</span>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[160px] sm:max-w-xs">{product.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">

            <div className="bg-gray-50 flex items-center justify-center p-6 sm:p-12 min-h-56 sm:min-h-80">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-52 sm:max-h-72 max-w-full object-contain"
              />
            </div>

            <div className="p-5 sm:p-8 flex flex-col gap-4 sm:gap-5">
              <div>
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-2 sm:mb-3">
                  {capitalize(product.category)}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
              </div>

              {product.rating && (
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-base sm:text-lg leading-none">
                    {'★'.repeat(Math.round(product.rating.rate))}
                    {'☆'.repeat(5 - Math.round(product.rating.rate))}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {product.rating.rate} ({product.rating.count} reviews)
                  </span>
                </div>
              )}

              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700">
                {formatPrice(product.price)}
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-sm text-gray-600 font-medium">
                  {added ? 'In cart:' : 'Qty:'}
                </span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={handleDecrement}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold bg-gray-50">
                    {displayQty}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all ${
                    added
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-95'
                  }`}
                >
                  {added ? '✓ In Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-2.5 sm:py-3 rounded-xl font-bold text-sm bg-yellow-400 text-indigo-900 hover:bg-yellow-300 shadow-md transition-all active:scale-95"
                >
                  {added ? 'Go to Checkout' : 'Buy Now'}
                </button>
              </div>

              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-400 hover:text-indigo-600 transition-colors text-left"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
