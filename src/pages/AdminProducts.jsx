import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setProductsLoading,
  setProducts,
  setProductsError,
  setCategories,
  addProductToList,
  updateProductInList,
  removeProductFromList,
  selectProducts,
  selectProductLoading,
  selectProductsStatus,
} from '../redux/productSlice'
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService'
import ProductForm from '../components/ProductForm'
import { useToast } from '../context/ToastContext'
import { formatPrice, truncate, capitalize } from '../utils/formatters'
import Loader from '../components/Loader'

export default function AdminProducts() {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  const loading = useSelector(selectProductLoading)
  const status = useSelector(selectProductsStatus)
  const { show: showToast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    if (status !== 'idle' && status !== 'failed') return
    const load = async () => {
      dispatch(setProductsLoading())
      try {
        const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()])
        dispatch(setProducts(prods))
        dispatch(setCategories(cats))
      } catch (e) {
        dispatch(setProductsError(e.message))
      }
    }
    load()
  }, [dispatch, status])

  const handleAdd = async (data) => {
    setFormLoading(true)
    try {
      const product = await createProduct({ ...data, price: parseFloat(data.price) })
      dispatch(addProductToList(product))
      setShowForm(false)
      showToast('Product added successfully!')
    } catch (e) {
      showToast(e.message, 'error')
    }
    setFormLoading(false)
  }

  const handleEdit = async (data) => {
    setFormLoading(true)
    try {
      const updated = await updateProduct(editTarget.id, { ...data, price: parseFloat(data.price) })
      dispatch(updateProductInList(updated))
      setEditTarget(null)
      showToast('Product updated successfully!')
    } catch (e) {
      showToast(e.message, 'error')
    }
    setFormLoading(false)
  }

  const handleDelete = async (id) => {
    setDeleteId(id)
    try {
      await deleteProduct(id)
      dispatch(removeProductFromList(id))
      showToast('Product deleted.', 'info')
    } catch (e) {
      showToast(e.message, 'error')
    }
    setDeleteId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{products.length} products total</p>
          </div>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true) }}
            className="self-start sm:self-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Add Product
          </button>
        </div>

        {(showForm || editTarget) && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5">
                {editTarget ? 'Edit Product' : 'Add New Product'}
              </h2>
              <ProductForm
                initial={editTarget}
                onSubmit={editTarget ? handleEdit : handleAdd}
                onCancel={() => { setShowForm(false); setEditTarget(null) }}
                loading={formLoading}
              />
            </div>
          </div>
        )}

        {loading ? (
          <Loader text="Loading products…" />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 sm:px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Product
                    </th>
                    <th className="text-left px-4 sm:px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                      Category
                    </th>
                    <th className="text-right px-4 sm:px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Price
                    </th>
                    <th className="text-right px-4 sm:px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-5 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <img
                            src={product.image}
                            alt=""
                            className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg bg-gray-100 p-1 flex-shrink-0"
                          />
                          <span className="font-medium text-gray-800 text-xs sm:text-sm">
                            {truncate(product.title, 45)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3 sm:py-4 hidden sm:table-cell">
                        <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-full">
                          {capitalize(product.category)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3 sm:py-4 text-right font-semibold text-gray-800 text-xs sm:text-sm whitespace-nowrap">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 sm:px-5 py-3 sm:py-4 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => { setEditTarget(product); setShowForm(false) }}
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleteId === product.id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            {deleteId === product.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
