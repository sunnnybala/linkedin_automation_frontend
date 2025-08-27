import { useState } from 'react'

export default function TopicsInput({ value = [], onChange, max = 5, stacked = false }) {
  const [input, setInput] = useState('')

  const addTopic = () => {
    const t = input.trim()
    if (!t) return
    if (value.includes(t)) return
    if (value.length >= max) return
    onChange([...value, t])
    setInput('')
  }

  const removeTopic = (t) => {
    onChange(value.filter(v => v !== t))
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTopic()
    }
  }

  return (
    <div>
      <div className={`chips${stacked ? ' chips--stacked' : ''}`}>
        {value.map(t => (
          <span key={t} className="chip">
            {t}
            <button
              type="button"
              className="chip__remove"
              onClick={() => removeTopic(t)}
              aria-label={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="e.g., AI Engineering, Product Management, ML Research, etc."
          style={{ flex: 1 }}
        />
        <button type="button" className="btn btn--secondary" onClick={addTopic}>Add</button>
      </div>
    </div>
  )
}
