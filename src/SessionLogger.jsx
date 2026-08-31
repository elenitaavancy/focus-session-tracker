import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function SessionLogger({ onSessionLogged }) {
  const [workTopic, setWorkTopic] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [energyLevel, setEnergyLevel] = useState(5)
  const [blocks, setBlocks] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('sessions').insert([{ user_id: user.id, work_topic: workTopic, duration_minutes: parseInt(durationMinutes), energy_level: parseInt(energyLevel), blocks: blocks || null }])
      if (error) throw error
      setWorkTopic('')
      setDurationMinutes('')
      setEnergyLevel(5)
      setBlocks('')
      onSessionLogged()
      alert('Session logged!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{backgroundColor: '#1a1f2e', borderRadius: '12px', padding: '30px', marginBottom: '30px', border: '1px solid #333'}}>
      <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#fff'}}>Log a Session</h3>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <input type="text" placeholder="What did you work on?" value={workTopic} onChange={(e) => setWorkTopic(e.target.value)} required style={{padding: '12px', backgroundColor: '#0f1419', color: '#fff', border: '1px solid #333', borderRadius: '6px', fontSize: '14px'}} />
        <input type="number" placeholder="Duration (minutes)" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} required style={{padding: '12px', backgroundColor: '#0f1419', color: '#fff', border: '1px solid #333', borderRadius: '6px', fontSize: '14px'}} />
        <div>
          <label style={{display: 'block', marginBottom: '8px', color: '#888', fontSize: '13px'}}>Energy Level: {energyLevel}/10</label>
          <input type="range" min="1" max="10" value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value)} style={{width: '100%', cursor: 'pointer'}} />
        </div>
        <textarea placeholder="What blocks did you hit? (optional)" value={blocks} onChange={(e) => setBlocks(e.target.value)} style={{padding: '12px', backgroundColor: '#0f1419', color: '#fff', border: '1px solid #333', borderRadius: '6px', fontSize: '14px', minHeight: '80px', fontFamily: 'inherit', resize: 'vertical'}} />
        <button type="submit" disabled={loading} style={{padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px'}}>{loading ? 'Logging...' : 'Log Session'}</button>
      </form>
      {error && <p style={{color: '#ef4444', fontSize: '13px', marginTop: '12px'}}>{error}</p>}
    </div>
  )
}