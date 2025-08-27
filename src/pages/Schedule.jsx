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
    window.location.href = '/'
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
        setError(e.message)
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
      setError(e.message)
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
      alert('Triggered. It should run shortly.')
    } catch (e) {
      console.log('[Schedule] run now error', e)
      setError(e.message)
    } finally {
      setRunning(false)
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
            <button className="btn btn--secondary" type="button" onClick={onRunNow} disabled={running}>{running ? 'Running…' : 'Run Now'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
