import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Check your email to confirm signup!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://focus-session-tracker-eight.vercel.app' })
      if (error) throw error
      setMessage('Password reset link sent to your email!')
      setEmail('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (isReset) {
    return (
      <div style={{minHeight: '100vh', backgroundColor: '#0f1419', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui'}}>
        <div style={{width: '100%', maxWidth: '400px', backgroundColor: '#1a1f2e', borderRadius: '12px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', border: '1px solid #333'}}>
          <h2 style={{fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '30px', textAlign: 'center'}}>Reset Password</h2>
          <form onSubmit={handlePasswordReset} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{padding: '12px', backgroundColor: '#0f1419', color: '#fff', border: '1px solid #333', borderRadius: '6px', fontSize: '14px'}} />
            <button type="submit" disabled={loading} style={{padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px'}}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
          </form>
          {error && <p style={{color: '#ef4444', fontSize: '13px', marginTop: '12px', textAlign: 'center'}}>{error}</p>}
          {message && <p style={{color: '#10b981', fontSize: '13px', marginTop: '12px', textAlign: 'center'}}>{message}</p>}
          <button onClick={() => setIsReset(false)} style={{marginTop: '20px', width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#888', border: '1px solid #333', borderRadius: '6px', fontSize: '13px', cursor: 'pointer'}}>Back to Sign In</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#0f1419', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui'}}>
      <div style={{width: '100%', maxWidth: '400px', backgroundColor: '#1a1f2e', borderRadius: '12px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', border: '1px solid #333'}}>
        <h2 style={{fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '30px', textAlign: 'center'}}>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
        <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{padding: '12px', backgroundColor: '#0f1419', color: '#fff', border: '1px solid #333', borderRadius: '6px', fontSize: '14px'}} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{padding: '12px', backgroundColor: '#0f1419', color: '#fff', border: '1px solid #333', borderRadius: '6px', fontSize: '14px'}} />
          <button type="submit" disabled={loading} style={{padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px'}}>{loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}</button>
        </form>
        {error && <p style={{color: '#ef4444', fontSize: '13px', marginTop: '12px', textAlign: 'center'}}>{error}</p>}
        <button onClick={() => setIsReset(true)} style={{marginTop: '12px', width: '100%', padding: '8px', backgroundColor: 'transparent', color: '#3b82f6', border: 'none', fontSize: '12px', cursor: 'pointer'}}>Forgot password?</button>
        <button onClick={() => setIsSignUp(!isSignUp)} style={{marginTop: '20px', width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#888', border: '1px solid #333', borderRadius: '6px', fontSize: '13px', cursor: 'pointer'}}>{isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</button>
      </div>
    </div>
  )
}