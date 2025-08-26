import { useState } from 'react'

export default function TopicsInput({ value = [], onChange, max = 5 }) {
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
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {value.map(t => (
          <span key={t} style={{ border: '1px solid #ccc', borderRadius: 16, padding: '4px 8px' }}>
            {t}
            <button type="button" style={{ marginLeft: 6 }} onClick={() => removeTopic(t)} aria-label={`Remove ${t}`}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add a topic and press Enter (max 5)"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="button" onClick={addTopic}>Add</button>
      </div>
    </div>
  )
}
