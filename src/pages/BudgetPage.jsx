// import { useState, useEffect, useMemo, useCallback } from 'react'
// import { supabase } from '../lib/supabase'

// const CATEGORIES = [
//   { id: 'food', label: 'Food & Dining', icon: '🍽️', color: '#E8A87C' },
//   { id: 'subscriptions', label: 'Subscriptions', icon: '📱', color: '#85C1E9' },
//   { id: 'bills', label: 'Bills & Utilities', icon: '⚡', color: '#F1948A' },
//   { id: 'transport', label: 'Transport', icon: '🚗', color: '#82E0AA' },
//   { id: 'health', label: 'Health', icon: '💊', color: '#BB8FCE' },
//   { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#F9E79F' },
//   { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#F0B27A' },
//   { id: 'other', label: 'Other', icon: '📦', color: '#AEB6BF' },
// ]

// const MONTHS = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December'
// ]

// const CURRENT_YEAR = new Date().getFullYear()

// export default function BudgetPage({ session }) {
//   const [expenses, setExpenses] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [saveMsg, setSaveMsg] = useState('')
//   const [activeMonth, setActiveMonth] = useState(new Date().getMonth())
//   const [activeYear] = useState(CURRENT_YEAR)
//   const [activeCategory, setActiveCategory] = useState(null)
//   const [showForm, setShowForm] = useState(false)
//   const [selectedItem, setSelectedItem] = useState(null)
//   const [form, setForm] = useState({
//     name: '', description: '',
//     date: new Date().toISOString().split('T')[0],
//     cost: '', category: 'food'
//   })

//   const user = session.user
//   const userInitial = (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()
//   const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

//   // Fetch expenses for current year
//   const fetchExpenses = useCallback(async () => {
//     setLoading(true)
//     const { data, error } = await supabase
//       .from('expenses')
//       .select('*')
//       .eq('user_id', user.id)
//       .eq('year', activeYear)
//       .order('date', { ascending: false })

//     if (!error && data) setExpenses(data)
//     setLoading(false)
//   }, [user.id, activeYear])

//   useEffect(() => { fetchExpenses() }, [fetchExpenses])

//   async function handleAddExpense() {
//     if (!form.name || !form.cost || !form.date) return
//     setSaving(true)

//     const dateObj = new Date(form.date)
//     const month = dateObj.getMonth()
//     const year = dateObj.getFullYear()

//     const { data, error } = await supabase.from('expenses').insert([{
//       user_id: user.id,
//       name: form.name,
//       description: form.description,
//       category: form.category,
//       cost: parseFloat(form.cost),
//       date: form.date,
//       month,
//       year,
//     }]).select().single()

//     if (!error && data) {
//       setExpenses(prev => [data, ...prev])
//       setForm(f => ({ ...f, name: '', description: '', cost: '' }))
//       setShowForm(false)
//       flash('✓ Expense saved')
//     }
//     setSaving(false)
//   }

//   async function handleDelete(id) {
//     const { error } = await supabase.from('expenses').delete().eq('id', id)
//     if (!error) {
//       setExpenses(prev => prev.filter(e => e.id !== id))
//       setSelectedItem(null)
//       flash('✓ Deleted')
//     }
//   }

//   function flash(msg) {
//     setSaveMsg(msg)
//     setTimeout(() => setSaveMsg(''), 2000)
//   }

//   async function handleSignOut() {
//     await supabase.auth.signOut()
//   }

//   const monthExpenses = useMemo(() =>
//     expenses.filter(e => e.month === activeMonth && e.year === activeYear),
//     [expenses, activeMonth, activeYear]
//   )

//   const grouped = useMemo(() => {
//     const g = {}
//     monthExpenses.forEach(e => {
//       if (!g[e.category]) g[e.category] = []
//       g[e.category].push(e)
//     })
//     return g
//   }, [monthExpenses])

//   const monthTotal = useMemo(() =>
//     monthExpenses.reduce((s, e) => s + parseFloat(e.cost || 0), 0),
//     [monthExpenses]
//   )

//   const yearTotal = useMemo(() =>
//     expenses.reduce((s, e) => s + parseFloat(e.cost || 0), 0),
//     [expenses]
//   )

//   const filteredExpenses = activeCategory
//     ? monthExpenses.filter(e => e.category === activeCategory)
//     : monthExpenses

//   const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[7]

//   const monthHasTotals = (i) =>
//     expenses.filter(e => e.month === i && e.year === activeYear)
//             .reduce((s, e) => s + parseFloat(e.cost || 0), 0)

//   // Shared input style
//   const inputStyle = {
//     width: '100%', background: 'rgba(255,255,255,0.04)',
//     border: '1px solid rgba(232,224,213,0.12)', borderRadius: 8,
//     padding: '9px 12px', color: '#E8E0D5', fontSize: 14,
//     fontFamily: "'DM Mono', monospace",
//     outline: 'none', boxSizing: 'border-box', colorScheme: 'dark',
//   }

//   return (
//     <div style={{
//       minHeight: '100vh', background: '#0A0A0C',
//       fontFamily: "'Cormorant Garamond', Georgia, serif",
//       color: '#E8E0D5', position: 'relative',
//     }}>
//       {/* Ambient background */}
//       <div style={{
//         position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
//         background: `
//           radial-gradient(ellipse at 10% 30%, rgba(232,168,124,0.05) 0%, transparent 50%),
//           radial-gradient(ellipse at 90% 70%, rgba(133,193,233,0.04) 0%, transparent 50%)
//         `,
//       }} />

//       <div style={{ position: 'relative', zIndex: 1, maxWidth: 1140, margin: '0 auto', padding: '0 20px' }}>

//         {/* Header */}
//         <header style={{
//           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//           paddingTop: 28, paddingBottom: 20,
//           borderBottom: '1px solid rgba(232,224,213,0.08)',
//         }}>
//           <div>
//             <div style={{ fontSize: 10, letterSpacing: 4, color: '#E8A87C', textTransform: 'uppercase', marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>
//               Personal Finance · {activeYear}
//             </div>
//             <h1 style={{ fontSize: 30, fontWeight: 400, margin: 0, letterSpacing: -1, color: '#F5EFE8' }}>
//               Budget <em style={{ color: '#E8A87C', fontStyle: 'italic' }}>Ledger</em>
//             </h1>
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
//             {/* Save indicator */}
//             <div style={{
//               fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1,
//               color: saveMsg ? '#82E0AA' : 'transparent', transition: 'color 0.3s',
//             }}>{saveMsg}</div>

//             {/* Year total */}
//             <div style={{ textAlign: 'right' }}>
//               <div style={{ fontSize: 10, letterSpacing: 3, color: '#7A7570', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>Year Total</div>
//               <div style={{ fontSize: 24, color: '#E8A87C' }}>${yearTotal.toFixed(2)}</div>
//             </div>

//             {/* User avatar + logout */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//               <div style={{
//                 width: 36, height: 36, borderRadius: '50%',
//                 background: 'rgba(232,168,124,0.15)',
//                 border: '1px solid rgba(232,168,124,0.3)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontSize: 14, color: '#E8A87C',
//                 fontFamily: "'DM Mono', monospace",
//               }}>{userInitial}</div>
//               <div>
//                 <div style={{ fontSize: 13, color: '#E8E0D5' }}>{userName}</div>
//                 <button onClick={handleSignOut}
//                   style={{
//                     background: 'none', border: 'none', color: '#5A5550',
//                     cursor: 'pointer', fontSize: 11, padding: 0,
//                     fontFamily: "'DM Mono', monospace", letterSpacing: 1,
//                   }}>Sign out</button>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Month Tabs */}
//         <div style={{ display: 'flex', gap: 5, paddingTop: 18, paddingBottom: 2, overflowX: 'auto', scrollbarWidth: 'none' }}>
//           {MONTHS.map((m, i) => {
//             const mTotal = monthHasTotals(i)
//             const isActive = activeMonth === i
//             return (
//               <button key={i}
//                 onClick={() => { setActiveMonth(i); setActiveCategory(null); setSelectedItem(null) }}
//                 style={{
//                   flexShrink: 0, padding: '9px 15px', borderRadius: 10,
//                   border: isActive ? '1px solid rgba(232,168,124,0.4)' : '1px solid rgba(232,224,213,0.07)',
//                   background: isActive ? 'rgba(232,168,124,0.1)' : 'rgba(255,255,255,0.015)',
//                   color: isActive ? '#E8A87C' : '#5A5550',
//                   cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', minWidth: 72,
//                   fontFamily: "'DM Mono', monospace",
//                 }}>
//                 <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>{m.slice(0,3)}</div>
//                 {mTotal > 0 && <div style={{ fontSize: 11, marginTop: 3, color: isActive ? '#E8A87C' : '#4A4540' }}>${mTotal.toFixed(0)}</div>}
//               </button>
//             )
//           })}
//         </div>

//         {/* Main layout */}
//         <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 20, paddingTop: 22, paddingBottom: 48 }}>

//           {/* Sidebar */}
//           <div>
//             <div style={{ fontSize: 9, letterSpacing: 3, color: '#5A5550', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>
//               Categories
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//               <button onClick={() => setActiveCategory(null)}
//                 style={{
//                   textAlign: 'left', padding: '10px 13px', borderRadius: 10,
//                   border: !activeCategory ? '1px solid rgba(232,224,213,0.18)' : '1px solid rgba(232,224,213,0.05)',
//                   background: !activeCategory ? 'rgba(232,224,213,0.05)' : 'transparent',
//                   color: !activeCategory ? '#E8E0D5' : '#5A5550',
//                   cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                   fontFamily: "'DM Mono', monospace",
//                 }}>
//                 <span style={{ fontSize: 12 }}>✦ All Expenses</span>
//                 <span style={{ fontSize: 12, color: '#E8A87C' }}>${monthTotal.toFixed(2)}</span>
//               </button>

//               {CATEGORIES.map(cat => {
//                 const items = grouped[cat.id] || []
//                 const total = items.reduce((s, e) => s + parseFloat(e.cost || 0), 0)
//                 const isActive = activeCategory === cat.id
//                 return (
//                   <button key={cat.id}
//                     onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
//                     style={{
//                       textAlign: 'left', padding: '10px 13px', borderRadius: 10,
//                       border: isActive ? `1px solid ${cat.color}35` : '1px solid rgba(232,224,213,0.05)',
//                       background: isActive ? `${cat.color}10` : 'transparent',
//                       color: isActive ? cat.color : '#5A5550',
//                       cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                       transition: 'all 0.2s', fontFamily: "'DM Mono', monospace",
//                     }}>
//                     <span style={{ fontSize: 12 }}>{cat.icon} {cat.label}</span>
//                     {total > 0 && <span style={{ fontSize: 11 }}>${total.toFixed(0)}</span>}
//                   </button>
//                 )
//               })}
//             </div>

//             <button onClick={() => { setShowForm(true); setSelectedItem(null) }}
//               style={{
//                 width: '100%', marginTop: 14, padding: '12px',
//                 borderRadius: 10, border: '1px dashed rgba(232,168,124,0.25)',
//                 background: 'transparent', color: '#E8A87C',
//                 cursor: 'pointer', fontSize: 13, letterSpacing: 1,
//                 fontFamily: "'DM Mono', monospace", transition: 'all 0.2s',
//               }}>
//               + Add Expense
//             </button>

//             <div style={{
//               marginTop: 12, padding: '8px 12px', borderRadius: 8,
//               background: 'rgba(130,224,170,0.04)', border: '1px solid rgba(130,224,170,0.1)',
//               display: 'flex', alignItems: 'center', gap: 8,
//             }}>
//               <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#82E0AA', flexShrink: 0 }} />
//               <span style={{ fontSize: 9, letterSpacing: 2, color: '#82E0AA', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
//                 Synced to cloud
//               </span>
//             </div>
//           </div>

//           {/* Right panel */}
//           <div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
//               <div>
//                 <span style={{ fontSize: 24, color: '#F5EFE8' }}>{MONTHS[activeMonth]}</span>
//                 <span style={{ fontSize: 12, color: '#5A5550', marginLeft: 10, fontFamily: "'DM Mono', monospace" }}>
//                   {filteredExpenses.length} items
//                 </span>
//               </div>
//               <div style={{ fontSize: 20, color: '#E8A87C' }}>
//                 ${filteredExpenses.reduce((s,e) => s + parseFloat(e.cost||0), 0).toFixed(2)}
//               </div>
//             </div>

//             {/* Add Form */}
//             {showForm && (
//               <div style={{
//                 background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(232,224,213,0.1)',
//                 borderRadius: 14, padding: 22, marginBottom: 18,
//               }}>
//                 <div style={{ fontSize: 10, letterSpacing: 3, color: '#E8A87C', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>
//                   New Expense
//                 </div>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//                   {[
//                     { key: 'name', label: 'Item Name', type: 'text', col: '1 / 2' },
//                     { key: 'cost', label: 'Cost ($)', type: 'number', col: '2 / 3' },
//                     { key: 'date', label: 'Date', type: 'date', col: '1 / 2' },
//                   ].map(f => (
//                     <div key={f.key} style={{ gridColumn: f.col }}>
//                       <label style={{ display: 'block', fontSize: 9, letterSpacing: 2, color: '#5A5550', textTransform: 'uppercase', marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>
//                         {f.label}
//                       </label>
//                       <input type={f.type} value={form[f.key]}
//                         onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
//                         style={inputStyle} />
//                     </div>
//                   ))}
//                   <div style={{ gridColumn: '1 / 3' }}>
//                     <label style={{ display: 'block', fontSize: 9, letterSpacing: 2, color: '#5A5550', textTransform: 'uppercase', marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>
//                       Category
//                     </label>
//                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                       {CATEGORIES.map(cat => (
//                         <button key={cat.id} onClick={() => setForm(p => ({ ...p, category: cat.id }))}
//                           style={{
//                             padding: '5px 10px', borderRadius: 20,
//                             border: form.category === cat.id ? `1px solid ${cat.color}` : '1px solid rgba(232,224,213,0.08)',
//                             background: form.category === cat.id ? `${cat.color}18` : 'transparent',
//                             color: form.category === cat.id ? cat.color : '#5A5550',
//                             cursor: 'pointer', fontSize: 12, fontFamily: "'DM Mono', monospace",
//                           }}>{cat.icon} {cat.label}</button>
//                       ))}
//                     </div>
//                   </div>
//                   <div style={{ gridColumn: '1 / 3' }}>
//                     <label style={{ display: 'block', fontSize: 9, letterSpacing: 2, color: '#5A5550', textTransform: 'uppercase', marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>
//                       Description (optional)
//                     </label>
//                     <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
//                       rows={2} style={{ ...inputStyle, resize: 'none' }} />
//                   </div>
//                 </div>
//                 <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
//                   <button onClick={handleAddExpense} disabled={saving}
//                     style={{
//                       padding: '10px 22px', borderRadius: 8, border: 'none',
//                       background: saving ? 'rgba(232,168,124,0.5)' : '#E8A87C',
//                       color: '#0A0A0C', cursor: saving ? 'not-allowed' : 'pointer',
//                       fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
//                       fontFamily: "'DM Mono', monospace",
//                     }}>{saving ? 'Saving...' : 'Save Expense'}</button>
//                   <button onClick={() => setShowForm(false)}
//                     style={{
//                       padding: '10px 22px', borderRadius: 8,
//                       border: '1px solid rgba(232,224,213,0.1)',
//                       background: 'transparent', color: '#5A5550',
//                       cursor: 'pointer', fontSize: 12, fontFamily: "'DM Mono', monospace",
//                     }}>Cancel</button>
//                 </div>
//               </div>
//             )}

//             {/* Expense list */}
//             {loading ? (
//               <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4A4540', fontFamily: "'DM Mono', monospace" }}>
//                 <div style={{ fontSize: 28, marginBottom: 10 }}>◎</div>
//                 <div style={{ fontSize: 11, letterSpacing: 2 }}>Loading expenses...</div>
//               </div>
//             ) : filteredExpenses.length === 0 ? (
//               <div style={{
//                 textAlign: 'center', padding: '60px 20px',
//                 border: '1px dashed rgba(232,224,213,0.07)', borderRadius: 14, color: '#3A3530',
//               }}>
//                 <div style={{ fontSize: 32, marginBottom: 10 }}>◎</div>
//                 <div style={{ fontSize: 15 }}>No expenses recorded</div>
//                 <div style={{ fontSize: 11, marginTop: 6, fontFamily: "'DM Mono', monospace", color: '#3A3530' }}>
//                   Click "+ Add Expense" to begin
//                 </div>
//               </div>
//             ) : (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
//                 {filteredExpenses.map(exp => {
//                   const cat = getCat(exp.category)
//                   const isSelected = selectedItem?.id === exp.id
//                   return (
//                     <div key={exp.id} onClick={() => setSelectedItem(isSelected ? null : exp)}
//                       style={{
//                         borderRadius: 12, cursor: 'pointer', overflow: 'hidden',
//                         border: isSelected ? `1px solid ${cat.color}45` : '1px solid rgba(232,224,213,0.06)',
//                         background: isSelected ? `${cat.color}0A` : 'rgba(255,255,255,0.015)',
//                         transition: 'all 0.2s',
//                       }}>
//                       <div style={{ display: 'flex', alignItems: 'center', padding: '12px 15px', gap: 13 }}>
//                         <div style={{
//                           width: 38, height: 38, borderRadius: 10,
//                           display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           background: `${cat.color}15`, fontSize: 18, flexShrink: 0,
//                         }}>{cat.icon}</div>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <div style={{ fontSize: 16, color: '#E8E0D5' }}>{exp.name}</div>
//                           <div style={{ fontSize: 11, color: '#4A4540', marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
//                             {cat.label} · {exp.date}
//                           </div>
//                         </div>
//                         <div style={{ fontSize: 17, color: cat.color, flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>
//                           ${parseFloat(exp.cost).toFixed(2)}
//                         </div>
//                       </div>
//                       {isSelected && (
//                         <div style={{ padding: '0 15px 14px 66px', borderTop: `1px solid ${cat.color}18` }}>
//                           {exp.description && (
//                             <p style={{ fontSize: 13, color: '#6A6560', margin: '10px 0', lineHeight: 1.6 }}>
//                               {exp.description}
//                             </p>
//                           )}
//                           <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
//                             <div style={{ fontSize: 11, color: '#4A4540', padding: '4px 10px', border: '1px solid rgba(232,224,213,0.07)', borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>
//                               📅 {exp.date}
//                             </div>
//                             <div style={{ fontSize: 11, color: cat.color, padding: '4px 10px', border: `1px solid ${cat.color}28`, borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>
//                               {cat.icon} {cat.label}
//                             </div>
//                             <button onClick={(e) => { e.stopPropagation(); handleDelete(exp.id) }}
//                               style={{
//                                 padding: '4px 12px', borderRadius: 6,
//                                 border: '1px solid rgba(241,148,138,0.25)',
//                                 background: 'transparent', color: '#F1948A',
//                                 cursor: 'pointer', fontSize: 11,
//                                 fontFamily: "'DM Mono', monospace", marginLeft: 'auto',
//                               }}>Delete</button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )
//                 })}
//               </div>
//             )}

//             {/* Breakdown */}
//             {monthExpenses.length > 0 && !activeCategory && (
//               <div style={{ marginTop: 28 }}>
//                 <div style={{ fontSize: 9, letterSpacing: 3, color: '#5A5550', textTransform: 'uppercase', marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>
//                   Monthly Breakdown
//                 </div>
//                 <div style={{ display: 'flex', gap: 3, height: 5, borderRadius: 3, overflow: 'hidden', marginBottom: 14 }}>
//                   {CATEGORIES.map(cat => {
//                     const total = (grouped[cat.id] || []).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
//                     const pct = monthTotal > 0 ? (total / monthTotal) * 100 : 0
//                     if (pct === 0) return null
//                     return <div key={cat.id} style={{ width: `${pct}%`, background: cat.color }} />
//                   })}
//                 </div>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
//                   {CATEGORIES.filter(cat => grouped[cat.id]?.length > 0).map(cat => {
//                     const total = (grouped[cat.id] || []).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
//                     const pct = monthTotal > 0 ? (total / monthTotal * 100).toFixed(1) : 0
//                     return (
//                       <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: '#5A5550', fontFamily: "'DM Mono', monospace" }}>
//                         <div style={{ width: 7, height: 7, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
//                         {cat.label}: <span style={{ color: cat.color }}>{pct}%</span>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// import { useState, useEffect, useMemo, useCallback } from 'react'
// import { supabase } from '../lib/supabase'

// const CATEGORIES = [
//   { id: 'food',          label: 'Food & Dining',    icon: '🍽️', color: '#E8A87C' },
//   { id: 'subscriptions', label: 'Subscriptions',    icon: '📱', color: '#85C1E9' },
//   { id: 'bills',         label: 'Bills & Utilities', icon: '⚡', color: '#F1948A' },
//   { id: 'transport',     label: 'Transport',         icon: '🚗', color: '#82E0AA' },
//   { id: 'health',        label: 'Health',            icon: '💊', color: '#BB8FCE' },
//   { id: 'entertainment', label: 'Entertainment',     icon: '🎬', color: '#F9E79F' },
//   { id: 'shopping',      label: 'Shopping',          icon: '🛍️', color: '#F0B27A' },
//   { id: 'other',         label: 'Other',             icon: '📦', color: '#AEB6BF' },
// ]

// const MONTHS = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December'
// ]

// const NOW = new Date()

// // ── responsive hook ──────────────────────────────────────
// function useWindowWidth() {
//   const [width, setWidth] = useState(window.innerWidth)
//   useEffect(() => {
//     const handler = () => setWidth(window.innerWidth)
//     window.addEventListener('resize', handler)
//     return () => window.removeEventListener('resize', handler)
//   }, [])
//   return width
// }

// export default function BudgetPage({ session }) {
//   const width       = useWindowWidth()
//   const isMobile    = width < 768
//   const isTablet    = width >= 768 && width < 1024

//   const [expenses,       setExpenses]       = useState([])
//   const [loading,        setLoading]        = useState(true)
//   const [saving,         setSaving]         = useState(false)
//   const [saveMsg,        setSaveMsg]        = useState('')
//   const [activeMonth,    setActiveMonth]    = useState(NOW.getMonth())
//   const [activeYear,     setActiveYear]     = useState(NOW.getFullYear())
//   const [activeCategory, setActiveCategory] = useState(null)
//   const [showForm,       setShowForm]       = useState(false)
//   const [showSidebar,    setShowSidebar]    = useState(false) // mobile sidebar toggle
//   const [selectedItem,   setSelectedItem]   = useState(null)
//   const [form, setForm] = useState({
//     name: '', description: '',
//     date: NOW.toISOString().split('T')[0],
//     cost: '', category: 'food',
//   })

//   const user      = session.user
//   const userInit  = (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()
//   const userName  = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

//   // ── fetch for selected year ──────────────────────────
//   const fetchExpenses = useCallback(async () => {
//     setLoading(true)
//     const { data, error } = await supabase
//       .from('expenses')
//       .select('*')
//       .eq('user_id', user.id)
//       .eq('year', activeYear)
//       .order('date', { ascending: false })
//     if (!error && data) setExpenses(data)
//     setLoading(false)
//   }, [user.id, activeYear])

//   useEffect(() => { fetchExpenses() }, [fetchExpenses])

//   // ── year navigation ──────────────────────────────────
//   function prevYear() {
//     setActiveYear(y => y - 1)
//     setActiveCategory(null)
//     setSelectedItem(null)
//   }
//   function nextYear() {
//     if (activeYear < NOW.getFullYear()) {
//       setActiveYear(y => y + 1)
//       setActiveCategory(null)
//       setSelectedItem(null)
//     }
//   }

//   // ── add expense ──────────────────────────────────────
//   async function handleAddExpense() {
//     if (!form.name || !form.cost || !form.date) return
//     setSaving(true)
//     const d     = new Date(form.date + 'T12:00:00')
//     const month = d.getMonth()
//     const year  = d.getFullYear()
//     const { data, error } = await supabase.from('expenses').insert([{
//       user_id: user.id,
//       name: form.name, description: form.description,
//       category: form.category, cost: parseFloat(form.cost),
//       date: form.date, month, year,
//     }]).select().single()
//     if (!error && data) {
//       // if added expense belongs to active year — prepend it
//       if (year === activeYear) setExpenses(prev => [data, ...prev])
//       setForm(f => ({ ...f, name: '', description: '', cost: '' }))
//       setShowForm(false)
//       flash('✓ Saved')
//     }
//     setSaving(false)
//   }

//   // ── delete ───────────────────────────────────────────
//   async function handleDelete(id) {
//     const { error } = await supabase.from('expenses').delete().eq('id', id)
//     if (!error) {
//       setExpenses(prev => prev.filter(e => e.id !== id))
//       setSelectedItem(null)
//       flash('✓ Deleted')
//     }
//   }

//   function flash(msg) { setSaveMsg(msg); setTimeout(() => setSaveMsg(''), 2000) }
//   async function handleSignOut() { await supabase.auth.signOut() }

//   // ── derived data ─────────────────────────────────────
//   const monthExpenses = useMemo(() =>
//     expenses.filter(e => e.month === activeMonth),
//     [expenses, activeMonth]
//   )
//   const grouped = useMemo(() => {
//     const g = {}
//     monthExpenses.forEach(e => {
//       if (!g[e.category]) g[e.category] = []
      
//       g[e.category].push(e)
//     })
//     return g
//   }, [monthExpenses])
//   const monthTotal = useMemo(() =>
//     monthExpenses.reduce((s, e) => s + parseFloat(e.cost || 0), 0),
//     [monthExpenses]
//   )
//   const yearTotal = useMemo(() =>
//     expenses.reduce((s, e) => s + parseFloat(e.cost || 0), 0),
//     [expenses]
//   )
//   const filteredExpenses = activeCategory
//     ? monthExpenses.filter(e => e.category === activeCategory)
//     : monthExpenses

//   const getCat   = id  => CATEGORIES.find(c => c.id === id) || CATEGORIES[7]
//   const mTotal   = idx => expenses.filter(e => e.month === idx)
//                                   .reduce((s, e) => s + parseFloat(e.cost || 0), 0)

//   // ── shared styles ────────────────────────────────────
//   const inputStyle = {
//     width: '100%', background: 'rgba(255,255,255,0.04)',
//     border: '1px solid rgba(232,224,213,0.12)', borderRadius: 8,
//     padding: '10px 12px', color: '#E8E0D5', fontSize: 14,
//     fontFamily: "'DM Mono', monospace",
//     outline: 'none', boxSizing: 'border-box', colorScheme: 'dark',
//   }
//   const labelStyle = {
//     display: 'block', fontSize: 9, letterSpacing: 2,
//     color: '#5A5550', textTransform: 'uppercase', marginBottom: 6,
//     fontFamily: "'DM Mono', monospace",
//   }

//   // ── sidebar content (shared desktop + mobile drawer) ─
//   const SidebarContent = () => (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//       {/* All */}
//       <button onClick={() => { setActiveCategory(null); setShowSidebar(false) }}
//         style={{
//           textAlign: 'left', padding: '11px 14px', borderRadius: 10,
//           border: !activeCategory ? '1px solid rgba(232,224,213,0.2)' : '1px solid rgba(232,224,213,0.05)',
//           background: !activeCategory ? 'rgba(232,224,213,0.06)' : 'transparent',
//           color: !activeCategory ? '#E8E0D5' : '#5A5550',
//           cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//           fontFamily: "'DM Mono', monospace",
//         }}>
//         <span style={{ fontSize: 13 }}>✦ All Expenses</span>
//         <span style={{ fontSize: 12, color: '#E8A87C' }}>${monthTotal.toFixed(2)}</span>
//       </button>

//       {/* Categories */}
//       {CATEGORIES.map(cat => {
//         const total = (grouped[cat.id] || []).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
//         const isAct = activeCategory === cat.id
//         return (
//           <button key={cat.id} onClick={() => { setActiveCategory(isAct ? null : cat.id); setShowSidebar(false) }}
//             style={{
//               textAlign: 'left', padding: '11px 14px', borderRadius: 10,
//               border: isAct ? `1px solid ${cat.color}35` : '1px solid rgba(232,224,213,0.05)',
//               background: isAct ? `${cat.color}10` : 'transparent',
//               color: isAct ? cat.color : '#5A5550',
//               cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//               transition: 'all 0.2s', fontFamily: "'DM Mono', monospace",
//             }}>
//             <span style={{ fontSize: 13 }}>{cat.icon} {cat.label}</span>
//             {total > 0 && <span style={{ fontSize: 11 }}>${total.toFixed(0)}</span>}
//           </button>
//         )
//       })}

//       {/* Add button */}
//       <button onClick={() => { setShowForm(true); setSelectedItem(null); setShowSidebar(false) }}
//         style={{
//           marginTop: 8, padding: '12px', borderRadius: 10,
//           border: '1px dashed rgba(232,168,124,0.25)',
//           background: 'transparent', color: '#E8A87C',
//           cursor: 'pointer', fontSize: 13, letterSpacing: 1,
//           fontFamily: "'DM Mono', monospace",
//         }}>
//         + Add Expense
//       </button>

//       {/* Sync badge */}
//       <div style={{
//         marginTop: 8, padding: '8px 12px', borderRadius: 8,
//         background: 'rgba(130,224,170,0.04)', border: '1px solid rgba(130,224,170,0.1)',
//         display: 'flex', alignItems: 'center', gap: 8,
//       }}>
//         <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#82E0AA', flexShrink: 0 }} />
//         <span style={{ fontSize: 9, letterSpacing: 2, color: '#82E0AA', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
//           Synced to cloud
//         </span>
//       </div>
//     </div>
//   )

//   return (
//     <div style={{
//       minHeight: '100vh', background: '#0A0A0C',
//       fontFamily: "'Cormorant Garamond', Georgia, serif",
//       color: '#E8E0D5',
//     }}>
//       {/* Ambient glow */}
//       <div style={{
//         position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
//         background: `
//           radial-gradient(ellipse at 10% 30%, rgba(232,168,124,0.05) 0%, transparent 50%),
//           radial-gradient(ellipse at 90% 70%, rgba(133,193,233,0.04) 0%, transparent 50%)
//         `,
//       }} />

//       {/* Mobile sidebar overlay */}
//       {isMobile && showSidebar && (
//         <>
//           <div onClick={() => setShowSidebar(false)} style={{
//             position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
//             zIndex: 40, backdropFilter: 'blur(2px)',
//           }} />
//           <div style={{
//             position: 'fixed', top: 0, left: 0, bottom: 0, width: '80%', maxWidth: 300,
//             background: '#111113', zIndex: 50, padding: '24px 16px',
//             borderRight: '1px solid rgba(232,224,213,0.08)',
//             overflowY: 'auto',
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//               <span style={{ fontSize: 10, letterSpacing: 3, color: '#E8A87C', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
//                 Categories
//               </span>
//               <button onClick={() => setShowSidebar(false)} style={{
//                 background: 'none', border: 'none', color: '#5A5550', cursor: 'pointer', fontSize: 20,
//               }}>✕</button>
//             </div>
//             <SidebarContent />
//           </div>
//         </>
//       )}

//       <div style={{ position: 'relative', zIndex: 1, maxWidth: 1140, margin: '0 auto', padding: isMobile ? '0 12px' : '0 20px' }}>

//         {/* ── HEADER ───────────────────────────────────── */}
//         <header style={{
//           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//           paddingTop: isMobile ? 16 : 28, paddingBottom: isMobile ? 14 : 20,
//           borderBottom: '1px solid rgba(232,224,213,0.08)',
//           flexWrap: 'wrap', gap: 10,
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             {/* Hamburger on mobile */}
//             {isMobile && (
//               <button onClick={() => setShowSidebar(true)} style={{
//                 background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(232,224,213,0.1)',
//                 borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#E8A87C', fontSize: 16,
//               }}>☰</button>
//             )}
//             <div>
//               <div style={{ fontSize: 9, letterSpacing: 4, color: '#E8A87C', textTransform: 'uppercase', marginBottom: 2, fontFamily: "'DM Mono', monospace" }}>
//                 Personal Finance
//               </div>
//               <h1 style={{ fontSize: isMobile ? 22 : 30, fontWeight: 400, margin: 0, letterSpacing: -0.5, color: '#F5EFE8' }}>
//                 Budget <em style={{ color: '#E8A87C', fontStyle: 'italic' }}>Ledger</em>
//               </h1>
//             </div>
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20 }}>
//             {/* Save indicator */}
//             <div style={{
//               fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1,
//               color: saveMsg ? '#82E0AA' : 'transparent', transition: 'color 0.3s',
//             }}>{saveMsg}</div>

//             {/* Year total */}
//             {!isMobile && (
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontSize: 9, letterSpacing: 3, color: '#7A7570', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>Year Total</div>
//                 <div style={{ fontSize: 22, color: '#E8A87C' }}>${yearTotal.toFixed(2)}</div>
//               </div>
//             )}

//             {/* User + sign out */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//               <div style={{
//                 width: 32, height: 32, borderRadius: '50%',
//                 background: 'rgba(232,168,124,0.15)', border: '1px solid rgba(232,168,124,0.3)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontSize: 13, color: '#E8A87C', fontFamily: "'DM Mono', monospace", flexShrink: 0,
//               }}>{userInit}</div>
//               {!isMobile && (
//                 <div>
//                   <div style={{ fontSize: 13, color: '#E8E0D5' }}>{userName}</div>
//                   <button onClick={handleSignOut} style={{
//                     background: 'none', border: 'none', color: '#5A5550',
//                     cursor: 'pointer', fontSize: 11, padding: 0, fontFamily: "'DM Mono', monospace",
//                   }}>Sign out</button>
//                 </div>
//               )}
//               {isMobile && (
//                 <button onClick={handleSignOut} style={{
//                   background: 'none', border: '1px solid rgba(232,224,213,0.1)', borderRadius: 7,
//                   color: '#5A5550', cursor: 'pointer', fontSize: 10, padding: '5px 8px',
//                   fontFamily: "'DM Mono', monospace",
//                 }}>Out</button>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* ── YEAR NAVIGATOR ───────────────────────────── */}
//         <div style={{
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           gap: 16, paddingTop: 16, paddingBottom: 4,
//         }}>
//           <button onClick={prevYear} style={{
//             width: 34, height: 34, borderRadius: '50%',
//             border: '1px solid rgba(232,224,213,0.12)',
//             background: 'rgba(255,255,255,0.03)', color: '#E8A87C',
//             cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}>‹</button>

//           <div style={{ textAlign: 'center', minWidth: 100 }}>
//             <div style={{ fontSize: isMobile ? 24 : 28, color: '#F5EFE8', letterSpacing: 2, fontFamily: "'DM Mono', monospace" }}>
//               {activeYear}
//             </div>
//             {isMobile && (
//               <div style={{ fontSize: 11, color: '#E8A87C', fontFamily: "'DM Mono', monospace" }}>
//                 ${yearTotal.toFixed(2)}
//               </div>
//             )}
//           </div>

//           <button onClick={nextYear} disabled={activeYear >= NOW.getFullYear()}
//             style={{
//               width: 34, height: 34, borderRadius: '50%',
//               border: '1px solid rgba(232,224,213,0.12)',
//               background: 'rgba(255,255,255,0.03)',
//               color: activeYear >= NOW.getFullYear() ? '#3A3530' : '#E8A87C',
//               cursor: activeYear >= NOW.getFullYear() ? 'not-allowed' : 'pointer',
//               fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
//             }}>›</button>
//         </div>

//         {/* ── MONTH TABS ───────────────────────────────── */}
//         <div style={{
//           display: 'flex', gap: 5, paddingTop: 12, paddingBottom: 2,
//           overflowX: 'auto', scrollbarWidth: 'none',
//         }}>
//           {MONTHS.map((m, i) => {
//             const mt    = mTotal(i)
//             const isAct = activeMonth === i
//             return (
//               <button key={i} onClick={() => { setActiveMonth(i); setActiveCategory(null); setSelectedItem(null) }}
//                 style={{
//                   flexShrink: 0,
//                   padding: isMobile ? '8px 10px' : '9px 15px',
//                   borderRadius: 10,
//                   border: isAct ? '1px solid rgba(232,168,124,0.4)' : '1px solid rgba(232,224,213,0.07)',
//                   background: isAct ? 'rgba(232,168,124,0.1)' : 'rgba(255,255,255,0.015)',
//                   color: isAct ? '#E8A87C' : '#5A5550',
//                   cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
//                   minWidth: isMobile ? 58 : 72,
//                   fontFamily: "'DM Mono', monospace",
//                 }}>
//                 <div style={{ fontSize: isMobile ? 9 : 10, letterSpacing: 1, textTransform: 'uppercase' }}>
//                   {m.slice(0, 3)}
//                 </div>
//                 {mt > 0 && (
//                   <div style={{ fontSize: 10, marginTop: 2, color: isAct ? '#E8A87C' : '#4A4540' }}>
//                     ${mt >= 1000 ? (mt / 1000).toFixed(1) + 'k' : mt.toFixed(0)}
//                   </div>
//                 )}
//               </button>
//             )
//           })}
//         </div>

//         {/* ── MAIN GRID ────────────────────────────────── */}
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: isMobile ? '1fr' : isTablet ? '200px 1fr' : '250px 1fr',
//           gap: isMobile ? 0 : 20,
//           paddingTop: 20, paddingBottom: 48,
//         }}>

//           {/* SIDEBAR — desktop/tablet only */}
//           {!isMobile && (
//             <div>
//               <div style={{ fontSize: 9, letterSpacing: 3, color: '#5A5550', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>
//                 Categories
//               </div>
//               <SidebarContent />
//             </div>
//           )}

//           {/* RIGHT PANEL */}
//           <div>
//             {/* Panel header */}
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                 {/* Mobile: filter chip */}
//                 {isMobile && (
//                   <button onClick={() => setShowSidebar(true)} style={{
//                     padding: '5px 12px', borderRadius: 20,
//                     border: activeCategory ? `1px solid ${getCat(activeCategory).color}` : '1px solid rgba(232,224,213,0.12)',
//                     background: activeCategory ? `${getCat(activeCategory).color}15` : 'rgba(255,255,255,0.03)',
//                     color: activeCategory ? getCat(activeCategory).color : '#7A7570',
//                     cursor: 'pointer', fontSize: 11, fontFamily: "'DM Mono', monospace",
//                   }}>
//                     {activeCategory ? `${getCat(activeCategory).icon} ${getCat(activeCategory).label}` : '⊞ Filter'}
//                   </button>
//                 )}
//                 <span style={{ fontSize: isMobile ? 18 : 24, color: '#F5EFE8' }}>{MONTHS[activeMonth]}</span>
//                 <span style={{ fontSize: 11, color: '#5A5550', fontFamily: "'DM Mono', monospace" }}>
//                   {filteredExpenses.length} items
//                 </span>
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                 <div style={{ fontSize: isMobile ? 16 : 20, color: '#E8A87C', fontFamily: "'DM Mono', monospace" }}>
//                   ${filteredExpenses.reduce((s, e) => s + parseFloat(e.cost || 0), 0).toFixed(2)}
//                 </div>
//                 {/* Mobile add button */}
//                 {isMobile && (
//                   <button onClick={() => { setShowForm(true); setSelectedItem(null) }} style={{
//                     padding: '7px 14px', borderRadius: 20,
//                     border: '1px solid rgba(232,168,124,0.3)',
//                     background: 'rgba(232,168,124,0.08)', color: '#E8A87C',
//                     cursor: 'pointer', fontSize: 12, fontFamily: "'DM Mono', monospace",
//                   }}>+ Add</button>
//                 )}
//               </div>
//             </div>

//             {/* ADD FORM */}
//             {showForm && (
//               <div style={{
//                 background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(232,224,213,0.1)',
//                 borderRadius: 14, padding: isMobile ? 16 : 22, marginBottom: 16,
//               }}>
//                 <div style={{ fontSize: 10, letterSpacing: 3, color: '#E8A87C', textTransform: 'uppercase', marginBottom: 14, fontFamily: "'DM Mono', monospace" }}>
//                   New Expense
//                 </div>

//                 {/* Name + Cost */}
//                 <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 10 }}>
//                   <div>
//                     <label style={labelStyle}>Item Name</label>
//                     <input type="text" placeholder="e.g. Netflix" value={form.name}
//                       onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
//                   </div>
//                   <div>
//                     <label style={labelStyle}>Cost ($)</label>
//                     <input type="number" placeholder="0.00" value={form.cost}
//                       onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} style={inputStyle} />
//                   </div>
//                 </div>

//                 {/* Date */}
//                 <div style={{ marginBottom: 10 }}>
//                   <label style={labelStyle}>Date</label>
//                   <input type="date" value={form.date}
//                     onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ ...inputStyle, maxWidth: isMobile ? '100%' : 220 }} />
//                 </div>

//                 {/* Category pills */}
//                 <div style={{ marginBottom: 10 }}>
//                   <label style={labelStyle}>Category</label>
//                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                     {CATEGORIES.map(cat => (
//                       <button key={cat.id} onClick={() => setForm(p => ({ ...p, category: cat.id }))}
//                         style={{
//                           padding: '6px 11px', borderRadius: 20,
//                           border: form.category === cat.id ? `1px solid ${cat.color}` : '1px solid rgba(232,224,213,0.08)',
//                           background: form.category === cat.id ? `${cat.color}18` : 'transparent',
//                           color: form.category === cat.id ? cat.color : '#5A5550',
//                           cursor: 'pointer', fontSize: isMobile ? 11 : 12, fontFamily: "'DM Mono', monospace",
//                         }}>{cat.icon} {cat.label}</button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div style={{ marginBottom: 14 }}>
//                   <label style={labelStyle}>Description (optional)</label>
//                   <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
//                     rows={2} style={{ ...inputStyle, resize: 'none' }} />
//                 </div>

//                 <div style={{ display: 'flex', gap: 8 }}>
//                   <button onClick={handleAddExpense} disabled={saving} style={{
//                     padding: '10px 22px', borderRadius: 8, border: 'none',
//                     background: saving ? 'rgba(232,168,124,0.5)' : '#E8A87C',
//                     color: '#0A0A0C', cursor: saving ? 'not-allowed' : 'pointer',
//                     fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
//                     fontFamily: "'DM Mono', monospace",
//                   }}>{saving ? 'Saving...' : 'Save'}</button>
//                   <button onClick={() => setShowForm(false)} style={{
//                     padding: '10px 22px', borderRadius: 8,
//                     border: '1px solid rgba(232,224,213,0.1)',
//                     background: 'transparent', color: '#5A5550',
//                     cursor: 'pointer', fontSize: 12, fontFamily: "'DM Mono', monospace",
//                   }}>Cancel</button>
//                 </div>
//               </div>
//             )}

//             {/* EXPENSE LIST */}
//             {loading ? (
//               <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4A4540', fontFamily: "'DM Mono', monospace" }}>
//                 <div style={{ fontSize: 28, marginBottom: 10 }}>◎</div>
//                 <div style={{ fontSize: 11, letterSpacing: 2 }}>Loading {activeYear} expenses...</div>
//               </div>
//             ) : filteredExpenses.length === 0 ? (
//               <div style={{
//                 textAlign: 'center', padding: '50px 20px',
//                 border: '1px dashed rgba(232,224,213,0.07)', borderRadius: 14, color: '#3A3530',
//               }}>
//                 <div style={{ fontSize: 32, marginBottom: 10 }}>◎</div>
//                 <div style={{ fontSize: 15 }}>No expenses for {MONTHS[activeMonth]} {activeYear}</div>
//                 <div style={{ fontSize: 11, marginTop: 6, fontFamily: "'DM Mono', monospace", color: '#3A3530' }}>
//                   {isMobile ? 'Tap "+ Add" above to begin' : 'Click "+ Add Expense" to begin'}
//                 </div>
//               </div>
//             ) : (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
//                 {filteredExpenses.map(exp => {
//                   const cat    = getCat(exp.category)
//                   const isSel  = selectedItem?.id === exp.id
//                   return (
//                     <div key={exp.id} onClick={() => setSelectedItem(isSel ? null : exp)}
//                       style={{
//                         borderRadius: 12, cursor: 'pointer', overflow: 'hidden',
//                         border: isSel ? `1px solid ${cat.color}45` : '1px solid rgba(232,224,213,0.06)',
//                         background: isSel ? `${cat.color}0A` : 'rgba(255,255,255,0.015)',
//                         transition: 'all 0.2s',
//                       }}>
//                       <div style={{ display: 'flex', alignItems: 'center', padding: isMobile ? '11px 13px' : '12px 15px', gap: 12 }}>
//                         <div style={{
//                           width: isMobile ? 34 : 38, height: isMobile ? 34 : 38,
//                           borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           background: `${cat.color}15`, fontSize: isMobile ? 16 : 18, flexShrink: 0,
//                         }}>{cat.icon}</div>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <div style={{ fontSize: isMobile ? 14 : 16, color: '#E8E0D5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                             {exp.name}
//                           </div>
//                           <div style={{ fontSize: 11, color: '#4A4540', marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
//                             {cat.label} · {exp.date}
//                           </div>
//                         </div>
//                         <div style={{ fontSize: isMobile ? 14 : 17, color: cat.color, flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>
//                           ${parseFloat(exp.cost).toFixed(2)}
//                         </div>
//                       </div>

//                       {/* Expanded detail */}
//                       {isSel && (
//                         <div style={{ padding: `0 13px 13px ${isMobile ? 13 : 66}px`, borderTop: `1px solid ${cat.color}18` }}>
//                           {exp.description && (
//                             <p style={{ fontSize: 13, color: '#6A6560', margin: '10px 0', lineHeight: 1.6 }}>
//                               {exp.description}
//                             </p>
//                           )}
//                           <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
//                             <div style={{ fontSize: 11, color: '#4A4540', padding: '4px 10px', border: '1px solid rgba(232,224,213,0.07)', borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>
//                               📅 {exp.date}
//                             </div>
//                             <div style={{ fontSize: 11, color: cat.color, padding: '4px 10px', border: `1px solid ${cat.color}28`, borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>
//                               {cat.icon} {cat.label}
//                             </div>
//                             <button onClick={e => { e.stopPropagation(); handleDelete(exp.id) }} style={{
//                               padding: '4px 12px', borderRadius: 6,
//                               border: '1px solid rgba(241,148,138,0.25)',
//                               background: 'transparent', color: '#F1948A',
//                               cursor: 'pointer', fontSize: 11,
//                               fontFamily: "'DM Mono', monospace", marginLeft: 'auto',
//                             }}>Delete</button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )
//                 })}
//               </div>
//             )}

//             {/* BREAKDOWN BAR */}
//             {monthExpenses.length > 0 && !activeCategory && (
//               <div style={{ marginTop: 28 }}>
//                 <div style={{ fontSize: 9, letterSpacing: 3, color: '#5A5550', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>
//                   {MONTHS[activeMonth]} {activeYear} Breakdown
//                 </div>
//                 <div style={{ display: 'flex', gap: 2, height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
//                   {CATEGORIES.map(cat => {
//                     const total = (grouped[cat.id] || []).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
//                     const pct   = monthTotal > 0 ? (total / monthTotal) * 100 : 0
//                     if (pct === 0) return null
//                     return <div key={cat.id} style={{ width: `${pct}%`, background: cat.color }} />
//                   })}
//                 </div>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 14px' }}>
//                   {CATEGORIES.filter(cat => grouped[cat.id]?.length > 0).map(cat => {
//                     const total = (grouped[cat.id] || []).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
//                     const pct   = monthTotal > 0 ? (total / monthTotal * 100).toFixed(1) : 0
//                     return (
//                       <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5A5550', fontFamily: "'DM Mono', monospace" }}>
//                         <div style={{ width: 7, height: 7, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
//                         {isMobile ? cat.icon : cat.label}: <span style={{ color: cat.color }}>{pct}%</span>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// import { useState, useEffect, useMemo, useCallback } from 'react'
// import { supabase } from '../lib/supabase'

// const CATEGORIES = [
//   { id: 'food',          label: 'Food & Dining',    icon: '🍽️', color: '#E8A87C' },
//   { id: 'subscriptions', label: 'Subscriptions',    icon: '📱', color: '#85C1E9' },
//   { id: 'bills',         label: 'Bills & Utilities', icon: '⚡', color: '#F1948A' },
//   { id: 'transport',     label: 'Transport',         icon: '🚗', color: '#82E0AA' },
//   { id: 'health',        label: 'Health',            icon: '💊', color: '#BB8FCE' },
//   { id: 'entertainment', label: 'Entertainment',     icon: '🎬', color: '#F9E79F' },
//   { id: 'shopping',      label: 'Shopping',          icon: '🛍️', color: '#F0B27A' },
//   { id: 'other',         label: 'Other',             icon: '📦', color: '#AEB6BF' },
// ]

// const MONTHS = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December'
// ]

// const CURRENCIES = [
//   { code: 'USD', symbol: '$', label: 'USD $' },
//   { code: 'EUR', symbol: '€', label: 'EUR €' },
//   { code: 'GBP', symbol: '£', label: 'GBP £' },
//   { code: 'MKD', symbol: 'ден', label: 'MKD ден' },
//   { code: 'CHF', symbol: 'CHF', label: 'CHF' },
//   { code: 'CAD', symbol: 'C$', label: 'CAD C$' },
//   { code: 'AUD', symbol: 'A$', label: 'AUD A$' },
//   { code: 'JPY', symbol: '¥', label: 'JPY ¥' },
// ]

// // Approximate units per 1 USD, used for client-side conversion.
// // const USD_RATES = {
// //   USD: 1,
// //   EUR: 0.92,
// //   GBP: 0.79,
// //   MKD: 56.5,
// //   CHF: 0.88,
// //   CAD: 1.35,
// //   AUD: 1.53,
// //   JPY: 149.5,
// // }

// // Approximate units per 1 USD, used for client-side conversion.
// const USD_RATES = {
//   USD: 1,
//   EUR: 0.85,
//   GBP: 0.78,
//   MKD: 52.0,
//   CHF: 0.88,
//   CAD: 1.35,
//   AUD: 1.52,
//   JPY: 150.0,

//   AED: 3.67,
//   AFN: 71.0,
//   ALL: 95.0,
//   AMD: 405.0,
//   ANG: 1.79,
//   AOA: 830.0,
//   ARS: 850.0,
//   AWG: 1.79,
//   AZN: 1.7,

//   BAM: 1.66,
//   BBD: 2.0,
//   BDT: 110.0,
//   BGN: 1.66,
//   BHD: 0.38,
//   BIF: 2850.0,
//   BMD: 1.0,
//   BND: 1.35,
//   BOB: 6.9,
//   BRL: 5.0,
//   BSD: 1.0,
//   BTN: 83.0,
//   BWP: 13.5,
//   BYN: 3.2,
//   BZD: 2.0,

//   CDF: 2800.0,
//   CLP: 930.0,
//   CNY: 7.2,
//   COP: 3900.0,
//   CRC: 520.0,
//   CUP: 24.0,
//   CVE: 94.0,
//   CZK: 23.0,

//   DJF: 178.0,
//   DKK: 6.9,
//   DOP: 59.0,
//   DZD: 134.0,

//   EGP: 48.0,
//   ERN: 15.0,
//   ETB: 56.0,

//   FJD: 2.2,
//   FKP: 0.78,

//   GEL: 2.7,
//   GHS: 15.0,
//   GIP: 0.78,
//   GMD: 67.0,
//   GNF: 8600.0,
//   GTQ: 7.8,
//   GYD: 210.0,

//   HKD: 7.8,
//   HNL: 24.7,
//   HTG: 132.0,
//   HUF: 360.0,

//   IDR: 15500.0,
//   ILS: 3.7,
//   INR: 83.0,
//   IQD: 1310.0,
//   IRR: 42000.0,
//   ISK: 138.0,

//   JMD: 155.0,
//   JOD: 0.71,

//   KES: 129.0,
//   KGS: 89.0,
//   KHR: 4100.0,
//   KMF: 420.0,
//   KPW: 900.0,
//   KRW: 1330.0,
//   KWD: 0.31,
//   KYD: 0.83,
//   KZT: 460.0,

//   LAK: 21000.0,
//   LBP: 89500.0,
//   LKR: 300.0,
//   LRD: 195.0,
//   LSL: 18.5,
//   LYD: 4.9,

//   MAD: 9.9,
//   MDL: 17.5,
//   MGA: 4500.0,
//   MMK: 2100.0,
//   MNT: 3400.0,
//   MOP: 8.0,
//   MRU: 40.0,
//   MUR: 46.0,
//   MVR: 15.4,
//   MWK: 1700.0,
//   MXN: 17.0,
//   MYR: 4.7,
//   MZN: 63.0,

//   NAD: 18.5,
//   NGN: 1500.0,
//   NIO: 36.7,
//   NOK: 10.7,
//   NPR: 133.0,
//   NZD: 1.64,

//   OMR: 0.38,

//   PAB: 1.0,
//   PEN: 3.7,
//   PGK: 3.8,
//   PHP: 56.0,
//   PKR: 278.0,
//   PLN: 3.9,
//   PYG: 7400.0,

//   QAR: 3.64,

//   RON: 4.6,
//   RSD: 99.0,
//   RUB: 92.0,
//   RWF: 1300.0,

//   SAR: 3.75,
//   SBD: 8.4,
//   SCR: 13.5,
//   SDG: 600.0,
//   SEK: 10.5,
//   SGD: 1.35,
//   SHP: 0.78,
//   SLE: 22.0,
//   SOS: 570.0,
//   SRD: 36.0,
//   SSP: 1300.0,
//   STN: 21.0,
//   SVC: 8.75,
//   SYP: 13000.0,
//   SZL: 18.5,

//   THB: 36.0,
//   TJS: 10.9,
//   TMT: 3.5,
//   TND: 3.1,
//   TOP: 2.4,
//   TRY: 32.0,
//   TTD: 6.8,
//   TWD: 31.0,
//   TZS: 2550.0,

//   UAH: 40.0,
//   UGX: 3800.0,
//   UYU: 39.0,
//   UZS: 12600.0,

//   VES: 36.0,
//   VND: 24500.0,
//   VUV: 118.0,

//   WST: 2.7,

//   XAF: 610.0,
//   XCD: 2.7,
//   XOF: 610.0,
//   XPF: 102.0,

//   YER: 250.0,

//   ZAR: 18.5,
//   ZMW: 26.0,
//   ZWL: 322.0
// };

// const NOW = new Date()

// // ── responsive hook ──────────────────────────────────────
// function useWindowWidth() {
//   const [width, setWidth] = useState(window.innerWidth)
//   useEffect(() => {
//     const handler = () => setWidth(window.innerWidth)
//     window.addEventListener('resize', handler)
//     return () => window.removeEventListener('resize', handler)
//   }, [])
//   return width
// }

// export default function BudgetPage({ session }) {
//   const width       = useWindowWidth()
//   const isMobile    = width < 768
//   const isTablet    = width >= 768 && width < 1024

//   const [expenses,       setExpenses]       = useState([])
//   const [loading,        setLoading]        = useState(true)
//   const [saving,         setSaving]         = useState(false)
//   const [saveMsg,        setSaveMsg]        = useState('')
//   const [activeMonth,    setActiveMonth]    = useState(NOW.getMonth())
//   const [activeYear,     setActiveYear]     = useState(NOW.getFullYear())
//   const [activeCategory, setActiveCategory] = useState(null)
//   const [showForm,       setShowForm]       = useState(false)
//   const [showSidebar,    setShowSidebar]    = useState(false) // mobile sidebar toggle
//   const [selectedItem,   setSelectedItem]   = useState(null)
//   const [editingExpenseId, setEditingExpenseId] = useState(null)
//   const [form, setForm] = useState({
//     name: '', description: '',
//     date: NOW.toISOString().split('T')[0],
//     cost: '', category: 'food',
//   })

//   const user         = session.user
//   const userInit     = (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()
//   const userName     = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
//   const [currencyCode, setCurrencyCode] = useState(user.user_metadata?.currency || 'USD')
//   const [currencySymbol, setCurrencySymbol] = useState(user.user_metadata?.currency_symbol || '$')
//   const [updatingCurrency, setUpdatingCurrency] = useState(false)

//   useEffect(() => {
//     setCurrencyCode(user.user_metadata?.currency || 'USD')
//     setCurrencySymbol(user.user_metadata?.currency_symbol || '$')
//   }, [user.user_metadata?.currency, user.user_metadata?.currency_symbol])

//   // Format any amount with user's currency
//   const fmt = (amount) => `${currencySymbol}${parseFloat(amount || 0).toFixed(2)}`
//   const fmtShort = (amount) => {
//     const n = parseFloat(amount || 0)
//     if (n >= 1000) return `${currencySymbol}${(n / 1000).toFixed(1)}k`
//     return `${currencySymbol}${n.toFixed(0)}`
//   }

//   // ── fetch for selected year ──────────────────────────
//   const fetchExpenses = useCallback(async () => {
//     setLoading(true)
//     const { data, error } = await supabase
//       .from('expenses')
//       .select('*')
//       .eq('user_id', user.id)
//       .eq('year', activeYear)
//       .order('date', { ascending: false })
//     if (!error && data) setExpenses(data)
//     setLoading(false)
//   }, [user.id, activeYear])

//   useEffect(() => { fetchExpenses() }, [fetchExpenses])

//   // ── year navigation ──────────────────────────────────
//   function prevYear() {
//     setActiveYear(y => y - 1)
//     setActiveCategory(null)
//     setSelectedItem(null)
//   }
//   function nextYear() {
//     if (activeYear < NOW.getFullYear()) {
//       setActiveYear(y => y + 1)
//       setActiveCategory(null)
//       setSelectedItem(null)
//     }
//   }

//   // ── add expense ──────────────────────────────────────
//   async function handleAddExpense() {
//     if (!form.name || !form.cost || !form.date) return
//     setSaving(true)
//     const d     = new Date(form.date + 'T12:00:00')
//     const month = d.getMonth()
//     const year  = d.getFullYear()
//     const { data, error } = await supabase.from('expenses').insert([{
//       user_id: user.id,
//       name: form.name, description: form.description,
//       category: form.category, cost: parseFloat(form.cost),
//       date: form.date, month, year,
//     }]).select().single()
//     if (!error && data) {
//       // if added expense belongs to active year — prepend it
//       if (year === activeYear) setExpenses(prev => [data, ...prev])
//       setForm(f => ({ ...f, name: '', description: '', cost: '' }))
//       setShowForm(false)
//       flash('✓ Saved')
//     }
//     setSaving(false)
//   }

//   async function handleUpdateExpense() {
//     if (!editingExpenseId || !form.name || !form.cost || !form.date) return
//     setSaving(true)
//     const d     = new Date(form.date + 'T12:00:00')
//     const month = d.getMonth()
//     const year  = d.getFullYear()

//     const { data, error } = await supabase
//       .from('expenses')
//       .update({
//         name: form.name,
//         description: form.description,
//         category: form.category,
//         cost: parseFloat(form.cost),
//         date: form.date,
//         month,
//         year,
//       })
//       .eq('id', editingExpenseId)
//       .eq('user_id', user.id)
//       .select()
//       .single()

//     if (!error && data) {
//       if (data.year === activeYear) {
//         setExpenses(prev => prev.map(exp => exp.id === data.id ? data : exp))
//       } else {
//         setExpenses(prev => prev.filter(exp => exp.id !== data.id))
//       }
//       setShowForm(false)
//       setEditingExpenseId(null)
//       setSelectedItem(null)
//       setForm(f => ({ ...f, name: '', description: '', cost: '' }))
//       flash('✓ Updated')
//     } else {
//       flash('✕ Update failed')
//     }
//     setSaving(false)
//   }

//   // ── delete ───────────────────────────────────────────
//   async function handleDelete(id) {
//     const { error } = await supabase.from('expenses').delete().eq('id', id)
//     if (!error) {
//       setExpenses(prev => prev.filter(e => e.id !== id))
//       setSelectedItem(null)
//       flash('✓ Deleted')
//     }
//   }

//   function flash(msg) { setSaveMsg(msg); setTimeout(() => setSaveMsg(''), 2000) }
//   async function handleSignOut() { await supabase.auth.signOut() }

//   async function handleCurrencyChange(e) {
//     const nextCode = e.target.value
//     if (nextCode === currencyCode) return

//     const nextCurrency = CURRENCIES.find(c => c.code === nextCode) || CURRENCIES[0]
//     const prevCode = currencyCode
//     const prevSymbol = currencySymbol
//     const fromRate = USD_RATES[prevCode]
//     const toRate = USD_RATES[nextCurrency.code]

//     if (!fromRate || !toRate) {
//       flash('✕ Missing exchange rate')
//       return
//     }

//     setCurrencyCode(nextCurrency.code)
//     setCurrencySymbol(nextCurrency.symbol)
//     setUpdatingCurrency(true)

//     const convert = (amount) => {
//       const n = parseFloat(amount || 0)
//       const usdValue = n / fromRate
//       const converted = usdValue * toRate
//       return parseFloat(converted.toFixed(2))
//     }

//     // Update all user expenses so values are truly converted, not just relabeled.
//     const { data: allExpenses, error: loadExpensesError } = await supabase
//       .from('expenses')
//       .select('id, cost')
//       .eq('user_id', user.id)

//     if (loadExpensesError) {
//       setCurrencyCode(prevCode)
//       setCurrencySymbol(prevSymbol)
//       setUpdatingCurrency(false)
//       flash('✕ Could not load expenses')
//       return
//     }

//     const updateJobs = (allExpenses || []).map(exp =>
//       supabase
//         .from('expenses')
//         .update({ cost: convert(exp.cost) })
//         .eq('id', exp.id)
//         .eq('user_id', user.id)
//     )

//     const updateResults = await Promise.all(updateJobs)
//     const failedUpdate = updateResults.find(r => r.error)
//     if (failedUpdate) {
//       setCurrencyCode(prevCode)
//       setCurrencySymbol(prevSymbol)
//       setUpdatingCurrency(false)
//       flash('✕ Expense conversion failed')
//       return
//     }

//     const { error: userUpdateError } = await supabase.auth.updateUser({
//       data: {
//         ...(user.user_metadata || {}),
//         currency: nextCurrency.code,
//         currency_symbol: nextCurrency.symbol,
//       }
//     })

//     if (userUpdateError) {
//       setCurrencyCode(prevCode)
//       setCurrencySymbol(prevSymbol)
//       flash('✕ Currency saved failed')
//       setUpdatingCurrency(false)
//       return
//     }

//     setExpenses(prev => prev.map(exp => ({ ...exp, cost: convert(exp.cost) })))
//     flash('✓ Currency updated')
//     setUpdatingCurrency(false)
//   }

//   // ── derived data ─────────────────────────────────────
//   const monthExpenses = useMemo(() =>
//     expenses.filter(e => e.month === activeMonth),
//     [expenses, activeMonth]
//   )
//   const grouped = useMemo(() => {
//     const g = {}
//     monthExpenses.forEach(e => {
//       if (!g[e.category]) g[e.category] = []
//       g[e.category].push(e)
//     })
//     return g
//   }, [monthExpenses])
//   const monthTotal = useMemo(() =>
//     monthExpenses.reduce((s, e) => s + parseFloat(e.cost || 0), 0),
//     [monthExpenses]
//   )
//   const yearTotal = useMemo(() =>
//     expenses.reduce((s, e) => s + parseFloat(e.cost || 0), 0),
//     [expenses]
//   )
//   const filteredExpenses = activeCategory
//     ? monthExpenses.filter(e => e.category === activeCategory)
//     : monthExpenses

//   const getCat   = id  => CATEGORIES.find(c => c.id === id) || CATEGORIES[7]
//   const mTotal   = idx => expenses.filter(e => e.month === idx)
//                                   .reduce((s, e) => s + parseFloat(e.cost || 0), 0)

//   // ── shared styles ────────────────────────────────────
//   const inputStyle = {
//     width: '100%', background: 'rgba(255,255,255,0.04)',
//     border: '1px solid rgba(232,224,213,0.12)', borderRadius: 8,
//     padding: '10px 12px', color: '#E8E0D5', fontSize: 14,
//     fontFamily: "'DM Mono', monospace",
//     outline: 'none', boxSizing: 'border-box', colorScheme: 'dark',
//   }
//   const labelStyle = {
//     display: 'block', fontSize: 9, letterSpacing: 2,
//     color: '#5A5550', textTransform: 'uppercase', marginBottom: 6,
//     fontFamily: "'DM Mono', monospace",
//   }
//   const currencySelectStyle = {
//     border: '1px solid rgba(232,224,213,0.12)',
//     borderRadius: 7,
//     background: 'rgba(255,255,255,0.03)',
//     color: '#E8A87C',
//     fontSize: 10,
//     padding: '5px 7px',
//     fontFamily: "'DM Mono', monospace",
//     outline: 'none',
//     cursor: 'pointer',
//   }

//   // ── sidebar content (shared desktop + mobile drawer) ─
//   const SidebarContent = () => (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
//       {/* All */}
//       <button onClick={() => { setActiveCategory(null); setShowSidebar(false) }}
//         style={{
//           textAlign: 'left', padding: '11px 14px', borderRadius: 10,
//           border: !activeCategory ? '1px solid rgba(232,224,213,0.2)' : '1px solid rgba(232,224,213,0.05)',
//           background: !activeCategory ? 'rgba(232,224,213,0.06)' : 'transparent',
//           color: !activeCategory ? '#E8E0D5' : '#5A5550',
//           cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//           fontFamily: "'DM Mono', monospace",
//         }}>
//         <span style={{ fontSize: 13 }}>✦ All Expenses</span>
//         <span style={{ fontSize: 12, color: '#E8A87C' }}>{fmt(monthTotal)}</span>
//       </button>

//       {/* Categories */}
//       {CATEGORIES.map(cat => {
//         const total = (grouped[cat.id] || []).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
//         const isAct = activeCategory === cat.id
//         return (
//           <button key={cat.id} onClick={() => { setActiveCategory(isAct ? null : cat.id); setShowSidebar(false) }}
//             style={{
//               textAlign: 'left', padding: '11px 14px', borderRadius: 10,
//               border: isAct ? `1px solid ${cat.color}35` : '1px solid rgba(232,224,213,0.05)',
//               background: isAct ? `${cat.color}10` : 'transparent',
//               color: isAct ? cat.color : '#5A5550',
//               cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//               transition: 'all 0.2s', fontFamily: "'DM Mono', monospace",
//             }}>
//             <span style={{ fontSize: 13 }}>{cat.icon} {cat.label}</span>
//             {total > 0 && <span style={{ fontSize: 11 }}>{fmtShort(total)}</span>}
//           </button>
//         )
//       })}

//       {/* Add button */}
//       <button onClick={() => {
//         setShowForm(true)
//         setSelectedItem(null)
//         setShowSidebar(false)
//         setEditingExpenseId(null)
//         setForm({
//           name: '',
//           description: '',
//           date: NOW.toISOString().split('T')[0],
//           cost: '',
//           category: 'food',
//         })
//       }}
//         style={{
//           marginTop: 8, padding: '12px', borderRadius: 10,
//           border: '1px dashed rgba(232,168,124,0.25)',
//           background: 'transparent', color: '#E8A87C',
//           cursor: 'pointer', fontSize: 13, letterSpacing: 1,
//           fontFamily: "'DM Mono', monospace",
//         }}>
//         + Add Expense
//       </button>

//       {/* Sync badge */}
//       <div style={{
//         marginTop: 8, padding: '8px 12px', borderRadius: 8,
//         background: 'rgba(130,224,170,0.04)', border: '1px solid rgba(130,224,170,0.1)',
//         display: 'flex', alignItems: 'center', gap: 8,
//       }}>
//         <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#82E0AA', flexShrink: 0 }} />
//         <span style={{ fontSize: 9, letterSpacing: 2, color: '#82E0AA', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
//           Synced to cloud
//         </span>
//       </div>
//     </div>
//   )

//   return (
//     <div style={{
//       minHeight: '100vh', background: '#0A0A0C',
//       fontFamily: "'Cormorant Garamond', Georgia, serif",
//       color: '#E8E0D5',
//     }}>
//       {/* Ambient glow */}
//       <div style={{
//         position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
//         background: `
//           radial-gradient(ellipse at 10% 30%, rgba(232,168,124,0.05) 0%, transparent 50%),
//           radial-gradient(ellipse at 90% 70%, rgba(133,193,233,0.04) 0%, transparent 50%)
//         `,
//       }} />

//       {/* Mobile sidebar overlay */}
//       {isMobile && showSidebar && (
//         <>
//           <div onClick={() => setShowSidebar(false)} style={{
//             position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
//             zIndex: 40, backdropFilter: 'blur(2px)',
//           }} />
//           <div style={{
//             position: 'fixed', top: 0, left: 0, bottom: 0, width: '80%', maxWidth: 300,
//             background: '#111113', zIndex: 50, padding: '24px 16px',
//             borderRight: '1px solid rgba(232,224,213,0.08)',
//             overflowY: 'auto',
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//               <span style={{ fontSize: 10, letterSpacing: 3, color: '#E8A87C', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
//                 Categories
//               </span>
//               <button onClick={() => setShowSidebar(false)} style={{
//                 background: 'none', border: 'none', color: '#5A5550', cursor: 'pointer', fontSize: 20,
//               }}>✕</button>
//             </div>
//             <SidebarContent />
//           </div>
//         </>
//       )}

//       <div style={{ position: 'relative', zIndex: 1, maxWidth: 1140, margin: '0 auto', padding: isMobile ? '0 12px' : '0 20px' }}>

//         {/* ── HEADER ───────────────────────────────────── */}
//         <header style={{
//           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//           paddingTop: isMobile ? 16 : 28, paddingBottom: isMobile ? 14 : 20,
//           borderBottom: '1px solid rgba(232,224,213,0.08)',
//           flexWrap: 'wrap', gap: 10,
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             {/* Hamburger on mobile */}
//             {isMobile && (
//               <button onClick={() => setShowSidebar(true)} style={{
//                 background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(232,224,213,0.1)',
//                 borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#E8A87C', fontSize: 16,
//               }}>☰</button>
//             )}
//             <div>
//               <div style={{ fontSize: 9, letterSpacing: 4, color: '#E8A87C', textTransform: 'uppercase', marginBottom: 2, fontFamily: "'DM Mono', monospace" }}>
//                 Personal Finance
//               </div>
//               <h1 style={{ fontSize: isMobile ? 22 : 30, fontWeight: 400, margin: 0, letterSpacing: -0.5, color: '#F5EFE8' }}>
//                 Budget <em style={{ color: '#E8A87C', fontStyle: 'italic' }}>Ledger</em>
//               </h1>
//             </div>
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20 }}>
//             {/* Save indicator */}
//             <div style={{
//               fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1,
//               color: saveMsg ? '#82E0AA' : 'transparent', transition: 'color 0.3s',
//             }}>{saveMsg}</div>

//             {/* Year total */}
//             {!isMobile && (
//               <div style={{ textAlign: 'right' }}>
//                 <div style={{ fontSize: 9, letterSpacing: 3, color: '#7A7570', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>Year Total</div>
//                 <div style={{ fontSize: 22, color: '#E8A87C' }}>{fmt(yearTotal)}</div>
//               </div>
//             )}

//             {/* User + sign out */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//               <div style={{
//                 width: 32, height: 32, borderRadius: '50%',
//                 background: 'rgba(232,168,124,0.15)', border: '1px solid rgba(232,168,124,0.3)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontSize: 13, color: '#E8A87C', fontFamily: "'DM Mono', monospace", flexShrink: 0,
//               }}>{userInit}</div>
//               {!isMobile && (
//                 <div>
//                   <div style={{ fontSize: 13, color: '#E8E0D5' }}>{userName}</div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                     <button onClick={handleSignOut} style={{
//                       background: 'none', border: 'none', color: '#5A5550',
//                       cursor: 'pointer', fontSize: 11, padding: 0, fontFamily: "'DM Mono', monospace",
//                     }}>Sign out</button>
//                     <span style={{ color: '#3A3530' }}>·</span>
//                     <select
//                       value={currencyCode}
//                       onChange={handleCurrencyChange}
//                       disabled={updatingCurrency}
//                       style={currencySelectStyle}
//                     >
//                       {CURRENCIES.map((currency) => (
//                         <option key={currency.code} value={currency.code} style={{ background: '#0A0A0C', color: '#E8E0D5' }}>
//                           {currency.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               )}
//               {isMobile && (
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                   <select
//                     value={currencyCode}
//                     onChange={handleCurrencyChange}
//                     disabled={updatingCurrency}
//                     style={currencySelectStyle}
//                   >
//                     {CURRENCIES.map((currency) => (
//                       <option key={currency.code} value={currency.code} style={{ background: '#0A0A0C', color: '#E8E0D5' }}>
//                         {currency.code}
//                       </option>
//                     ))}
//                   </select>
//                   <button onClick={handleSignOut} style={{
//                     background: 'none', border: '1px solid rgba(232,224,213,0.1)', borderRadius: 7,
//                     color: '#5A5550', cursor: 'pointer', fontSize: 10, padding: '5px 8px',
//                     fontFamily: "'DM Mono', monospace",
//                   }}>Out</button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* ── YEAR NAVIGATOR ───────────────────────────── */}
//         <div style={{
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           gap: 16, paddingTop: 16, paddingBottom: 4,
//         }}>
//           <button onClick={prevYear} style={{
//             width: 34, height: 34, borderRadius: '50%',
//             border: '1px solid rgba(232,224,213,0.12)',
//             background: 'rgba(255,255,255,0.03)', color: '#E8A87C',
//             cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
//           }}>‹</button>

//           <div style={{ textAlign: 'center', minWidth: 100 }}>
//             <div style={{ fontSize: isMobile ? 24 : 28, color: '#F5EFE8', letterSpacing: 2, fontFamily: "'DM Mono', monospace" }}>
//               {activeYear}
//             </div>
//             {isMobile && (
//               <div style={{ fontSize: 11, color: '#E8A87C', fontFamily: "'DM Mono', monospace" }}>
//                 {fmt(yearTotal)}
//               </div>
//             )}
//           </div>

//           <button onClick={nextYear} disabled={activeYear >= NOW.getFullYear()}
//             style={{
//               width: 34, height: 34, borderRadius: '50%',
//               border: '1px solid rgba(232,224,213,0.12)',
//               background: 'rgba(255,255,255,0.03)',
//               color: activeYear >= NOW.getFullYear() ? '#3A3530' : '#E8A87C',
//               cursor: activeYear >= NOW.getFullYear() ? 'not-allowed' : 'pointer',
//               fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
//             }}>›</button>
//         </div>

//         {/* ── MONTH TABS ───────────────────────────────── */}
//         <div style={{
//           display: 'flex', gap: 5, paddingTop: 12, paddingBottom: 2,
//           overflowX: 'auto', scrollbarWidth: 'none',
//         }}>
//           {MONTHS.map((m, i) => {
//             const mt    = mTotal(i)
//             const isAct = activeMonth === i
//             return (
//               <button key={i} onClick={() => { setActiveMonth(i); setActiveCategory(null); setSelectedItem(null) }}
//                 style={{
//                   flexShrink: 0,
//                   padding: isMobile ? '8px 10px' : '9px 15px',
//                   borderRadius: 10,
//                   border: isAct ? '1px solid rgba(232,168,124,0.4)' : '1px solid rgba(232,224,213,0.07)',
//                   background: isAct ? 'rgba(232,168,124,0.1)' : 'rgba(255,255,255,0.015)',
//                   color: isAct ? '#E8A87C' : '#5A5550',
//                   cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
//                   minWidth: isMobile ? 58 : 72,
//                   fontFamily: "'DM Mono', monospace",
//                 }}>
//                 <div style={{ fontSize: isMobile ? 9 : 10, letterSpacing: 1, textTransform: 'uppercase' }}>
//                   {m.slice(0, 3)}
//                 </div>
//                 {mt > 0 && (
//                   <div style={{ fontSize: 10, marginTop: 2, color: isAct ? '#E8A87C' : '#4A4540' }}>
//                     {fmtShort(mt)}
//                   </div>
//                 )}
//               </button>
//             )
//           })}
//         </div>

//         {/* ── MAIN GRID ────────────────────────────────── */}
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: isMobile ? '1fr' : isTablet ? '200px 1fr' : '250px 1fr',
//           gap: isMobile ? 0 : 20,
//           paddingTop: 20, paddingBottom: 48,
//         }}>

//           {/* SIDEBAR — desktop/tablet only */}
//           {!isMobile && (
//             <div>
//               <div style={{ fontSize: 9, letterSpacing: 3, color: '#5A5550', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>
//                 Categories
//               </div>
//               <SidebarContent />
//             </div>
//           )}

//           {/* RIGHT PANEL */}
//           <div>
//             {/* Panel header */}
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                 {/* Mobile: filter chip */}
//                 {isMobile && (
//                   <button onClick={() => setShowSidebar(true)} style={{
//                     padding: '5px 12px', borderRadius: 20,
//                     border: activeCategory ? `1px solid ${getCat(activeCategory).color}` : '1px solid rgba(232,224,213,0.12)',
//                     background: activeCategory ? `${getCat(activeCategory).color}15` : 'rgba(255,255,255,0.03)',
//                     color: activeCategory ? getCat(activeCategory).color : '#7A7570',
//                     cursor: 'pointer', fontSize: 11, fontFamily: "'DM Mono', monospace",
//                   }}>
//                     {activeCategory ? `${getCat(activeCategory).icon} ${getCat(activeCategory).label}` : '⊞ Filter'}
//                   </button>
//                 )}
//                 <span style={{ fontSize: isMobile ? 18 : 24, color: '#F5EFE8' }}>{MONTHS[activeMonth]}</span>
//                 <span style={{ fontSize: 11, color: '#5A5550', fontFamily: "'DM Mono', monospace" }}>
//                   {filteredExpenses.length} items
//                 </span>
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                 <div style={{ fontSize: isMobile ? 16 : 20, color: '#E8A87C', fontFamily: "'DM Mono', monospace" }}>
//                   {fmt(filteredExpenses.reduce((s, e) => s + parseFloat(e.cost || 0), 0))}
//                 </div>
//                 {/* Mobile add button */}
//                 {isMobile && (
//                   <button onClick={() => {
//                     setShowForm(true)
//                     setSelectedItem(null)
//                     setEditingExpenseId(null)
//                     setForm({
//                       name: '',
//                       description: '',
//                       date: NOW.toISOString().split('T')[0],
//                       cost: '',
//                       category: 'food',
//                     })
//                   }} style={{
//                     padding: '7px 14px', borderRadius: 20,
//                     border: '1px solid rgba(232,168,124,0.3)',
//                     background: 'rgba(232,168,124,0.08)', color: '#E8A87C',
//                     cursor: 'pointer', fontSize: 12, fontFamily: "'DM Mono', monospace",
//                   }}>+ Add</button>
//                 )}
//               </div>
//             </div>

//             {/* ADD FORM */}
//             {showForm && (
//               <div style={{
//                 background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(232,224,213,0.1)',
//                 borderRadius: 14, padding: isMobile ? 16 : 22, marginBottom: 16,
//               }}>
//                 <div style={{ fontSize: 10, letterSpacing: 3, color: '#E8A87C', textTransform: 'uppercase', marginBottom: 14, fontFamily: "'DM Mono', monospace" }}>
//                   {editingExpenseId ? 'Edit Expense' : 'New Expense'}
//                 </div>

//                 {/* Name + Cost */}
//                 <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 10 }}>
//                   <div>
//                     <label style={labelStyle}>Item Name</label>
//                     <input type="text" placeholder="e.g. Netflix" value={form.name}
//                       onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
//                   </div>
//                   <div>
//                     <label style={labelStyle}>Cost ({currencySymbol})</label>
//                     <input type="number" placeholder="0.00" value={form.cost}
//                       onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} style={inputStyle} />
//                   </div>
//                 </div>

//                 {/* Date */}
//                 <div style={{ marginBottom: 10 }}>
//                   <label style={labelStyle}>Date</label>
//                   <input type="date" value={form.date}
//                     onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ ...inputStyle, maxWidth: isMobile ? '100%' : 220 }} />
//                 </div>

//                 {/* Category pills */}
//                 <div style={{ marginBottom: 10 }}>
//                   <label style={labelStyle}>Category</label>
//                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                     {CATEGORIES.map(cat => (
//                       <button key={cat.id} onClick={() => setForm(p => ({ ...p, category: cat.id }))}
//                         style={{
//                           padding: '6px 11px', borderRadius: 20,
//                           border: form.category === cat.id ? `1px solid ${cat.color}` : '1px solid rgba(232,224,213,0.08)',
//                           background: form.category === cat.id ? `${cat.color}18` : 'transparent',
//                           color: form.category === cat.id ? cat.color : '#5A5550',
//                           cursor: 'pointer', fontSize: isMobile ? 11 : 12, fontFamily: "'DM Mono', monospace",
//                         }}>{cat.icon} {cat.label}</button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div style={{ marginBottom: 14 }}>
//                   <label style={labelStyle}>Description (optional)</label>
//                   <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
//                     rows={2} style={{ ...inputStyle, resize: 'none' }} />
//                 </div>

//                 <div style={{ display: 'flex', gap: 8 }}>
//                   <button onClick={editingExpenseId ? handleUpdateExpense : handleAddExpense} disabled={saving} style={{
//                     padding: '10px 22px', borderRadius: 8, border: 'none',
//                     background: saving ? 'rgba(232,168,124,0.5)' : '#E8A87C',
//                     color: '#0A0A0C', cursor: saving ? 'not-allowed' : 'pointer',
//                     fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
//                     fontFamily: "'DM Mono', monospace",
//                   }}>{saving ? (editingExpenseId ? 'Updating...' : 'Saving...') : (editingExpenseId ? 'Update' : 'Save')}</button>
//                   <button onClick={() => { setShowForm(false); setEditingExpenseId(null) }} style={{
//                     padding: '10px 22px', borderRadius: 8,
//                     border: '1px solid rgba(232,224,213,0.1)',
//                     background: 'transparent', color: '#5A5550',
//                     cursor: 'pointer', fontSize: 12, fontFamily: "'DM Mono', monospace",
//                   }}>Cancel</button>
//                 </div>
//               </div>
//             )}

//             {/* EXPENSE LIST */}
//             {loading ? (
//               <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4A4540', fontFamily: "'DM Mono', monospace" }}>
//                 <div style={{ fontSize: 28, marginBottom: 10 }}>◎</div>
//                 <div style={{ fontSize: 11, letterSpacing: 2 }}>Loading {activeYear} expenses...</div>
//               </div>
//             ) : filteredExpenses.length === 0 ? (
//               <div style={{
//                 textAlign: 'center', padding: '50px 20px',
//                 border: '1px dashed rgba(232,224,213,0.07)', borderRadius: 14, color: '#3A3530',
//               }}>
//                 <div style={{ fontSize: 32, marginBottom: 10 }}>◎</div>
//                 <div style={{ fontSize: 15 }}>No expenses for {MONTHS[activeMonth]} {activeYear}</div>
//                 <div style={{ fontSize: 11, marginTop: 6, fontFamily: "'DM Mono', monospace", color: '#3A3530' }}>
//                   {isMobile ? 'Tap "+ Add" above to begin' : 'Click "+ Add Expense" to begin'}
//                 </div>
//               </div>
//             ) : (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
//                 {filteredExpenses.map(exp => {
//                   const cat    = getCat(exp.category)
//                   const isSel  = selectedItem?.id === exp.id
//                   return (
//                     <div key={exp.id} onClick={() => setSelectedItem(isSel ? null : exp)}
//                       style={{
//                         borderRadius: 12, cursor: 'pointer', overflow: 'hidden',
//                         border: isSel ? `1px solid ${cat.color}45` : '1px solid rgba(232,224,213,0.06)',
//                         background: isSel ? `${cat.color}0A` : 'rgba(255,255,255,0.015)',
//                         transition: 'all 0.2s',
//                       }}>
//                       <div style={{ display: 'flex', alignItems: 'center', padding: isMobile ? '11px 13px' : '12px 15px', gap: 12 }}>
//                         <div style={{
//                           width: isMobile ? 34 : 38, height: isMobile ? 34 : 38,
//                           borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           background: `${cat.color}15`, fontSize: isMobile ? 16 : 18, flexShrink: 0,
//                         }}>{cat.icon}</div>
//                         <div style={{ flex: 1, minWidth: 0 }}>
//                           <div style={{ fontSize: isMobile ? 14 : 16, color: '#E8E0D5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                             {exp.name}
//                           </div>
//                           <div style={{ fontSize: 11, color: '#4A4540', marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
//                             {cat.label} · {exp.date}
//                           </div>
//                         </div>
//                         <div style={{ fontSize: isMobile ? 14 : 17, color: cat.color, flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>
//                           {fmt(exp.cost)}
//                         </div>
//                       </div>

//                       {/* Expanded detail */}
//                       {isSel && (
//                         <div style={{ padding: `0 13px 13px ${isMobile ? 13 : 66}px`, borderTop: `1px solid ${cat.color}18` }}>
//                           {exp.description && (
//                             <p style={{ fontSize: 13, color: '#6A6560', margin: '10px 0', lineHeight: 1.6 }}>
//                               {exp.description}
//                             </p>
//                           )}
//                           <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
//                             <div style={{ fontSize: 11, color: '#4A4540', padding: '4px 10px', border: '1px solid rgba(232,224,213,0.07)', borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>
//                               📅 {exp.date}
//                             </div>
//                             <div style={{ fontSize: 11, color: cat.color, padding: '4px 10px', border: `1px solid ${cat.color}28`, borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>
//                               {cat.icon} {cat.label}
//                             </div>
//                             <button onClick={e => {
//                               e.stopPropagation()
//                               setEditingExpenseId(exp.id)
//                               setForm({
//                                 name: exp.name || '',
//                                 description: exp.description || '',
//                                 date: exp.date || NOW.toISOString().split('T')[0],
//                                 cost: String(exp.cost ?? ''),
//                                 category: exp.category || 'other',
//                               })
//                               setShowForm(true)
//                             }} style={{
//                               padding: '4px 12px', borderRadius: 6,
//                               border: '1px solid rgba(133,193,233,0.35)',
//                               background: 'transparent', color: '#85C1E9',
//                               cursor: 'pointer', fontSize: 11,
//                               fontFamily: "'DM Mono', monospace",
//                             }}>Edit</button>
//                             <button onClick={e => { e.stopPropagation(); handleDelete(exp.id) }} style={{
//                               padding: '4px 12px', borderRadius: 6,
//                               border: '1px solid rgba(241,148,138,0.25)',
//                               background: 'transparent', color: '#F1948A',
//                               cursor: 'pointer', fontSize: 11,
//                               fontFamily: "'DM Mono', monospace", marginLeft: 'auto',
//                             }}>Delete</button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )
//                 })}
//               </div>
//             )}

//             {/* BREAKDOWN BAR */}
//             {monthExpenses.length > 0 && !activeCategory && (
//               <div style={{ marginTop: 28 }}>
//                 <div style={{ fontSize: 9, letterSpacing: 3, color: '#5A5550', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>
//                   {MONTHS[activeMonth]} {activeYear} Breakdown
//                 </div>
//                 <div style={{ display: 'flex', gap: 2, height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
//                   {CATEGORIES.map(cat => {
//                     const total = (grouped[cat.id] || []).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
//                     const pct   = monthTotal > 0 ? (total / monthTotal) * 100 : 0
//                     if (pct === 0) return null
//                     return <div key={cat.id} style={{ width: `${pct}%`, background: cat.color }} />
//                   })}
//                 </div>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 14px' }}>
//                   {CATEGORIES.filter(cat => grouped[cat.id]?.length > 0).map(cat => {
//                     const total = (grouped[cat.id] || []).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
//                     const pct   = monthTotal > 0 ? (total / monthTotal * 100).toFixed(1) : 0
//                     return (
//                       <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5A5550', fontFamily: "'DM Mono', monospace" }}>
//                         <div style={{ width: 7, height: 7, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
//                         {isMobile ? cat.icon : cat.label}: <span style={{ color: cat.color }}>{pct}%</span>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import logo from '../images/LEDGER-removebg-preview.png'

const CATEGORIES = [
  { id: 'food',          label: 'Food & Dining',    icon: '🍽️', color: '#E8A87C' },
  { id: 'subscriptions', label: 'Subscriptions',    icon: '📱', color: '#85C1E9' },
  { id: 'bills',         label: 'Bills & Utilities', icon: '⚡', color: '#F1948A' },
  { id: 'transport',     label: 'Transport',         icon: '🚗', color: '#82E0AA' },
  { id: 'health',        label: 'Health',            icon: '💊', color: '#BB8FCE' },
  { id: 'entertainment', label: 'Entertainment',     icon: '🎬', color: '#F9E79F' },
  { id: 'shopping',      label: 'Shopping',          icon: '🛍️', color: '#F0B27A' },
  { id: 'other',         label: 'Other',             icon: '📦', color: '#AEB6BF' },
]

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'MKD', symbol: 'ден', label: 'Macedonian Denar' },
  { code: 'CHF', symbol: 'CHF', label: 'Swiss Franc' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'JPY', symbol: 'JPY', label: 'Japanese Yen' },
]

// Static FX table to keep conversion available without external APIs.
const FX_TO_USD = {
  USD: 1,
  EUR: 1.09,
  GBP: 1.28,
  MKD: 0.0177,
  CHF: 1.12,
  CAD: 0.74,
  AUD: 0.66,
  JPY: 0.0067,
}

const NOW = new Date()

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const h = () => setWidth(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return width
}

export default function BudgetPage({ session }) {
  const width    = useWindowWidth()
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024

  const user           = session.user
  const userInit       = (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()
  const userName       = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const currencySymbol = user.user_metadata?.currency_symbol || '$'
  const currencyCode   = user.user_metadata?.currency || 'USD'

  const [expenses,          setExpenses]          = useState([])
  const [salaries,          setSalaries]          = useState({})
  const [loading,           setLoading]           = useState(true)
  const [saving,            setSaving]            = useState(false)
  const [savingSalary,      setSavingSalary]      = useState(false)
  const [saveMsg,           setSaveMsg]           = useState('')
  const [activeMonth,       setActiveMonth]       = useState(NOW.getMonth())
  const [activeYear,        setActiveYear]        = useState(NOW.getFullYear())
  const [activeCategory,    setActiveCategory]    = useState(null)
  const [showForm,          setShowForm]          = useState(false)
  const [showSidebar,       setShowSidebar]       = useState(false)
  const [showYearlySummary, setShowYearlySummary] = useState(false)
  const [selectedItem,      setSelectedItem]      = useState(null)
  const [salaryInput,       setSalaryInput]       = useState('')
  const [salaryCurrency,    setSalaryCurrency]    = useState(currencyCode)
  const [displayCurrency,   setDisplayCurrency]   = useState(currencyCode)
  const [editingSalary,     setEditingSalary]     = useState(false)
  const [editingExpenseId,  setEditingExpenseId]  = useState(null)
  const [form, setForm] = useState({
    name: '', description: '',
    date: NOW.toISOString().split('T')[0],
    cost: '', category: 'food', costCurrency: currencyCode,
  })

  const toNumber = (v) => parseFloat(v || 0)
  const convertCurrency = useCallback((amount, fromCode, toCode) => {
    const n = toNumber(amount)
    if (!Number.isFinite(n)) return 0
    if (fromCode === toCode) return n

    const fromRate = FX_TO_USD[fromCode] || 1
    const toRate = FX_TO_USD[toCode] || 1
    const usdAmount = n * fromRate
    return usdAmount / toRate
  }, [])

  const displayCurrencyMeta = CURRENCIES.find(c => c.code === displayCurrency)
  const displaySymbol = displayCurrencyMeta?.symbol || (displayCurrency === currencyCode ? currencySymbol : displayCurrency)
  const fmt      = n => {
    const converted = convertCurrency(n, currencyCode, displayCurrency)
    return `${displaySymbol}${converted.toFixed(2)}`
  }
  const fmtShort = n => {
    const v = convertCurrency(n, currencyCode, displayCurrency)
    if (v >= 1000) return `${displaySymbol}${(v / 1000).toFixed(1)}k`
    return `${displaySymbol}${v.toFixed(0)}`
  }

  const sKey = (month, year) => `${month}-${year}`
  const activeSalary = salaries[sKey(activeMonth, activeYear)] || 0

  // ── fetch ────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('expenses').select('*')
      .eq('user_id', user.id).eq('year', activeYear)
      .order('date', { ascending: false })
    if (!error && data) setExpenses(data)
    setLoading(false)
  }, [user.id, activeYear])

  const fetchSalaries = useCallback(async () => {
    const { data, error } = await supabase
      .from('salaries').select('*')
      .eq('user_id', user.id).eq('year', activeYear)
    if (!error && data) {
      const map = {}
      data.forEach(s => { map[sKey(s.month, s.year)] = parseFloat(s.amount) })
      setSalaries(map)
    }
  }, [user.id, activeYear])

  useEffect(() => { fetchExpenses(); fetchSalaries() }, [fetchExpenses, fetchSalaries])

  useEffect(() => {
    setSalaryInput(activeSalary > 0 ? String(activeSalary) : '')
    setSalaryCurrency(currencyCode)
    setEditingSalary(false)
  }, [activeMonth, activeYear])

  useEffect(() => {
    setForm(prev => ({ ...prev, costCurrency: prev.costCurrency || currencyCode }))
    setDisplayCurrency(currencyCode)
  }, [currencyCode])

  function resetExpenseForm() {
    setForm({
      name: '',
      description: '',
      date: NOW.toISOString().split('T')[0],
      cost: '',
      category: 'food',
      costCurrency: currencyCode,
    })
    setEditingExpenseId(null)
  }

  function handleSalaryCurrencyChange(nextCurrency) {
    if (nextCurrency === salaryCurrency) return
    const nextValue = salaryInput
      ? convertCurrency(salaryInput, salaryCurrency, nextCurrency).toFixed(2)
      : ''
    setSalaryInput(nextValue)
    setSalaryCurrency(nextCurrency)
  }

  function handleExpenseCurrencyChange(nextCurrency) {
    if (nextCurrency === form.costCurrency) return
    setForm(prev => ({
      ...prev,
      cost: prev.cost ? convertCurrency(prev.cost, prev.costCurrency, nextCurrency).toFixed(2) : '',
      costCurrency: nextCurrency,
    }))
  }

  // ── save salary ──────────────────────────────────────
  async function handleSaveSalary() {
    const amount = parseFloat(salaryInput)
    if (isNaN(amount) || amount < 0) return
    const convertedAmount = convertCurrency(amount, salaryCurrency, currencyCode)
    setSavingSalary(true)
    const { error } = await supabase.from('salaries').upsert(
      { user_id: user.id, month: activeMonth, year: activeYear, amount: convertedAmount },
      { onConflict: 'user_id,month,year' }
    )
    if (!error) {
      setSalaries(prev => ({ ...prev, [sKey(activeMonth, activeYear)]: convertedAmount }))
      setEditingSalary(false)
      flash(salaryCurrency !== currencyCode ? `✓ Salary saved (${salaryCurrency} → ${currencyCode})` : '✓ Salary saved')
    }
    setSavingSalary(false)
  }

  // ── year nav ─────────────────────────────────────────
  function prevYear() { setActiveYear(y => y - 1); setActiveCategory(null); setSelectedItem(null) }
  function nextYear() {
    if (activeYear < NOW.getFullYear()) { setActiveYear(y => y + 1); setActiveCategory(null); setSelectedItem(null) }
  }

  // ── expenses CRUD ────────────────────────────────────
  function startAddExpense() {
    setShowForm(true)
    setSelectedItem(null)
    resetExpenseForm()
  }

  function startEditExpense(expense) {
    setEditingExpenseId(expense.id)
    setShowForm(true)
    setSelectedItem(null)
    setForm({
      name: expense.name || '',
      description: expense.description || '',
      date: expense.date,
      cost: toNumber(expense.cost).toFixed(2),
      category: expense.category || 'food',
      costCurrency: currencyCode,
    })
  }

  async function handleSaveExpense() {
    if (!form.name || !form.cost || !form.date) return
    setSaving(true)
    const d = new Date(form.date + 'T12:00:00')
    const sourceCurrency = form.costCurrency || currencyCode
    const convertedCost = convertCurrency(form.cost, sourceCurrency, currencyCode)
    const payload = {
      user_id: user.id,
      name: form.name,
      description: form.description,
      category: form.category,
      cost: convertedCost,
      date: form.date,
      month: d.getMonth(),
      year: d.getFullYear(),
    }

    if (editingExpenseId) {
      const { data, error } = await supabase
        .from('expenses')
        .update(payload)
        .eq('id', editingExpenseId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (!error && data) {
        setExpenses(prev => prev.map(exp => exp.id === editingExpenseId ? data : exp))
        setSelectedItem(data)
        setShowForm(false)
        resetExpenseForm()
        flash(sourceCurrency !== currencyCode ? `✓ Updated (${sourceCurrency} → ${currencyCode})` : '✓ Updated')
      }
    } else {
      const { data, error } = await supabase.from('expenses').insert([payload]).select().single()
      if (!error && data) {
        if (d.getFullYear() === activeYear) setExpenses(prev => [data, ...prev])
        setShowForm(false)
        resetExpenseForm()
        flash(sourceCurrency !== currencyCode ? `✓ Saved (${sourceCurrency} → ${currencyCode})` : '✓ Saved')
      }
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) { setExpenses(prev => prev.filter(e => e.id !== id)); setSelectedItem(null); flash('✓ Deleted') }
  }

  function flash(msg) { setSaveMsg(msg); setTimeout(() => setSaveMsg(''), 2200) }
  async function handleSignOut() { await supabase.auth.signOut() }

  // ── derived ──────────────────────────────────────────
  const monthExpenses = useMemo(() => expenses.filter(e => e.month === activeMonth), [expenses, activeMonth])
  const grouped = useMemo(() => {
    const g = {}
    monthExpenses.forEach(e => { if (!g[e.category]) g[e.category] = []; g[e.category].push(e) })
    return g
  }, [monthExpenses])
  const monthTotal    = useMemo(() => monthExpenses.reduce((s, e) => s + parseFloat(e.cost || 0), 0), [monthExpenses])
  const yearExpenses  = useMemo(() => expenses.reduce((s, e) => s + parseFloat(e.cost || 0), 0), [expenses])
  const yearSalary    = useMemo(() => Object.values(salaries).reduce((s, v) => s + v, 0), [salaries])
  const yearProfit    = yearSalary - yearExpenses
  const monthProfit   = activeSalary - monthTotal
  const savingsRate   = activeSalary > 0 ? Math.max(0, Math.round((monthProfit / activeSalary) * 100)) : null

  const filteredExpenses = activeCategory ? monthExpenses.filter(e => e.category === activeCategory) : monthExpenses
  const getCat    = id  => CATEGORIES.find(c => c.id === id) || CATEGORIES[7]
  const mTotal    = idx => expenses.filter(e => e.month === idx).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
  const mSalary   = idx => salaries[sKey(idx, activeYear)] || 0

  const yearlySummary = useMemo(() =>
    MONTHS.map((name, idx) => {
      const exp = mTotal(idx); const sal = mSalary(idx)
      return { name, idx, exp, sal, profit: sal - exp, hasData: exp > 0 || sal > 0 }
    })
  , [expenses, salaries])

  // ── styles ───────────────────────────────────────────
  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(232,224,213,0.12)', borderRadius: 8,
    padding: '10px 12px', color: '#E8E0D5', fontSize: 14,
    fontFamily: "'DM Mono', monospace", outline: 'none', boxSizing: 'border-box', colorScheme: 'dark',
  }
  const labelStyle = {
    display: 'block', fontSize: 9, letterSpacing: 2, color: '#5A5550',
    textTransform: 'uppercase', marginBottom: 6, fontFamily: "'DM Mono', monospace",
  }

  // ── sidebar ──────────────────────────────────────────
  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <button onClick={() => { setActiveCategory(null); setShowSidebar(false) }}
        style={{
          textAlign: 'left', padding: '11px 14px', borderRadius: 10,
          border: !activeCategory ? '1px solid rgba(232,224,213,0.2)' : '1px solid rgba(232,224,213,0.05)',
          background: !activeCategory ? 'rgba(232,224,213,0.06)' : 'transparent',
          color: !activeCategory ? '#E8E0D5' : '#5A5550',
          cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: "'DM Mono', monospace",
        }}>
        <span style={{ fontSize: 13 }}>✦ All Expenses</span>
        <span style={{ fontSize: 12, color: '#E8A87C' }}>{fmt(monthTotal)}</span>
      </button>
      {CATEGORIES.map(cat => {
        const total = (grouped[cat.id] || []).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
        const isAct = activeCategory === cat.id
        return (
          <button key={cat.id} onClick={() => { setActiveCategory(isAct ? null : cat.id); setShowSidebar(false) }}
            style={{
              textAlign: 'left', padding: '11px 14px', borderRadius: 10,
              border: isAct ? `1px solid ${cat.color}35` : '1px solid rgba(232,224,213,0.05)',
              background: isAct ? `${cat.color}10` : 'transparent', color: isAct ? cat.color : '#5A5550',
              cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.2s', fontFamily: "'DM Mono', monospace",
            }}>
            <span style={{ fontSize: 13 }}>{cat.icon} {cat.label}</span>
            {total > 0 && <span style={{ fontSize: 11 }}>{fmtShort(total)}</span>}
          </button>
        )
      })}
      <button onClick={() => { startAddExpense(); setShowSidebar(false) }}
        style={{
          marginTop: 8, padding: '12px', borderRadius: 10,
          border: '1px dashed rgba(232,168,124,0.25)', background: 'transparent', color: '#E8A87C',
          cursor: 'pointer', fontSize: 13, letterSpacing: 1, fontFamily: "'DM Mono', monospace",
        }}>+ Add Expense</button>
      <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(130,224,170,0.04)', border: '1px solid rgba(130,224,170,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#82E0AA', flexShrink: 0 }} />
        <span style={{ fontSize: 9, letterSpacing: 2, color: '#82E0AA', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>Synced to cloud</span>
      </div>
    </div>
  )
  

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0C', fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#E8E0D5' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: `radial-gradient(ellipse at 10% 30%, rgba(232,168,124,0.05) 0%, transparent 50%), radial-gradient(ellipse at 90% 70%, rgba(133,193,233,0.04) 0%, transparent 50%)` }} />

      {/* Mobile drawer */}
      {isMobile && showSidebar && (
        <>
          <div onClick={() => setShowSidebar(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '80%', maxWidth: 300, background: '#111113', zIndex: 50, padding: '24px 16px', borderRight: '1px solid rgba(232,224,213,0.08)', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 10, letterSpacing: 3, color: '#E8A87C', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>Categories</span>
              <button onClick={() => setShowSidebar(false)} style={{ background: 'none', border: 'none', color: '#5A5550', cursor: 'pointer', fontSize: 20 }}>✕</button>
            </div>
            <SidebarContent />
          </div>
        </>
      )}

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1140, margin: '0 auto', padding: isMobile ? '0 12px' : '0 20px' }}>

        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: isMobile ? 16 : 28, paddingBottom: isMobile ? 14 : 20, borderBottom: '1px solid rgba(232,224,213,0.08)', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button onClick={() => setShowSidebar(true)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(232,224,213,0.1)', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#E8A87C', fontSize: 16 }}>☰</button>
            )}
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: '#E8A87C', textTransform: 'uppercase', marginBottom: 2, fontFamily: "'DM Mono', monospace" }}>Personal Finance</div>
              <h1 style={{ fontSize: isMobile ? 22 : 30, fontWeight: 400, margin: 0, letterSpacing: -0.5, color: '#F5EFE8' }}>
                Ledge<em style={{ color: '#E8A87C', fontStyle: 'italic' }}>r</em>
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20 }}>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 1, color: saveMsg ? '#82E0AA' : 'transparent', transition: 'color 0.3s' }}>{saveMsg}</div>
            {!isMobile && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: '#7A7570', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>Year Spent</div>
                <div style={{ fontSize: 22, color: '#E8A87C' }}>{fmt(yearExpenses)}</div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(232,168,124,0.15)', border: '1px solid rgba(232,168,124,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#E8A87C', fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{userInit}</div>
	              {!isMobile && (
	                <div>
	                  <div style={{ fontSize: 13, color: '#E8E0D5' }}>{userName}</div>
	                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
	                    <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: '#5A5550', cursor: 'pointer', fontSize: 11, padding: 0, fontFamily: "'DM Mono', monospace" }}>Sign out</button>
	                    <span style={{ color: '#3A3530' }}>·</span>
	                    <span style={{ fontSize: 10, color: '#7A7570', fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>Base {currencyCode}</span>
	                    <select
	                      value={displayCurrency}
	                      onChange={e => setDisplayCurrency(e.target.value)}
	                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(232,224,213,0.14)', borderRadius: 6, color: '#E8A87C', fontSize: 10, padding: '2px 8px', fontFamily: "'DM Mono', monospace" }}
	                    >
	                      {CURRENCIES.map(c => (
	                        <option key={c.code} value={c.code} style={{ background: '#0A0A0C', color: '#E8E0D5' }}>
	                           {c.code}
	                        </option>
	                      ))}
	                    </select>
	                  </div>
	                </div>
	              )}
	              {isMobile && (
	                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
	                  <select
	                    value={displayCurrency}
	                    onChange={e => setDisplayCurrency(e.target.value)}
	                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(232,224,213,0.12)', borderRadius: 7, color: '#E8A87C', fontSize: 10, padding: '5px 8px', fontFamily: "'DM Mono', monospace" }}
	                  >
	                    {CURRENCIES.map(c => (
	                      <option key={c.code} value={c.code} style={{ background: '#0A0A0C', color: '#E8E0D5' }}>
	                        {c.code}
	                      </option>
	                    ))}
	                  </select>
	                  <button onClick={handleSignOut} style={{ background: 'none', border: '1px solid rgba(232,224,213,0.1)', borderRadius: 7, color: '#5A5550', cursor: 'pointer', fontSize: 10, padding: '5px 8px', fontFamily: "'DM Mono', monospace" }}>Out</button>
	                </div>
	              )}
	            </div>
          </div>
        </header>

        {/* YEAR NAVIGATOR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 16, paddingBottom: 4 }}>
          <button onClick={prevYear} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(232,224,213,0.12)', background: 'rgba(255,255,255,0.03)', color: '#E8A87C', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <div style={{ textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontSize: isMobile ? 24 : 28, color: '#F5EFE8', letterSpacing: 2, fontFamily: "'DM Mono', monospace" }}>{activeYear}</div>
            {isMobile && <div style={{ fontSize: 11, color: '#E8A87C', fontFamily: "'DM Mono', monospace" }}>{fmt(yearExpenses)}</div>}
          </div>
          <button onClick={nextYear} disabled={activeYear >= NOW.getFullYear()} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(232,224,213,0.12)', background: 'rgba(255,255,255,0.03)', color: activeYear >= NOW.getFullYear() ? '#3A3530' : '#E8A87C', cursor: activeYear >= NOW.getFullYear() ? 'not-allowed' : 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>

        {/* MONTH TABS */}
        <div style={{ display: 'flex', gap: 5, paddingTop: 12, paddingBottom: 2, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {MONTHS.map((m, i) => {
            const mt = mTotal(i); const ms = mSalary(i); const isAct = activeMonth === i
            return (
              <button key={i} onClick={() => { setActiveMonth(i); setActiveCategory(null); setSelectedItem(null) }}
                style={{ flexShrink: 0, padding: isMobile ? '8px 10px' : '9px 15px', borderRadius: 10, border: isAct ? '1px solid rgba(232,168,124,0.4)' : '1px solid rgba(232,224,213,0.07)', background: isAct ? 'rgba(232,168,124,0.1)' : 'rgba(255,255,255,0.015)', color: isAct ? '#E8A87C' : '#5A5550', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', minWidth: isMobile ? 58 : 72, fontFamily: "'DM Mono', monospace" }}>
                <div style={{ fontSize: isMobile ? 9 : 10, letterSpacing: 1, textTransform: 'uppercase' }}>{m.slice(0, 3)}</div>
                {mt > 0 && <div style={{ fontSize: 10, marginTop: 2, color: isAct ? '#E8A87C' : '#4A4540' }}>{fmtShort(mt)}</div>}
                {ms > 0 && <div style={{ fontSize: 9, marginTop: 1, color: ms - mt >= 0 ? '#82E0AA' : '#F1948A' }}>{ms - mt >= 0 ? '+' : ''}{fmtShort(ms - mt)}</div>}
              </button>
            )
          })}
        </div>

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '200px 1fr' : '250px 1fr', gap: isMobile ? 0 : 20, paddingTop: 20, paddingBottom: 48 }}>

          {!isMobile && (
            <div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: '#5A5550', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>Categories</div>
              <SidebarContent />
            </div>
          )}

          <div>
            {/* ── SALARY + PROFIT CARDS ─────────────── */}
	            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 18 }}>

              {/* SALARY CARD */}
              <div style={{ borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(130,224,170,0.15)', background: 'rgba(130,224,170,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 9, letterSpacing: 3, color: '#82E0AA', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
                    💰 Salary — {MONTHS[activeMonth].slice(0,3)} {activeYear}
                  </div>
                  {!editingSalary && (
                    <button onClick={() => { setEditingSalary(true); setSalaryInput(activeSalary > 0 ? String(activeSalary) : ''); setSalaryCurrency(currencyCode) }}
                      style={{ background: 'none', border: '1px solid rgba(130,224,170,0.2)', borderRadius: 6, color: '#82E0AA', cursor: 'pointer', fontSize: 10, padding: '3px 10px', fontFamily: "'DM Mono', monospace" }}>
                      {activeSalary > 0 ? 'Edit' : '+ Set'}
                    </button>
                  )}
                </div>
                {editingSalary ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                    <input type="number" placeholder="Enter salary..." value={salaryInput}
                      onChange={e => setSalaryInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSaveSalary()}
                      autoFocus
                      style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(130,224,170,0.3)', borderRadius: 8, padding: '8px 12px', color: '#E8E0D5', fontSize: 14, fontFamily: "'DM Mono', monospace", outline: 'none', colorScheme: 'dark' }}
                    />
                    <select
                      value={salaryCurrency}
                      onChange={e => handleSalaryCurrencyChange(e.target.value)}
                      style={{ ...inputStyle, maxWidth: isMobile ? '100%' : 120, border: '1px solid rgba(130,224,170,0.3)', background: 'rgba(255,255,255,0.05)' }}
                    >
                      {CURRENCIES.map(c => (
                        <option key={c.code} value={c.code} style={{ background: '#0A0A0C', color: '#E8E0D5' }}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                    <button onClick={handleSaveSalary} disabled={savingSalary} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#82E0AA', color: '#0A0A0C', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                      {savingSalary ? '...' : '✓'}
                    </button>
                    <button onClick={() => setEditingSalary(false)} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(232,224,213,0.1)', background: 'transparent', color: '#5A5550', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Mono', monospace" }}>✕</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: isMobile ? 24 : 28, color: '#82E0AA', fontFamily: "'DM Mono', monospace", letterSpacing: -1 }}>
                      {activeSalary > 0 ? fmt(activeSalary) : <span style={{ color: '#3A3530', fontSize: 16 }}>Not set</span>}
                    </div>
                    {activeSalary > 0 && (
                      <div style={{ fontSize: 11, color: '#5A5550', marginTop: 4, fontFamily: "'DM Mono', monospace" }}>
                        Spent {fmt(monthTotal)} · {Math.round((monthTotal / activeSalary) * 100)}% of income
                      </div>
                    )}
                  </div>
                )}
              </div>

	              {/* PROFIT / LOSS CARD */}
	              <div style={{ borderRadius: 14, padding: '16px 18px', border: `1px solid ${activeSalary > 0 && monthProfit >= 0 ? 'rgba(133,193,233,0.2)' : activeSalary > 0 ? 'rgba(241,148,138,0.2)' : 'rgba(232,224,213,0.08)'}`, background: activeSalary > 0 && monthProfit >= 0 ? 'rgba(133,193,233,0.04)' : activeSalary > 0 ? 'rgba(241,148,138,0.04)' : 'rgba(255,255,255,0.01)' }}>
                <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10, fontFamily: "'DM Mono', monospace", color: activeSalary > 0 ? (monthProfit >= 0 ? '#85C1E9' : '#F1948A') : '#5A5550' }}>
                  {activeSalary > 0 ? (monthProfit >= 0 ? '📈 Profit' : '📉 Deficit') : '📊 Profit / Loss'} — {MONTHS[activeMonth].slice(0,3)} {activeYear}
                </div>
                {activeSalary > 0 ? (
                  <>
                    <div style={{ fontSize: isMobile ? 24 : 28, fontFamily: "'DM Mono', monospace", letterSpacing: -1, color: monthProfit >= 0 ? '#85C1E9' : '#F1948A' }}>
                      {monthProfit >= 0 ? '+' : ''}{fmt(monthProfit)}
                    </div>
                    <div style={{ fontSize: 11, color: '#5A5550', marginTop: 4, fontFamily: "'DM Mono', monospace" }}>
                      {monthProfit >= 0 ? `Savings rate: ${savingsRate}%` : `Overspent by ${fmt(Math.abs(monthProfit))}`}
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 2, width: `${Math.min(100, (monthTotal / activeSalary) * 100)}%`, background: monthProfit >= 0 ? 'linear-gradient(90deg, #82E0AA, #85C1E9)' : 'linear-gradient(90deg, #E8A87C, #F1948A)', transition: 'width 0.4s ease' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: '#4A4540', fontFamily: "'DM Mono', monospace" }}>
                        <span>0</span><span>{fmt(activeSalary)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: '#3A3530', fontFamily: "'DM Mono', monospace", paddingTop: 4 }}>
                    Set your salary to see profit / loss
                  </div>
	                )}
	              </div>
		            </div>

	            {/* PANEL HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {isMobile && (
                  <button onClick={() => setShowSidebar(true)} style={{ padding: '5px 12px', borderRadius: 20, border: activeCategory ? `1px solid ${getCat(activeCategory).color}` : '1px solid rgba(232,224,213,0.12)', background: activeCategory ? `${getCat(activeCategory).color}15` : 'rgba(255,255,255,0.03)', color: activeCategory ? getCat(activeCategory).color : '#7A7570', cursor: 'pointer', fontSize: 11, fontFamily: "'DM Mono', monospace" }}>
                    {activeCategory ? `${getCat(activeCategory).icon} ${getCat(activeCategory).label}` : '⊞ Filter'}
                  </button>
                )}
                <span style={{ fontSize: isMobile ? 18 : 24, color: '#F5EFE8' }}>{MONTHS[activeMonth]}</span>
                <span style={{ fontSize: 11, color: '#5A5550', fontFamily: "'DM Mono', monospace" }}>{filteredExpenses.length} items</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: isMobile ? 16 : 20, color: '#E8A87C', fontFamily: "'DM Mono', monospace" }}>
                  {fmt(filteredExpenses.reduce((s, e) => s + parseFloat(e.cost || 0), 0))}
                </div>
                {isMobile && (
	                  <button onClick={startAddExpense} style={{ padding: '7px 14px', borderRadius: 20, border: '1px solid rgba(232,168,124,0.3)', background: 'rgba(232,168,124,0.08)', color: '#E8A87C', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Mono', monospace" }}>+ Add</button>
	                )}
	              </div>
	            </div>

            {/* ADD FORM */}
            {showForm && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(232,224,213,0.1)', borderRadius: 14, padding: isMobile ? 16 : 22, marginBottom: 16 }}>
	                <div style={{ fontSize: 10, letterSpacing: 3, color: '#E8A87C', textTransform: 'uppercase', marginBottom: 14, fontFamily: "'DM Mono', monospace" }}>{editingExpenseId ? 'Edit Expense' : 'New Expense'}</div>
	                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 10 }}>
	                  <div>
	                    <label style={labelStyle}>Item Name</label>
	                    <input type="text" placeholder="e.g. Netflix" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
	                  </div>
	                  <div>
	                    <label style={labelStyle}>Cost</label>
	                    <input type="number" placeholder="0.00" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} style={inputStyle} />
	                  </div>
	                </div>
	                <div style={{ marginBottom: 10, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
	                  <div>
	                    <label style={labelStyle}>Expense Currency</label>
		                    <select value={form.costCurrency} onChange={e => handleExpenseCurrencyChange(e.target.value)} style={inputStyle}>
	                      {CURRENCIES.map(c => (
	                        <option key={c.code} value={c.code} style={{ background: '#0A0A0C', color: '#E8E0D5' }}>
	                          {c.code} · {c.label}
	                        </option>
	                      ))}
	                    </select>
	                  </div>
	                  <div style={{ alignSelf: 'end', fontSize: 11, color: '#5A5550', fontFamily: "'DM Mono', monospace", paddingBottom: 2 }}>
	                    Stored as {currencyCode} (converted automatically)
	                  </div>
	                </div>
	                <div style={{ marginBottom: 10 }}>
	                  <label style={labelStyle}>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={{ ...inputStyle, maxWidth: isMobile ? '100%' : 220 }} />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={labelStyle}>Category</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => setForm(p => ({ ...p, category: cat.id }))}
                        style={{ padding: '6px 11px', borderRadius: 20, border: form.category === cat.id ? `1px solid ${cat.color}` : '1px solid rgba(232,224,213,0.08)', background: form.category === cat.id ? `${cat.color}18` : 'transparent', color: form.category === cat.id ? cat.color : '#5A5550', cursor: 'pointer', fontSize: isMobile ? 11 : 12, fontFamily: "'DM Mono', monospace" }}>
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Description (optional)</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
	                  <button onClick={handleSaveExpense} disabled={saving} style={{ padding: '10px 22px', borderRadius: 8, border: 'none', background: saving ? 'rgba(232,168,124,0.5)' : '#E8A87C', color: '#0A0A0C', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{saving ? 'Saving...' : editingExpenseId ? 'Update' : 'Save'}</button>
	                  <button onClick={() => { setShowForm(false); resetExpenseForm() }} style={{ padding: '10px 22px', borderRadius: 8, border: '1px solid rgba(232,224,213,0.1)', background: 'transparent', color: '#5A5550', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Mono', monospace" }}>Cancel</button>
                </div>
              </div>
            )}

            {/* EXPENSE LIST */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4A4540', fontFamily: "'DM Mono', monospace" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>◎</div>
                <div style={{ fontSize: 11, letterSpacing: 2 }}>Loading {activeYear} expenses...</div>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', border: '1px dashed rgba(232,224,213,0.07)', borderRadius: 14, color: '#3A3530' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>◎</div>
                <div style={{ fontSize: 15 }}>No expenses for {MONTHS[activeMonth]} {activeYear}</div>
                <div style={{ fontSize: 11, marginTop: 6, fontFamily: "'DM Mono', monospace", color: '#3A3530' }}>
                  {isMobile ? 'Tap "+ Add" above to begin' : 'Click "+ Add Expense" to begin'}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {filteredExpenses.map(exp => {
                  const cat = getCat(exp.category); const isSel = selectedItem?.id === exp.id
                  return (
                    <div key={exp.id} onClick={() => setSelectedItem(isSel ? null : exp)}
                      style={{ borderRadius: 12, cursor: 'pointer', overflow: 'hidden', border: isSel ? `1px solid ${cat.color}45` : '1px solid rgba(232,224,213,0.06)', background: isSel ? `${cat.color}0A` : 'rgba(255,255,255,0.015)', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', padding: isMobile ? '11px 13px' : '12px 15px', gap: 12 }}>
                        <div style={{ width: isMobile ? 34 : 38, height: isMobile ? 34 : 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${cat.color}15`, fontSize: isMobile ? 16 : 18, flexShrink: 0 }}>{cat.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: isMobile ? 14 : 16, color: '#E8E0D5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.name}</div>
                          <div style={{ fontSize: 11, color: '#4A4540', marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{cat.label} · {exp.date}</div>
                        </div>
                        <div style={{ fontSize: isMobile ? 14 : 17, color: cat.color, flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>{fmt(exp.cost)}</div>
                      </div>
                      {isSel && (
                        <div style={{ padding: `0 13px 13px ${isMobile ? 13 : 66}px`, borderTop: `1px solid ${cat.color}18` }}>
                          {exp.description && <p style={{ fontSize: 13, color: '#6A6560', margin: '10px 0', lineHeight: 1.6 }}>{exp.description}</p>}
                          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ fontSize: 11, color: '#4A4540', padding: '4px 10px', border: '1px solid rgba(232,224,213,0.07)', borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>📅 {exp.date}</div>
                            <div style={{ fontSize: 11, color: cat.color, padding: '4px 10px', border: `1px solid ${cat.color}28`, borderRadius: 6, fontFamily: "'DM Mono', monospace" }}>{cat.icon} {cat.label}</div>
	                            <button onClick={e => { e.stopPropagation(); startEditExpense(exp) }} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(133,193,233,0.25)', background: 'transparent', color: '#85C1E9', cursor: 'pointer', fontSize: 11, fontFamily: "'DM Mono', monospace", marginLeft: 'auto' }}>Edit</button>
	                            <button onClick={e => { e.stopPropagation(); handleDelete(exp.id) }} style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(241,148,138,0.25)', background: 'transparent', color: '#F1948A', cursor: 'pointer', fontSize: 11, fontFamily: "'DM Mono', monospace" }}>Delete</button>
	                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* BREAKDOWN BAR */}
            {monthExpenses.length > 0 && !activeCategory && (
              <div style={{ marginTop: 28 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, color: '#5A5550', textTransform: 'uppercase', marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>{MONTHS[activeMonth]} {activeYear} Breakdown</div>
                <div style={{ display: 'flex', gap: 2, height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
                  {CATEGORIES.map(cat => {
                    const total = (grouped[cat.id] || []).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
                    const pct   = monthTotal > 0 ? (total / monthTotal) * 100 : 0
                    if (pct === 0) return null
                    return <div key={cat.id} style={{ width: `${pct}%`, background: cat.color }} />
                  })}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 14px' }}>
                  {CATEGORIES.filter(cat => grouped[cat.id]?.length > 0).map(cat => {
                    const total = (grouped[cat.id] || []).reduce((s, e) => s + parseFloat(e.cost || 0), 0)
                    const pct   = monthTotal > 0 ? (total / monthTotal * 100).toFixed(1) : 0
                    return (
                      <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5A5550', fontFamily: "'DM Mono', monospace" }}>
                        <div style={{ width: 7, height: 7, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
                        {isMobile ? cat.icon : cat.label}: <span style={{ color: cat.color }}>{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── YEARLY SUMMARY ─────────────────────── */}
            <div style={{ marginTop: 36 }}>
              <button onClick={() => setShowYearlySummary(v => !v)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: 12, border: '1px solid rgba(232,224,213,0.08)', background: showYearlySummary ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)', cursor: 'pointer', color: '#E8E0D5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>📊</span>
                  <span style={{ fontSize: 15, fontFamily: "'Cormorant Garamond', serif" }}>{activeYear} Annual Summary</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {yearSalary > 0 && (
                    <span style={{ fontSize: 13, color: yearProfit >= 0 ? '#82E0AA' : '#F1948A', fontFamily: "'DM Mono', monospace" }}>
                      {yearProfit >= 0 ? '+' : ''}{fmt(yearProfit)}
                    </span>
                  )}
                  <span style={{ color: '#5A5550', fontSize: 12, display: 'inline-block', transition: 'transform 0.2s', transform: showYearlySummary ? 'rotate(180deg)' : 'none' }}>▼</span>
                </div>
              </button>

              {showYearlySummary && (
                <div style={{ marginTop: 8, borderRadius: 12, border: '1px solid rgba(232,224,213,0.08)', overflow: 'hidden' }}>

                  {/* Table header */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '72px 1fr 1fr 1fr' : '120px 1fr 1fr 1fr', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(232,224,213,0.07)', padding: '10px 16px', gap: 8 }}>
                    {['Month', 'Salary', 'Spent', 'Net'].map(h => (
                      <div key={h} style={{ fontSize: 9, letterSpacing: 2, color: '#5A5550', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>{h}</div>
                    ))}
                  </div>

                  {/* Month rows */}
                  {yearlySummary.map(({ name, idx, exp, sal, profit, hasData }) => {
                    const isActive = idx === activeMonth
                    return (
                      <div key={idx} onClick={() => setActiveMonth(idx)}
                        style={{ display: 'grid', gridTemplateColumns: isMobile ? '72px 1fr 1fr 1fr' : '120px 1fr 1fr 1fr', padding: '12px 16px', gap: 8, borderBottom: '1px solid rgba(232,224,213,0.04)', background: isActive ? 'rgba(232,168,124,0.06)' : 'transparent', cursor: 'pointer', transition: 'background 0.15s', alignItems: 'center' }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? 'rgba(232,168,124,0.06)' : 'transparent' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isActive && <div style={{ width: 3, height: 14, borderRadius: 2, background: '#E8A87C', flexShrink: 0 }} />}
                          <span style={{ fontSize: isMobile ? 11 : 14, color: isActive ? '#E8A87C' : hasData ? '#E8E0D5' : '#3A3530', fontFamily: "'DM Mono', monospace" }}>
                            {name.slice(0, isMobile ? 3 : 9)}
                          </span>
                        </div>
                        <div style={{ fontSize: isMobile ? 11 : 13, color: sal > 0 ? '#82E0AA' : '#3A3530', fontFamily: "'DM Mono', monospace" }}>
                          {sal > 0 ? fmtShort(sal) : '—'}
                        </div>
                        <div style={{ fontSize: isMobile ? 11 : 13, color: exp > 0 ? '#E8A87C' : '#3A3530', fontFamily: "'DM Mono', monospace" }}>
                          {exp > 0 ? fmtShort(exp) : '—'}
                        </div>
                        <div style={{ fontSize: isMobile ? 11 : 13, fontFamily: "'DM Mono', monospace", color: sal === 0 ? '#3A3530' : profit >= 0 ? '#85C1E9' : '#F1948A' }}>
                          {sal === 0 ? '—' : (
                            <>
                              {profit >= 0 ? '+' : ''}{fmtShort(profit)}
                              {!isMobile && sal > 0 && (
                                <span style={{ fontSize: 9, marginLeft: 5, color: '#4A4540' }}>
                                  ({Math.round((profit / sal) * 100)}%)
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Year totals */}
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '72px 1fr 1fr 1fr' : '120px 1fr 1fr 1fr', padding: '14px 16px', gap: 8, background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(232,224,213,0.1)', alignItems: 'center' }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: '#7A7570', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>Total</div>
                    <div style={{ fontSize: isMobile ? 12 : 15, color: '#82E0AA', fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{yearSalary > 0 ? fmt(yearSalary) : '—'}</div>
                    <div style={{ fontSize: isMobile ? 12 : 15, color: '#E8A87C', fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{yearExpenses > 0 ? fmt(yearExpenses) : '—'}</div>
                    <div style={{ fontSize: isMobile ? 12 : 15, fontFamily: "'DM Mono', monospace", fontWeight: 600, color: yearSalary === 0 ? '#3A3530' : yearProfit >= 0 ? '#85C1E9' : '#F1948A' }}>
                      {yearSalary > 0 ? (
                        <>
                          {yearProfit >= 0 ? '+' : ''}{fmt(yearProfit)}
                          {!isMobile && yearSalary > 0 && <span style={{ fontSize: 10, marginLeft: 5, color: '#5A5550' }}>({Math.round((yearProfit / yearSalary) * 100)}%)</span>}
                        </>
                      ) : '—'}
                    </div>
                  </div>

                  {/* Year-at-a-glance bar */}
                  {yearSalary > 0 && (
                    <div style={{ padding: '16px 18px', borderTop: '1px solid rgba(232,224,213,0.05)' }}>
                      <div style={{ fontSize: 9, letterSpacing: 2, color: '#5A5550', textTransform: 'uppercase', marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>Year at a glance — spent vs earned</div>
                      <div style={{ display: 'flex', gap: 3, height: 8, borderRadius: 4, overflow: 'visible' }}>
                        {yearlySummary.map(({ idx, exp, sal }) => {
                          const pct = sal > 0 ? Math.min(100, (exp / sal) * 100) : (exp > 0 ? 100 : 0)
                          return (
                            <div key={idx} onClick={() => setActiveMonth(idx)}
                              style={{ flex: 1, position: 'relative', background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden', cursor: 'pointer', outline: activeMonth === idx ? '2px solid rgba(232,168,124,0.5)' : 'none', outlineOffset: 1 }}
                              title={`${MONTHS[idx]}: ${sal > 0 ? fmtShort(sal - exp) : 'no data'}`}>
                              {(sal > 0 || exp > 0) && (
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${pct}%`, background: exp > sal ? '#F1948A' : '#82E0AA', borderRadius: 2, transition: 'height 0.3s' }} />
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 9, color: '#3A3530', fontFamily: "'DM Mono', monospace" }}>
                        {MONTHS.map((m, i) => <span key={i} style={{ color: activeMonth === i ? '#E8A87C' : '#3A3530' }}>{m.slice(0, 1)}</span>)}
                      </div>
                      <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
                        {[{ color: '#82E0AA', label: 'Under budget' }, { color: '#F1948A', label: 'Over budget' }, { color: 'rgba(255,255,255,0.04)', label: 'No data' }].map(({ color, label }) => (
                          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: color, border: color === 'rgba(255,255,255,0.04)' ? '1px solid rgba(255,255,255,0.1)' : 'none' }} />
                            <span style={{ fontSize: 10, color: '#4A4540', fontFamily: "'DM Mono', monospace" }}>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
