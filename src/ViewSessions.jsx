import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function ViewSessions({ refreshKey }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editBlocks, setEditBlocks] = useState('')

  useEffect(() => {
    fetchSessions()
  }, [refreshKey])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase.from('sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      if (error) throw error
      setSessions(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async (id) => {
    if (!confirm('Delete this session?')) return
    try {
      const { error } = await supabase.from('sessions').delete().eq('id', id)
      if (error) throw error
      setSessions(sessions.filter(s => s.id !== id))
    } catch (err) {
      alert('Error deleting session: ' + err.message)
    }
  }

  const updateSession = async (id) => {
    try {
      const { error } = await supabase.from('sessions').update({ blocks: editBlocks }).eq('id', id)
      if (error) throw error
      setSessions(sessions.map(s => s.id === id ? { ...s, blocks: editBlocks } : s))
      setEditingId(null)
      setEditBlocks('')
    } catch (err) {
      alert('Error updating session: ' + err.message)
    }
  }

  if (loading) return <div style={{color: '#888'}}>Loading sessions...</div>
  if (sessions.length === 0) return <p style={{color: '#888'}}>No sessions logged yet.</p>

  return (
    <div>
      <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#fff'}}>Your Sessions</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
        {sessions.map((session) => (
          <div key={session.id} style={{backgroundColor: '#1a1f2e', borderRadius: '10px', padding: '18px', border: '1px solid #333'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
              <p style={{fontSize: '16px', fontWeight: '600', color: '#fff'}}>{session.work_topic}</p>
              <div style={{display: 'flex', gap: '8px'}}>
                <button onClick={() => { setEditingId(session.id); setEditBlocks(session.blocks || ''); }} style={{padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>Edit</button>
                <button onClick={() => deleteSession(session.id)} style={{padding: '6px 12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>Delete</button>
              </div>
            </div>

            {editingId === session.id ? (
              <div style={{marginBottom: '12px', padding: '12px', backgroundColor: '#0f1419', borderRadius: '6px', border: '1px solid #333'}}>
                <textarea value={editBlocks} onChange={(e) => setEditBlocks(e.target.value)} style={{width: '100%', padding: '8px', backgroundColor: '#1a1f2e', color: '#fff', border: '1px solid #333', borderRadius: '4px', marginBottom: '8px', minHeight: '60px', fontFamily: 'inherit'}} />
                <div style={{display: 'flex', gap: '8px'}}>
                  <button onClick={() => updateSession(session.id)} style={{padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{padding: '8px 16px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '13px', color: '#aaa'}}>
                  <span>Duration: {session.duration_minutes} min</span>
                  <span>Energy: {session.energy_level}/10</span>
                </div>
                {session.blocks && <p style={{fontSize: '13px', color: '#888', marginBottom: '8px'}}>Blocks: {session.blocks}</p>}
                <p style={{fontSize: '12px', color: '#666'}}>{new Date(session.created_at).toLocaleString()}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}