import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import Schedule from './pages/Schedule.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Header from './components/Header.jsx'
import React from 'react'
import { Analytics } from '@vercel/analytics/react';
function AppInner() {
  const navigate = useNavigate()
  // Listen for global unauthenticated events and navigate SPA-side
  // Avoids hard reload loops on mobile
  React.useEffect(() => {
    const onUnauth = () => navigate('/', { replace: true })
    window.addEventListener('app:unauthenticated', onUnauth)
    return () => window.removeEventListener('app:unauthenticated', onUnauth)
  }, [navigate])

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <div>
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
    <Analytics />
    </div>
  )
}

export default App
