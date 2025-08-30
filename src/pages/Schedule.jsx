import { useEffect, useMemo, useRef, useState } from 'react'
import TopicsInput from '../components/TopicsInput.jsx'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function api(path, options = {}) {
  const token = localStorage.getItem('token')
  console.log('[API] request', path, options.method || 'GET')
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  })
  console.log('[API] response', path, res.status)
  if (res.status === 401) {
    console.log('[API] 401, clearing token and redirecting to /')
    localStorage.removeItem('token')
    // Broadcast so app can navigate without hard reload
    window.dispatchEvent(new Event('app:unauthenticated'))
    return
  }
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || 'Request failed')
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export default function Schedule() {
  function extractError(e, fallback) {
    const raw = e && typeof e.message === 'string' ? e.message : ''
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed.error === 'string') return parsed.error
    } catch (_) {}
    return fallback
  }
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [savedMsg, setSavedMsg] = useState('')
  const [scheduleId, setScheduleId] = useState(null)
  const [topics, setTopics] = useState([])
  const [cadence, setCadence] = useState('daily')
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')

  const cadenceOptions = useMemo(() => [
    { value: 'daily', label: 'Every day' },
    { value: 'every_3_days', label: 'Every 3 days' },
    { value: 'weekly', label: 'Every week' },
    { value: 'every_2_weeks', label: 'Every 2 weeks' }
  ], [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        console.log('[Schedule] fetching schedules')
        const data = await api('/api/schedules')
        const first = data?.items?.[0]
        console.log('[Schedule] schedules response', data)
        if (first && mounted) {
          console.log('[Schedule] setting schedule id', first.id)
          console.log('[Schedule] setting topics', Array.isArray(first.topics) ? first.topics : [])
          console.log('[Schedule] setting cadence', first.cadence || 'daily')
          console.log('[Schedule] setting timezone', first.timezone || timezone)
          setScheduleId(first.id)
          setTopics(Array.isArray(first.topics) ? first.topics : [])
          setCadence(first.cadence || 'daily')
          setTimezone(first.timezone || timezone)
        }
      } catch (e) {
        console.log('[Schedule] fetch error', e)
        setError(extractError(e, 'Failed to load schedule'))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSavedMsg('')
    try {
      const payload = { topics, cadence, timezone }
      console.log('[Schedule] submit payload', payload)
      if (scheduleId) {
        await api(`/api/schedules/${scheduleId}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        const created = await api('/api/schedules', { method: 'POST', body: JSON.stringify(payload) })
        setScheduleId(created.id)
      }
      setSavedMsg('Saved successfully')
    } catch (e) {
      console.log('[Schedule] submit error', e)
      setError(extractError(e, 'Failed to save'))
    } finally {
      setSaving(false)
    }
  }

  const onRunNow = async () => {
    if (!scheduleId) {
      alert('Please save a schedule first')
      return
    }
    setRunning(true)
    setError('')
    try {
      console.log('[Schedule] run now for id', scheduleId)
      await api(`/api/schedules/${scheduleId}/run`, { method: 'POST' })
      // refresh credits badge
      window.dispatchEvent(new Event('credits:refresh'))
      alert('Triggered. It should run shortly.')
    } catch (e) {
      console.log('[Schedule] run now error', e)
      setError(extractError(e, 'Failed to run'))
    } finally {
      setRunning(false)
    }
  }

  const [buying, setBuying] = useState(false)
  const [amount, setAmount] = useState(50)
  const onBuyCredits = async () => {
    try {
      setBuying(true)
      const order = await api('/api/credits/order', { method: 'POST', body: JSON.stringify({ amount }) })
      if (!order?.orderId || !order?.keyId) throw new Error('Failed to create order')

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Credits Purchase',
        description: `Buy credits (₹10 per credit)`,
        order_id: order.orderId,
        handler: async function (response) {
          try {
            await api('/api/credits/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })
            window.dispatchEvent(new Event('credits:refresh'))
            alert('Payment successful! Credits will reflect shortly.')
          } catch (e) {
            alert('Verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: function () {
            setBuying(false)
          }
        },
        prefill: {
          name: '',
          email: ''
        },
        theme: { color: '#536DFE' }
      }
      // @ts-ignore
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      console.log('[Schedule] buy credits error', e)
      alert(extractError(e, 'Failed to start payment'))
    } finally {
      setBuying(false)
    }
  }

  if (loading) return <div className="container" style={{ padding: 16 }}>Loading…</div>

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="card">
        <h2 style={{ marginBottom: 12 }}>Posting Schedule</h2>
        {error && <div className="alert alert--error" style={{ marginBottom: 12 }}>{error}</div>}
        {savedMsg && <div className="alert alert--success" style={{ marginBottom: 12 }}>{savedMsg}</div>}
        <form className="form" onSubmit={onSubmit}>
          <div className="form__group">
            <label htmlFor="cadence">Schedule time</label>
            <select id="cadence" className="select" value={cadence} onChange={(e) => setCadence(e.target.value)}>
              {cadenceOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="form__group">
            <label htmlFor="timezone">Timezone</label>
            <input id="timezone" className="input" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="e.g., America/Los_Angeles" />
          </div>
          <div className="form__group">
            <label>Add Topics (up to 5)</label>
            <TopicsInput value={topics} onChange={setTopics} max={5} stacked />
          </div>
          <div className="form__actions">
            <button className="btn btn--primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button className="btn btn--secondary" type="button" onClick={onRunNow} disabled={running}>{running ? 'Running…(Wait a moment)' : 'Run Now'}</button>
          </div>
        </form>
        
      </div>
      {/* Buy credits section */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Buy Credits</h3>
        <p className="muted" style={{ marginBottom: 8 }}>₹10 per credit. Minimum purchase ₹50.</p>
        <div className="form__group" style={{ maxWidth: 220 }}>
          <label htmlFor="amount">Amount (₹)</label>
          <input id="amount" className="input" type="number" min="50" step="10" value={amount}
                 onChange={(e) => setAmount(Math.max(50, Math.round(Number(e.target.value) || 50)))} />
        </div>
        <div className="form__actions">
          <button className="btn btn--primary" type="button" onClick={onBuyCredits} disabled={buying}>
            {buying ? 'Redirecting…' : 'Buy Credits'}
          </button>
        </div>
      </div>
    </div>
  )
}
