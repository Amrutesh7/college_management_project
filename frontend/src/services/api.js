import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach auth token if needed in future
api.interceptors.request.use(
  config => config,
  error => Promise.reject(error),
)

// Response interceptor — normalize errors
api.interceptors.response.use(
  response => response.data,
  error => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  },
)

export default api
