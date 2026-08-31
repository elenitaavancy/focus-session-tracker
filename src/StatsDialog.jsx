import { useState } from 'react'
import StatsDialog from './StatsDialog'

export default function StatsButton({ refreshKey }) {
  const [showStats, setShowStats] = useState(false)

  return (
    <>
      <button onClick={() => setShowStats(true)} style={{ marginBottom: '20px', padding: '10px' }}>
        View Stats
      </button>
      {showStats && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <StatsDialog refreshKey={refreshKey} />
            <button onClick={() => setShowStats(false)} style={{ marginTop: '20px', width: '100%', padding: '10px' }}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}
