import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({
  // In production behind nginx: same origin, so relative '/api'
  baseURL: '/api',
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
