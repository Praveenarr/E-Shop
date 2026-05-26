// Mock auth — FakeStore API has a /auth/login endpoint but no real signup.
// We simulate JWT: login uses the API, signup is local mock.

import api from './api'

// Simple base64 mock JWT generator
const mockJwt = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 }))
  return `${header}.${body}.mock_signature`
}

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin123'

export const loginUser = async ({ email, password }) => {
  // Hardcoded admin — checked before any API call
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = mockJwt({ email, username: 'admin', role: 'admin' })
    return { token, user: { email, name: 'Admin', role: 'admin' } }
  }

  // FakeStore API login endpoint
  try {
    const { data } = await api.post('/auth/login', { username: email, password })
    const token = data.token || mockJwt({ email, username: email, role: 'user' })
    const user = { email, name: email.split('@')[0], username: email, role: 'user' }
    return { token, user }
  } catch {
    // Fallback: check localStorage for registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password.')
    const token = mockJwt({ email, username: found.name, role: 'user' })
    return { token, user: { email: found.email, name: found.name, role: 'user' } }
  }
}

export const signupUser = async ({ name, email, password }) => {
  if (email === ADMIN_EMAIL) throw new Error('This email is reserved.')
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
  if (users.find(u => u.email === email)) {
    throw new Error('An account with this email already exists.')
  }
  const newUser = { name, email, password }
  localStorage.setItem('registeredUsers', JSON.stringify([...users, newUser]))
  const token = mockJwt({ email, username: name, role: 'user' })
  return { token, user: { email, name, role: 'user' } }
}
