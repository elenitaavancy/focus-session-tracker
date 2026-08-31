import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function StatsDashboard({ refreshKey }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateStats()
  }, [refreshKey])

  const calculateStats = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase.from('sessions').select('*').eq('user_id', user.id)
      if (error) throw error

      if (!data || data.length === 0) {
        setStats({ totalHours: 0, averageDuration: 0, averageEnergy: 0, blockCounts: {}, totalSessions: 0 })
        return
      }

      const totalMinutes = data.reduce((sum, s) => sum + s.duration_minutes, 0)
      const totalHours = (totalMinutes / 60).toFixed(1)
      const averageDuration = Math.round(totalMinutes / data.length)
      const averageEnergy = (data.reduce((sum, s) => sum + s.energy_level, 0) / data.length).toFixed(1)

      const blockCounts = {}
      data.forEach(session => {
        if (session.blocks) {
          const blocks = session.blocks.split(',').map(b => b.trim())
          blocks.forEach(block => {
            blockCounts[block] = (blockCounts[block] || 0) + 1
          })
        }
      })

      setStats({ totalHours, averageDuration, averageEnergy, blockCounts, totalSessions: data.length })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{color: '#888'}}>Loading stats...</div>
  if (!stats) return <p style={{color: '#888'}}>No data yet.</p>

  return (
    <div style={{backgroundColor: '#1a1f2e', borderRadius: '12px', padding: '30px', marginBottom: '30px', border: '1px solid #333'}}>
      <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#fff'}}>Your Stats</h3>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px'}}>
        <div style={{backgroundColor: '#0f1419', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid #333'}}>
          <p style={{fontSize: '11px', color: '#888', marginBottom: '8px'}}>Total Hours</p>
          <p style={{fontSize: '28px', fontWeight: 'bold', color: '#3b82f6'}}>{stats.totalHours}</p>
        </div>
        <div style={{backgroundColor: '#0f1419', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid #333'}}>
          <p style={{fontSize: '11px', color: '#888', marginBottom: '8px'}}>Avg Session</p>
          <p style={{fontSize: '28px', fontWeight: 'bold', color: '#10b981'}}>{stats.averageDuration}m</p>
        </div>
        <div style={{backgroundColor: '#0f1419', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid #333'}}>
          <p style={{fontSize: '11px', color: '#888', marginBottom: '8px'}}>Avg Energy</p>
          <p style={{fontSize: '28px', fontWeight: 'bold', color: '#f59e0b'}}>{stats.averageEnergy}/10</p>
        </div>
        <div style={{backgroundColor: '#0f1419', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid #333'}}>
          <p style={{fontSize: '11px', color: '#888', marginBottom: '8px'}}>Sessions</p>
          <p style={{fontSize: '28px', fontWeight: 'bold', color: '#a855f7'}}>{stats.totalSessions}</p>
        </div>
      </div>
      {Object.keys(stats.blockCounts).length > 0 && (
        <div style={{backgroundColor: '#0f1419', borderRadius: '8px', padding: '20px', border: '1px solid #333'}}>
          <h4 style={{fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#fff'}}>Block Patterns</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {Object.entries(stats.blockCounts).sort(([, a], [, b]) => b - a).map(([block, count]) => (
              <div key={block}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
                  <p style={{fontSize: '13px', color: '#fff'}}>{block}</p>
                  <p style={{fontSize: '12px', color: '#888'}}>{count} times</p>
                </div>
                <div style={{width: '100%', height: '6px', backgroundColor: '#333', borderRadius: '3px', overflow: 'hidden'}}>
                  <div style={{width: `${(count / Math.max(...Object.values(stats.blockCounts))) * 100}%`, height: '100%', backgroundColor: '#f97316'}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}