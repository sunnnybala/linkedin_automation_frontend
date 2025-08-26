import { Navigate } from 'react-router-dom'

function isAuthenticated() {
  const token = localStorage.getItem('token')
  return Boolean(token)
}

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }
  return children
}
