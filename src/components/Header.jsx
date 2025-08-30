import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function api(path) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (res.status === 401) {
    localStorage.removeItem('token')
    setBalance(null)
    // Inform app to handle unauthenticated state without hard reloads
    window.dispatchEvent(new Event('app:unauthenticated'))
    return null
  }
  if (!res.ok) return null
  return res.json()
}

export default function Header() {
  const [balance, setBalance] = useState(null)
  const token = localStorage.getItem('token')

  async function refresh() {
    try {
      const data = await api('/api/credits/balance')
      if (data && typeof data.balance === 'number') setBalance(data.balance)
    } catch (_) {}
  }

  useEffect(() => {
    // Only attempt to refresh credits if authenticated
    if (!localStorage.getItem('token')) return
    refresh()
    const onFocus = () => refresh()
    const onCustom = () => refresh()
    window.addEventListener('focus', onFocus)
    window.addEventListener('credits:refresh', onCustom)
    const id = setInterval(refresh, 30000)
    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('credits:refresh', onCustom)
      clearInterval(id)
    }
  }, [])

  // Hide credits header entirely when not authenticated
  if (!token) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 16px' }}>
      <div className="badge" style={{ background: '#eef2ff', color: '#1f2a5a', padding: '6px 10px', borderRadius: 8, fontWeight: 600 }}>
        Credits: {balance ?? '—'}
      </div>
    </div>
  )
}


