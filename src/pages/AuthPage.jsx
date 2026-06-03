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
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', fullName: '', currency: 'USD' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth
  )
}