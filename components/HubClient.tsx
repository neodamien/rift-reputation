'use client'
import { useState } from 'react'
import PlayerCard from './PlayerCard'
import SearchBar from './SearchBar'

const REGIONS = ['Toutes', 'EUW', 'EUNE', 'NA', 'KR', 'BR', 'LAN']

export default function HubClient({ initialPlayers }) {
  const [region, setRegion] = useState(null)

  const filtered = region
    ? initialPlayers.filter(p => p.region === region)
    : initialPlayers

  return (
    <main style={{ minHeight: '100vh', background: '#0A1428', position: 'relative' }}>

      {/* Background pattern */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(12,60,100,0.6) 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 80% 80%, rgba(200,155,60,0.05) 0%, transparent 60%)
        `
      }} />

      {/* HEADER */}
      <header style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center',
        padding: '48px 24px 32px',
        borderBottom: '1px solid #1E3A5F',
        background: 'linear-gradient(180deg, rgba(10,20,40,0.98) 0%, rgba(10,20,40,0.7) 100%)',
      }}>
        {/* Emblem */}
        <div style={{ marginBottom: '16px' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto', display: 'block' }}>
            <polygon points="32,2 60,16 60,48 32,62 4,48 4,16" fill="none" stroke="#C89B3C" strokeWidth="1.5"/>
            <polygon points="32,10 52,20 52,44 32,54 12,44 12,20" fill="none" stroke="#785A28" strokeWidth="1"/>
            <polygon points="32,20 44,26 44,38 32,44 20,38 20,26" fill="#0A1428" stroke="#C89B3C" strokeWidth="1.5"/>
            <text x="32" y="37" textAnchor="middle" fontFamily="serif" fontSize="16" fontWeight="bold" fill="#C89B3C">R</text>
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 900,
          letterSpacing: '0.15em',
          background: 'linear-gradient(180deg, #F0E6D3 0%, #C89B3C 50%, #785A28 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          margin: 0,
        }}>RIFT REPUTATION</h1>

        <p style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '14px', letterSpacing: '0.4em',
          color: '#0BC4E3', textTransform: 'uppercase',
          marginTop: '8px', fontWeight: 500,
        }}>League of Legends · Community Tribunal</p>

        {/* Region tabs */}
        <div style={{
          display: 'flex', gap: '4px',
          justifyContent: 'center', flexWrap: 'wrap',
          marginTop: '28px',
        }}>
          {REGIONS.map(r => {
            const active = (r === 'Toutes' && !region) || r === region
            return (
              <button key={r} onClick={() => setRegion(r === 'Toutes' ? null : r)} style={{
                background: active
                  ? 'linear-gradient(135deg, rgba(200,155,60,0.2), rgba(200,155,60,0.05))'
                  : 'rgba(13,27,46,0.8)',
                border: `1px solid ${active ? '#C89B3C' : '#1E3A5F'}`,
                color: active ? '#C89B3C' : '#A0B4C8',
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: '13px', fontWeight: 700,
                letterSpacing: '0.15em', padding: '8px 20px',
                cursor: 'pointer', transition: 'all 0.2s',
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
              }}>{r}</button>
            )
          })}
        </div>
      </header>

      {/* SEARCH */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <SearchBar />
      </div>

      {/* GRID */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '16px', marginBottom: '24px',
        }}>
          <h2 style={{
            fontFamily: 'Cinzel, serif', fontSize: '18px',
            letterSpacing: '0.2em', color: '#C89B3C',
            whiteSpace: 'nowrap',
          }}>
            ✦ {region ? `RÉGION ${region}` : 'CLASSEMENT COMMUNAUTAIRE'}
          </h2>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #785A28, transparent)' }} />
          <span style={{ color: '#A0B4C8', fontSize: '13px', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            {filtered.length} invocateur{filtered.length > 1 ? 's' : ''}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            color: '#A0B4C8', fontFamily: 'Cinzel, serif',
            fontSize: '16px', letterSpacing: '0.1em',
            border: '1px solid #1E3A5F',
            background: 'rgba(13,27,46,0.5)',
          }}>
            ⚔️ Aucun invocateur dans cette région pour le moment
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}>
            {filtered.map((player, index) => (
              <PlayerCard key={player.id} player={player} rank={index + 1} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}