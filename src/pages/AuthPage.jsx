import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import logo from '../images/LEDGER-removebg-preview.png'

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
  { code: 'MKD', symbol: 'ден', label: 'Macedonian Denar (ден)' },
  { code: 'CHF', symbol: 'CHF', label: 'Swiss Franc (CHF)' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (C$)' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (A$)' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen (¥)' },
]

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0A0A0C',
    display: 'flex',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    overflowX: 'hidden',
    position: 'relative',
  },
  bg: {
    position: 'fixed', inset: 0, pointerEvents: 'none',
    background: `
      radial-gradient(ellipse at 15% 50%, rgba(232,168,124,0.07) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 20%, rgba(133,193,233,0.05) 0%, transparent 50%),
      radial-gradient(ellipse at 60% 80%, rgba(187,143,206,0.04) 0%, transparent 45%)
    `,
  },
  grid: {
    position: 'fixed', inset: 0, pointerEvents: 'none',
    backgroundImage: `linear-gradient(rgba(232,224,213,0.025) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(232,224,213,0.025) 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
  },
}

export default function AuthPage() {
  const [mode, setMode] = useState('login') 
  const [form, setForm] = useState({ email: '', password: '', fullName: '', currency: 'USD' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth
  )

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isPhone = viewportWidth < 640
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024
  const isCompact = viewportWidth < 1024

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        const selectedCurrency = CURRENCIES.find(c => c.code === form.currency) || CURRENCIES[0]
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.fullName,
              currency: selectedCurrency.code,
              currency_symbol: selectedCurrency.symbol,
            }
          }
        })
        if (error) throw error
        setSuccess('Account created! Check your email to confirm, then log in.')
        setMode('login')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error
        
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }
   const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(232,224,213,0.12)',
    borderRadius: 10,
    padding: isPhone ? '12px 14px' : '14px 16px',
    color: '#E8E0D5',
    fontSize: isPhone ? 14 : 15,
    fontFamily: "'DM Mono', monospace",
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 10,
    letterSpacing: isPhone ? 2 : 3,
    color: '#7A7570',
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: "'DM Mono', monospace",
  }

  const leftPanelStyle = {
    flex: isCompact ? '0 0 auto' : '0 0 48%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: isPhone ? '36px 22px 20px' : isTablet ? '46px 36px 26px' : '60px 64px',
    position: 'relative',
    borderRight: isCompact ? 'none' : '1px solid rgba(232,224,213,0.06)',
    borderBottom: isCompact ? '1px solid rgba(232,224,213,0.08)' : 'none',
  }

  const rightPanelStyle = {
    flex: 1,
    display: 'flex',
    alignItems: isCompact ? 'flex-start' : 'center',
    justifyContent: 'center',
    padding: isPhone ? '24px 16px 34px' : isTablet ? '34px 30px 42px' : '60px 48px',
    position: 'relative',
  }
    return (
    <div style={{ ...styles.page, flexDirection: isCompact ? 'column' : 'row', overflowY: 'auto' }}>
      <div style={styles.bg} />
      <div style={styles.grid} />

      
      <div style={leftPanelStyle}>
        <div style={{ marginBottom: isCompact ? 20 : 'auto', paddingBottom: isCompact ? 0 : 60 }}>
          <div style={{ fontSize: 11, letterSpacing: isPhone ? 3 : 5, color: '#E8A87C', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>
            Personal Finance
          </div>
          <h1 style={{
            fontSize: isPhone ? 46 : isTablet ? 54 : 64,
            fontWeight: 300,
            color: '#F5EFE8',
            lineHeight: 1.05,
            letterSpacing: isPhone ? -1 : -2,
            marginBottom: 16,
            marginTop: 0,
          }}>
            Budget<br />
            <em style={{ color: '#E8A87C', fontStyle: 'italic' }}>Ledger</em>
          </h1>
          <p style={{
            fontSize: isPhone ? 15 : 18,
            color: '#7A7570',
            lineHeight: 1.6,
            fontWeight: 300,
            maxWidth: isPhone ? '100%' : 360,
            margin: 0,
          }}>
            Your personal finance companion. Track every expense, understand your spending, and take control of your money.
          </p>
        </div>

      
        <div style={{
          display: 'grid',
          gridTemplateColumns: isPhone ? '1fr' : isTablet ? '1fr 1fr' : '1fr',
          gap: isPhone ? 12 : 16,
          width: '100%',
        }}>
          {[
            { icon: '◈', text: 'Track expenses by month & category' },
            { icon: '◉', text: 'Visual spending breakdowns' },
            { icon: '◎', text: 'Your data, securely stored' },
            { icon: '◐', text: 'Access from any device' },
          ].map(f => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#E8A87C', fontSize: isPhone ? 13 : 14 }}>{f.icon}</span>
              <span style={{ fontSize: isPhone ? 12 : 14, color: '#5A5550', fontFamily: "'DM Mono', monospace" }}>{f.text}</span>
            </div>
          ))}
        </div>

       
        {!isCompact && (
          <div style={{
            position: 'absolute', top: 0, right: -1, width: 1, height: '100%',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(232,168,124,0.3) 40%, rgba(232,168,124,0.3) 60%, transparent 100%)',
          }} />
        )}
      </div>
    </div>
  )
}
