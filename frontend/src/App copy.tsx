import React, { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function App(): JSX.Element {
  const [message, setMessage] = useState<string>('')
  const [key, setKey] = useState<string>('3')
  const [method, setMethod] = useState<string>('caesar')
  const [output, setOutput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  async function callApi(path: string, useOutputIfEmpty = false) {
    setLoading(true)
    setOutput('')
    try {
      const msg = (useOutputIfEmpty && (!message || message.trim() === '')) ? output : message
      const body = { message: msg, key: Number(key), method }
      console.debug('Calling API', API_BASE + path, body)
      const res = await fetch(API_BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const text = await res.text()
      let data: any = null
      try { data = text ? JSON.parse(text) : null } catch (e) { data = null }

      if (!res.ok) {
        const detail = data && (data.detail || data.error) ? (data.detail || data.error) : text
        setOutput(`Error ${res.status}: ${detail}`)
      } else {
        setOutput(data && data.result ? data.result : text)
      }
    } catch (err) {
      setOutput('Request failed: ' + String(err))
      console.error('API call error', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{fontFamily: 'Inter, Arial, sans-serif'}}>
      <div className="io-grid">
        <div className="io-panel">
          <label style={{fontWeight:700}}>Input Email Message</label>
          <textarea className="io-text" value={message} onChange={e => setMessage(e.target.value)} />
        </div>

        <div className="io-panel">
          <label style={{fontWeight:700}}>Output</label>
          <textarea className="io-text" readOnly value={output} />
        </div>
      </div>

      <div style={{marginTop:16, display: 'flex', gap: 12, alignItems: 'center'}}>
        <div>
          <label style={{display:'block'}}>Key (integer for Caesar)</label>
          <input value={key} onChange={e => setKey(e.target.value)} />
        </div>

        <div>
          <label style={{display:'block'}}>Method</label>
          <select value={method} onChange={e => setMethod(e.target.value)}>
            <option value="caesar">Caesar</option>
          </select>
        </div>

        <div style={{marginLeft:'auto'}}>
          <button onClick={() => callApi('/encrypt')} disabled={loading} style={{marginRight:8}}>Encrypt</button>
          <button onClick={() => callApi('/decrypt', true)} disabled={loading}>Decrypt</button>
        </div>

        <div style={{marginLeft:8}}>
          <button onClick={() => setMessage(output)} className="secondary" disabled={!output}>Use Output as Input</button>
        </div>
      </div>

      <div style={{marginTop:12, color:'#64748b'}}>
        <small>Backend: <code>{API_BASE}</code>. Adjust `VITE_API_BASE` env var for different host.</small>
      </div>
    </div>
  )
}
