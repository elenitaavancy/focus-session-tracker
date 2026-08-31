import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import SessionLogger from './SessionLogger'
import ViewSessions from './ViewSessions'
import StreakTracker from './StreakTracker'
import StatsDashboard from './StatsDashboard'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) return <div style={{minHeight: '100vh', backgroundColor: '#0f1419', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>Loading...</div>

  if (!session) return <Auth />

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#0f1419', color: '#fff', padding: '40px 20px', fontFamily: 'system-ui'}}>
      <div style={{maxWidth: '900px', margin: '0 auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #333', paddingBottom: '20px'}}>
          <div>
            <h1 style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '8px'}}>Focus Session Tracker</h1>
            <p style={{color: '#888', fontSize: '14px'}}>{session.user.email}</p>
          </div>
          <button onClick={() => supabase.auth.signOut()} style={{padding: '10px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500'}}>Sign Out</button>
        </div>
        <StreakTracker refreshKey={refreshKey} />
        <StatsDashboard refreshKey={refreshKey} />
        <SessionLogger onSessionLogged={() => setRefreshKey(prev => prev + 1)} />
        <ViewSessions refreshKey={refreshKey} />
      </div>
    </div>
  )
}

export default App