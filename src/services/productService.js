import api from './api'

export const fetchProducts = async ({ category } = {}) => {
  const url = category && category !== 'all'
    ? `/products/category/${encodeURIComponent(category)}`
    : '/products'
  const { data } = await api.get(url)
  return data
}

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}

export const fetchCategories = async () => {
  const { data } = await api.get('/products/categories')
  return data
}

export const createProduct = async (productData) => {
  await api.post('/products', productData)
  // FakeStore always returns id=21 — ignore it and use a timestamp-based unique id
  return { ...productData, id: Date.now() }
}

export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData)
  return { ...productData, id, ...data }
}

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`)
}
