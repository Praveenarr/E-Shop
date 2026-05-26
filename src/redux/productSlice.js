import { createSlice, createSelector } from '@reduxjs/toolkit'

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    selected: null,
    categories: [],
    loading: false,
    detailLoading: false,
    error: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'default',
  },
  reducers: {
    // ── Product list ──────────────────────────────────────────────────────────
    setProductsLoading(state) {
      state.loading = true
      state.status = 'loading'
      state.error = null
    },
    setProducts(state, action) {
      state.loading = false
      state.status = 'succeeded'
      state.list = action.payload
    },
    setProductsError(state, action) {
      state.loading = false
      state.status = 'failed'
      state.error = action.payload
    },
    setCategories(state, action) {
      state.categories = action.payload
    },

    // ── Single product ────────────────────────────────────────────────────────
    setDetailLoading(state) {
      state.detailLoading = true
      state.error = null
    },
    setSelectedProduct(state, action) {
      state.detailLoading = false
      state.selected = action.payload
    },
    setDetailError(state, action) {
      state.detailLoading = false
      state.error = action.payload
    },
    clearSelected(state) {
      state.selected = null
    },

    // ── Admin CRUD ────────────────────────────────────────────────────────────
    addProductToList(state, action) {
      state.list.unshift(action.payload)
    },
    updateProductInList(state, action) {
      const idx = state.list.findIndex((p) => p.id === action.payload.id)
      if (idx !== -1) state.list[idx] = action.payload
      if (state.selected?.id === action.payload.id) state.selected = action.payload
    },
    removeProductFromList(state, action) {
      state.list = state.list.filter((p) => p.id !== action.payload)
    },

    // ── UI filters ────────────────────────────────────────────────────────────
    setSelectedCategory(state, action) { state.selectedCategory = action.payload },
    setSearchQuery(state, action) { state.searchQuery = action.payload },
    setSortBy(state, action) { state.sortBy = action.payload },
  },
})

export const {
  setProductsLoading,
  setProducts,
  setProductsError,
  setCategories,
  setDetailLoading,
  setSelectedProduct,
  setDetailError,
  clearSelected,
  addProductToList,
  updateProductInList,
  removeProductFromList,
  setSelectedCategory,
  setSearchQuery,
  setSortBy,
} = productSlice.actions

export const selectProducts = (state) => state.products.list
export const selectSelectedProduct = (state) => state.products.selected
export const selectCategories = (state) => state.products.categories
export const selectProductLoading = (state) => state.products.loading
export const selectDetailLoading = (state) => state.products.detailLoading
export const selectProductsStatus = (state) => state.products.status

export const selectProductFilters = createSelector(
  (state) => state.products.selectedCategory,
  (state) => state.products.searchQuery,
  (state) => state.products.sortBy,
  (category, search, sort) => ({ category, search, sort })
)

export default productSlice.reducer
