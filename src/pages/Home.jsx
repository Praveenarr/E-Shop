import { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setProductsLoading,
  setProducts,
  setProductsError,
  setCategories,
  setSelectedCategory,
  setSearchQuery,
  setSortBy,
  selectProducts,
  selectCategories,
  selectProductFilters,
  selectProductLoading,
  selectProductsStatus,
} from '../redux/productSlice'
import { fetchProducts, fetchCategories } from '../services/productService'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import { capitalize } from '../utils/formatters'

export default function Home() {
  const dispatch = useDispatch()
  const allProducts = useSelector(selectProducts)
  const categories = useSelector(selectCategories)
  const { category, search, sort } = useSelector(selectProductFilters)
  const loading = useSelector(selectProductLoading)
  const status = useSelector(selectProductsStatus)

  useEffect(() => {
    if (status !== 'idle' && status !== 'failed') return
    const load = async () => {
      dispatch(setProductsLoading())
      try {
        const [products, cats] = await Promise.all([fetchProducts(), fetchCategories()])
        dispatch(setProducts(products))
        dispatch(setCategories(cats))
      } catch (e) {
        dispatch(setProductsError(e.message))
      }
    }
    load()
  }, [dispatch, status])

  const handleCategoryChange = useCallback((cat) => {
    dispatch(setSelectedCategory(cat))
  }, [dispatch])

  const handleSearch = useCallback((e) => {
    dispatch(setSearchQuery(e.target.value))
  }, [dispatch])

  const handleSort = useCallback((e) => {
    dispatch(setSortBy(e.target.value))
  }, [dispatch])

  const filteredProducts = useMemo(() => {
    let list = [...allProducts]
    if (category && category !== 'all') {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase())
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    }
    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
    return list
  }, [allProducts, category, search, sort])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 sm:mb-4 tracking-tight leading-tight">
            Shop the <span className="text-yellow-400">Best Deals</span>
          </h1>
          <p className="text-indigo-200 text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto px-2">
            Discover thousands of products at unbeatable prices — electronics, fashion, jewellery and more.
          </p>
          <div className="max-w-md mx-auto relative">
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search products…"
              className="w-full pl-4 sm:pl-5 pr-12 py-3 sm:py-3.5 rounded-xl text-gray-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <svg
              className="absolute right-4 top-3 sm:top-3.5 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border whitespace-nowrap ${
                  category === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600'
                }`}
              >
                {capitalize(cat)}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={handleSort}
            className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white flex-shrink-0"
          >
            <option value="default">Sort: Default</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {!loading && (
          <p className="text-xs sm:text-sm text-gray-400 mb-4">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        )}

        {loading ? (
          <Loader text="Loading products…" />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 sm:py-24 px-4">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500 text-base sm:text-lg">No products found for "{search}"</p>
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="mt-4 text-indigo-600 hover:underline text-sm"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
