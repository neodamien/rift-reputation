'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const REGIONS = ['EUW', 'EUNE', 'NA', 'KR', 'BR', 'LAN']

export default function SearchBar() {
  const [name, setName] = useState('')
  const [tag, setTag] = useState('')
  const [region, setRegion] = useState('EUW')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const search = async () => {
    if (!name.trim()) { setError('Entre un nom d\'invocateur'); return }
    const cleanTag = tag.replace('#', '') || region + '1'
    setLoading(true)
    setError('')

    const res = await fetch(`/api/riot?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(cleanTag)}&region=${region}`)
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Joueur introuvable')
      return
    }

    router.refresh()
    setName('')
    setTag('')
  }

  return (
    <div style={{ maxWidth: '700px', margin: '32px auto 24px', padding: '0 24px' }}>
      <div style={{
        display: 'flex',
        border: '1px solid var(--gold-dark)',
        background: 'rgba(13,27,46,0.9)',
        clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
      }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Nom d'invocateur..."
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            padding: '14px 20px', color: 'var(--gold-light)',
            fontFamily: 'Rajdhani, sans-serif', fontSize: '16px', fontWeight: 500,
          }}
        />
        <input
          value={tag}
          onChange={e => setTag(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="#EUW1"
          style={{
            width: '100px', background: 'transparent',
            borderLeft: '1px solid var(--blue-border)', border: 'none',
            borderLeft: '1px solid var(--blue-border)',
            outline: 'none', padding: '14px 12px',
            color: 'var(--gold-light)', fontFamily: 'Rajdhani, sans-serif',
            fontSize: '15px',
          }}
        />
        <select
          value={region}
          onChange={e => setRegion(e.target.value)}
          style={{
            background: 'rgba(200,155,60,0.1)',
            borderLeft: '1px solid var(--gold-dark)',
            border: 'none', borderLeft: '1px solid var(--gold-dark)',
            color: 'var(--gold)', fontFamily: 'Rajdhani, sans-serif',
            fontSize: '14px', fontWeight: 600,
            padding: '14px 16px', outline: 'none', cursor: 'pointer',
          }}
        >
          {REGIONS.map(r => <option key={r} value={r} style={{ background: '#0D1B2E' }}>{r}</option>)}
        </select>
        <button onClick={search} disabled={loading} style={{
          background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
          border: 'none', padding: '14px 24px',
          color: 'var(--blue-deep)', fontFamily: 'Cinzel, serif',
          fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em',
          cursor: loading ? 'not-allowed' : 'pointer',
          textTransform: 'uppercase', opacity: loading ? 0.7 : 1,
        }}>
          {loading ? '...' : '⚔ CHERCHER'}
        </button>
      </div>
      {error && (
        <div style={{
          color: '#E05A4A', fontSize: '13px', marginTop: '8px',
          padding: '8px 16px', background: 'rgba(200,54,42,0.1)',
          border: '1px solid rgba(200,54,42,0.3)',
        }}>
          ⚠ {error}
        </div>
      )}
    </div>
  )
}