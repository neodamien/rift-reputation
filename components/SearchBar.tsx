'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useIsMobile } from '../lib/useIsMobile'

const REGIONS = ['EUW', 'EUNE', 'NA', 'KR', 'BR', 'LAN']

export default function SearchBar({
  onViewProfile,
  onVote,
}: {
  onViewProfile: (player: any) => void
  onVote: (player: any) => void
}) {
  const isMobile = useIsMobile()
  const t = useTranslations()
  const [name, setName] = useState('')
  const [tag, setTag] = useState('')
  const [region, setRegion] = useState('EUW')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)

  const search = async () => {
    if (!name.trim()) { setError(t('nav.search_placeholder')); return }
    const cleanTag = tag.replace('#', '') || region + '1'
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch(`/api/riot?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(cleanTag)}&region=${region}`)
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Joueur introuvable')
      return
    }

    setName('')
    setTag('')
    setResult(data.player)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '32px auto 24px', padding: '0 12px' }}>
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
              placeholder={t('nav.search_placeholder')}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                padding: '12px 16px', color: 'var(--gold-light)',
                fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', fontWeight: 500,
                minWidth: 0,
              }}
            />
            <input
              value={tag}
              onChange={e => setTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="#EUW1"
              style={{
                width: '80px', background: 'transparent',
                border: 'none', borderLeft: '1px solid var(--blue-border)',
                outline: 'none', padding: '12px 10px',
                color: 'var(--gold-light)', fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(200,155,60,0.1)',
                border: '1px solid var(--gold-dark)',
                color: 'var(--gold)', fontFamily: 'Rajdhani, sans-serif',
                fontSize: '14px', fontWeight: 600,
                padding: '11px 12px', outline: 'none', cursor: 'pointer',
              }}
            >
              {REGIONS.map(r => <option key={r} value={r} style={{ background: '#0D1B2E' }}>{r}</option>)}
            </select>
            <button onClick={search} disabled={loading} style={{
              flex: 2,
              background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
              border: 'none', padding: '11px 16px',
              color: 'var(--blue-deep)', fontFamily: 'Cinzel, serif',
              fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em',
              cursor: loading ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase', opacity: loading ? 0.7 : 1,
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}>
              {loading ? '...' : `⚔ ${t('nav.search_btn').toUpperCase()}`}
            </button>
          </div>
        </div>
      ) : (
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
            placeholder={t('nav.search_placeholder')}
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
              border: 'none', borderLeft: '1px solid var(--blue-border)',
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
            {loading ? '...' : `⚔ ${t('nav.search_btn').toUpperCase()}`}
          </button>
        </div>
      )}

      {error && (
        <div style={{
          color: '#E05A4A', fontSize: '13px', marginTop: '8px',
          padding: '8px 16px', background: 'rgba(200,54,42,0.1)',
          border: '1px solid rgba(200,54,42,0.3)',
        }}>
          ⚠ {error}
        </div>
      )}

      {result && (
        <div style={{
          marginTop: '10px',
          background: 'rgba(13,27,46,0.95)',
          border: '1px solid #1E3A5F',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: '14px',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
        }}>
          <div style={{
            width: '44px', height: '44px', flexShrink: 0,
            background: 'rgba(200,155,60,0.1)',
            border: '2px solid #785A28',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cinzel, serif', fontSize: '18px', fontWeight: 900,
            color: '#C89B3C', overflow: 'hidden',
          }}>
            {result.profile_icon_id
              ? <img src={`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${result.profile_icon_id}.png`} alt="" width={44} height={44} style={{ objectFit: 'cover' }} />
              : result.summoner_name[0].toUpperCase()
            }
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Cinzel, serif', fontSize: '15px', fontWeight: 700,
              color: '#F0E6D3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{result.summoner_name}</div>
            <div style={{ fontSize: '12px', color: '#A0B4C8', letterSpacing: '0.06em', marginTop: '2px' }}>
              {result.riot_tag} · <span style={{ color: '#0BC4E3' }}>{result.region}</span>
              {' · '}<span style={{ color: '#C89B3C' }}>{result.rank_tier}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
            <button
              onClick={() => { setResult(null); onViewProfile(result) }}
              style={{
                flex: isMobile ? 1 : undefined,
                background: 'rgba(11,196,227,0.1)',
                border: '1px solid rgba(11,196,227,0.4)',
                color: '#0BC4E3', fontFamily: 'Rajdhani, sans-serif',
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
                padding: '7px 12px', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >👤 {t('card.discover')}</button>
            <button
              onClick={() => { setResult(null); onVote(result) }}
              style={{
                flex: isMobile ? 1 : undefined,
                background: 'linear-gradient(135deg, rgba(120,90,40,0.4), rgba(200,155,60,0.2))',
                border: '1px solid #785A28',
                color: '#C89B3C', fontFamily: 'Rajdhani, sans-serif',
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
                padding: '7px 12px', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >⚡ {t('card.judge')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
