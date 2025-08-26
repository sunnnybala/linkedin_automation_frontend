import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()
  const processedRef = useRef(false)

  useEffect(() => {
    if (processedRef.current) return
    processedRef.current = true

    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const error = params.get('error')
    console.log('[AuthCallback] received token?', token)
    if (token) {
      localStorage.setItem('token', token)
      console.log('[AuthCallback] token stored, redirecting to /schedule')
      navigate('/schedule', { replace: true })
    } else if (error) {
      console.warn('[AuthCallback] error in callback:', error, 'redirecting to /')
      navigate('/', { replace: true })
    } else {
      console.log('[AuthCallback] no token and no error; ignoring duplicate effect')
    }
  }, [navigate])

  return null
}
