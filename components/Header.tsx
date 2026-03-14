'use client'
import { useState } from 'react'
import Link from 'next/link'

const REGIONS = ['Toutes', 'EUW', 'EUNE', 'NA', 'KR', 'BR', 'LAN']

export default function Header({ onRegionChange }: { onRegionChange: (region: string | null) => void }) {
  const [activeRegion, setActiveRegion] = useState('Toutes')

  const handleRegion = (region: string) => {
    setActiveRegion(region)
    onRegionChange(region === 'Toutes' ? null : region)
  }

  return (
    <header style={{
      textAlign: 'center',
      padding: '48px 24px 32px',
      borderBottom: '1px solid var(--blue-border)',
      background: 'linear-gradient(180deg, rgba(10,20,40,0.95) 0%, transparent 100%)',
    }}>
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
      }}>
        RIFT REPUTATION
      </h1>
      <p style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontSize: '14px',
        letterSpacing: '0.4em',
        color: 'var(--teal)',
        textTransform: 'uppercase',
        marginTop: '8px',
        fontWeight: 500,
      }}>
        League of Legends · Community Tribunal
      </p>

      {/* Region tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '24px',
      }}>
        {REGIONS.map(region => (
          <button key={region} onClick={() => handleRegion(region)} style={{
            background: activeRegion === region
              ? 'linear-gradient(135deg, rgba(200,155,60,0.2), rgba(200,155,60,0.05))'
              : 'rgba(13,27,46,0.8)',
            border: `1px solid ${activeRegion === region ? 'var(--gold)' : 'var(--blue-border)'}`,
            color: activeRegion === region ? 'var(--gold)' : 'var(--text-dim)',
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            padding: '8px 18px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
          }}>
            {region}
          </button>
        ))}
      </div>
      {/* Footer link */}
      <div style={{ marginTop: '16px' }}>
        <Link href="/legal" style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.1em',
          color: 'rgba(160,180,200,0.5)',
          textDecoration: 'none',
        }}>
          Mentions légales
        </Link>
      </div>
    </header>
  )
}