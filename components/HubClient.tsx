'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PlayerCard from './PlayerCard'
import PlayerSidebar from './PlayerSidebar'
import SearchBar from './SearchBar'
import VoteModal from './VoteModal'

const REGIONS = ['Toutes', 'EUW', 'EUNE', 'NA', 'KR', 'BR', 'LAN']


function SectionHeader({ title, accent = '#C89B3C', count }: { title: string, accent?: string, count?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
      <h2 style={{
        fontFamily: 'Cinzel, serif', fontSize: '18px',
        letterSpacing: '0.2em', color: accent,
        whiteSpace: 'nowrap', margin: 0,
      }}>{title}</h2>
      <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${accent}88, transparent)` }} />
      {count !== undefined && (
        <span style={{ color: '#A0B4C8', fontSize: '13px', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
          {count} invocateur{count > 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}

function MiniCard({ player, rank, type }: { player: any, rank: number, type: 'best' | 'worst' }) {
  const color = type === 'best' ? '#28C87A' : '#E05A4A'
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(13,27,46,0.95), rgba(10,20,40,0.98))',
      border: `1px solid ${color}44`,
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: '12px',
      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
    }}>
      <div style={{
        fontFamily: 'Cinzel, serif', fontSize: '22px', fontWeight: 900,
        color: `${color}55`, minWidth: '28px', textAlign: 'center',
      }}>#{rank}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Cinzel, serif', fontSize: '13px', fontWeight: 700,
          color: '#F0E6D3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{player.summoner_name}</div>
        <div style={{ fontSize: '11px', color: '#A0B4C8', letterSpacing: '0.08em', marginTop: '2px' }}>
          {player.region} · {player.rank_tier}
        </div>
      </div>
      <div style={{
        fontFamily: 'Cinzel, serif', fontSize: '15px', fontWeight: 900,
        color, whiteSpace: 'nowrap',
      }}>
        {player.score.toLocaleString('fr-FR')}
      </div>
    </div>
  )
}

function PlayerGrid({ players, onOpenSidebar }: { players: any[], onOpenSidebar: (player: any) => void }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '16px',
    }}>
      {players.map((player, i) => (
        <PlayerCard key={player.id} player={player} rank={i + 1} onOpenSidebar={onOpenSidebar} />
      ))}
    </div>
  )
}

export default function HubClient({ recentlyJudged, hallOfFame, hallOfShame, thisWeekBest, thisWeekWorst }: {
  recentlyJudged: any[]
  hallOfFame: any[]
  hallOfShame: any[]
  thisWeekBest: any[]
  thisWeekWorst: any[]
}) {
  const router = useRouter()
  const [region, setRegion] = useState<string | null>(null)
  const [foundPlayer, setFoundPlayer] = useState<any>(null)
  const [sidebarPlayer, setSidebarPlayer] = useState<any>(null)

  const f = (arr: any[]) => region ? arr.filter(p => p.region === region) : arr

  const filteredRecent = f(recentlyJudged)
  const filteredFame = f(hallOfFame)
  const filteredShame = f(hallOfShame)
  const filteredWeekBest = f(thisWeekBest)
  const filteredWeekWorst = f(thisWeekWorst)

  const sectionStyle = {
    position: 'relative' as const, zIndex: 10,
    maxWidth: '1400px', margin: '0 auto',
    padding: '0 24px', marginBottom: '64px',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0A1428', position: 'relative' }}>

      {/* Background */}
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
          fontWeight: 900, letterSpacing: '0.15em',
          background: 'linear-gradient(180deg, #F0E6D3 0%, #C89B3C 50%, #785A28 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          lineHeight: 1, margin: 0,
        }}>RIFT REPUTATION</h1>
        <p style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: '14px',
          letterSpacing: '0.4em', color: '#0BC4E3',
          textTransform: 'uppercase', marginTop: '8px', fontWeight: 500,
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
                fontFamily: 'Rajdhani, sans-serif', fontSize: '13px', fontWeight: 700,
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
        <SearchBar
          onViewProfile={p => setSidebarPlayer(p)}
          onVote={p => setFoundPlayer(p)}
        />
      </div>

      {/* MODAL VOTE après recherche */}
      {foundPlayer && (
        <VoteModal
          player={foundPlayer}
          onClose={() => { setFoundPlayer(null); router.refresh() }}
          onVoteSuccess={() => { setFoundPlayer(null); router.refresh() }}
        />
      )}

      <div style={{ paddingTop: '48px' }}>

        {/* ── CETTE SEMAINE ── */}
        {(filteredWeekBest.length > 0 || filteredWeekWorst.length > 0) && (
          <div style={sectionStyle}>
            <SectionHeader title="⚡ CETTE SEMAINE" accent="#0BC4E3" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Meilleurs */}
              <div>
                <div style={{
                  fontFamily: 'Cinzel, serif', fontSize: '11px', letterSpacing: '0.25em',
                  color: '#28C87A', textTransform: 'uppercase', marginBottom: '12px',
                }}>⬆ Meilleurs</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredWeekBest.length === 0
                    ? <div style={{ color: '#A0B4C8', fontSize: '13px', padding: '20px', textAlign: 'center', border: '1px solid #1E3A5F' }}>Aucun vote cette semaine</div>
                    : filteredWeekBest.map((p, i) => <MiniCard key={p.id} player={p} rank={i + 1} type="best" />)
                  }
                </div>
              </div>
              {/* Pires */}
              <div>
                <div style={{
                  fontFamily: 'Cinzel, serif', fontSize: '11px', letterSpacing: '0.25em',
                  color: '#E05A4A', textTransform: 'uppercase', marginBottom: '12px',
                }}>⬇ Pires</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredWeekWorst.length === 0
                    ? <div style={{ color: '#A0B4C8', fontSize: '13px', padding: '20px', textAlign: 'center', border: '1px solid #1E3A5F' }}>Aucun vote cette semaine</div>
                    : filteredWeekWorst.map((p, i) => <MiniCard key={p.id} player={p} rank={i + 1} type="worst" />)
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RÉCEMMENT JUGÉS ── */}
        {filteredRecent.length > 0 && (
          <div style={sectionStyle}>
            <SectionHeader title="🕐 RÉCEMMENT JUGÉS" count={filteredRecent.length} />
            <PlayerGrid players={filteredRecent} onOpenSidebar={setSidebarPlayer} />
          </div>
        )}

        {/* ── HALL OF FAME ── */}
        {filteredFame.length > 0 && (
          <div style={sectionStyle}>
            <SectionHeader title="🏆 HALL OF FAME" accent="#28C87A" count={filteredFame.length} />
            <PlayerGrid players={filteredFame} onOpenSidebar={setSidebarPlayer} />
          </div>
        )}

        {/* ── HALL OF SHAME ── */}
        {filteredShame.length > 0 && (
          <div style={sectionStyle}>
            <SectionHeader title="☠️ HALL OF SHAME" accent="#E05A4A" count={filteredShame.length} />
            <PlayerGrid players={filteredShame} onOpenSidebar={setSidebarPlayer} />
          </div>
        )}

      </div>

      {sidebarPlayer && (
        <PlayerSidebar player={sidebarPlayer} onClose={() => setSidebarPlayer(null)} />
      )}
    </main>
  )
}
