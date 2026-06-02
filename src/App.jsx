import {useState,useEffect} from 'react'
import {Routes,Route,Navigate} from 'react-router-dom'
import {supabase} from './lib/supabase'
import {AuthPage} from './pages/AuthPage'
import {BudgetPage} from './pages/BudgetPage'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
  setSession(session)
  })

  // Listen for auth changes (login, logout, token refresh)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
  setSession(session)
  })

  return () => subscription.unsubscribe()
  }, [])

  //Loading state while cheching auth
  if(session === undefined){
    return (
      <div style={{
      minHeight: '100vh', background: '#0A0A0C',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Mono', monospace",
      }}>
      <div style={{ textAlign: 'center', color: '#4A4540' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
      <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' }}>Loading</div>
      </div>
      </div>
      )
  }

  return(
    <Routes>
      <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/" replace />}/>
      <Route path="/*" element={session ? <BudgetPage session={session} /> : <Navigate to="/auth" replace />}/>
    </Routes>
  )
}
