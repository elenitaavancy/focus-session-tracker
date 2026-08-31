import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function StreakTracker({ refreshKey }) {
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateStreaks()
  }, [refreshKey])

  const calculateStreaks = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase.from('sessions').select('created_at').eq('user_id', user.id).order('created_at', { ascending: false })
      if (error) throw error

      if (!data || data.length === 0) {
        setCurrentStreak(0)
        setLongestStreak(0)
        return
      }

      const dates = data.map(s => new Date(s.created_at).toDateString()).filter((v, i, a) => a.indexOf(v) === i)
      let current = 0, longest = 0, tempStreak = 1

      for (let i = 0; i < dates.length - 1; i++) {
        const date1 = new Date(dates[i])
        const date2 = new Date(dates[i + 1])
        const diffDays = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          tempStreak++
        } else {
          longest = Math.max(longest, tempStreak)
          tempStreak = 1
        }
      }
      longest = Math.max(longest, tempStreak)
      current = tempStreak
      
      setCurrentStreak(current)
      setLongestStreak(longest)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{color: '#888'}}>Loading streaks...</div>

  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '30px'}}>
      <div style={{backgroundColor: '#1a1f2e', borderRadius: '12px', padding: '24px', border: '1px solid #333', textAlign: 'center'}}>
        <p style={{fontSize: '12px', color: '#888', marginBottom: '12px', textTransform: 'uppercase'}}>Current Streak</p>
        <p style={{fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px'}}>{currentStreak}</p>
        <p style={{color: '#888', fontSize: '13px'}}>days</p>
      </div>
      <div style={{backgroundColor: '#1a1f2e', borderRadius: '12px', padding: '24px', border: '1px solid #333', textAlign: 'center'}}>
        <p style={{fontSize: '12px', color: '#888', marginBottom: '12px', textTransform: 'uppercase'}}>Longest Streak</p>
        <p style={{fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px'}}>{longestStreak}</p>
        <p style={{color: '#888', fontSize: '13px'}}>days</p>
      </div>
    </div>
  )
}
