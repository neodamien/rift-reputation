'use client'
import { useState } from 'react'
import VoteModal from './VoteModal'

function getScoreColor(score) {
  if (score >= 1100000) return '#28C87A'
  if (score >= 950000) return '#C89B3C'
  return '#E05A4A'
}

function getTitles(score) {
  if (score >= 1400000) return [{ label: '👑 Légende de la Rift', color: '#C89B3C' }]
  if (score >= 1200000) return [{ label: '🏆 Champion Communautaire', color: '#C89B3C' }]
  if (score >= 1100000) return [{ label: '⚡ Guerrier Honoré', color: '#28C87A' }]
  if (score >= 1050000) return [{ label: '🌟 Fair-Play', color: '#28C87A' }]
  if (score >= 1010000) return [{ label: '👍 Estimé', color: '#28C87A' }]
  if (score >= 990000) return [{ label: '⚔️ Invocateur', color: '#0BC4E3' }]
  if (score >= 900000) return [{ label: '💀 Signalé', color: '#E05A4A' }]
  if (score >= 800000) return [{ label: '🔥 Flambeur de Rang', color: '#E05A4A' }]
  if (score >= 600000) return [{ label: '☠️ Banni de la Communauté', color: '#E05A4A' }]
  return [{ label: '🚫 Persona Non Grata', color: '#E05A4A' }]
}

export default function PlayerCard({ player, rank }) {
  const [showModal, setShowModal] = useState(false)
  const [currentScore, setCurrentScore] = useState(player.score)
  const [lastDelta, setLastDelta] = useState(player.score - 1000000)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const titles = getTitles(currentScore)
  const scoreColor = getScoreColor(currentScore)

  const handleVoteSuccess = (newScore, delta) => {
    setCurrentScore(newScore)
    setLastDelta(delta)
    setToastMsg(`${delta >= 0 ? '+' : ''}${delta.toLocaleString('fr-FR')} pts`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, rgba(13,27,46,0.95) 0%, rgba(10,20,40,0.98) 100%)',
        border: '1px solid var(--blue-border)',
        padding: '20px',
        position: 'relative',
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
      }}>

        {/* Toast */}
        {showToast && (
          <div style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--blue-panel)',
            border: '1px solid var(--gold)',
            padding: '6px 16px',
            fontFamily: 'Cinzel, serif',
            fontSize: '13px',
            color: lastDelta >= 0 ? '#28C87A' : '#E05A4A',
            whiteSpace: 'nowrap',
            zIndex: 100,
          }}>
            {toastMsg}
          </div>
        )}

        {/* Rank */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          fontFamily: 'Cinzel, serif', fontSize: '11px',
          color: 'var(--gold)', letterSpacing: '0.1em',
        }}>#{rank}</div>

        {/* Top row */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'var(--blue-panel)',
            border: '2px solid var(--gold-dark)',
            borderRadius: '4px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cinzel, serif', fontSize: '22px', fontWeight: 900,
            color: 'var(--gold)', flexShrink: 0,
          }}>
            {player.summoner_name[0].toUpperCase()}
          </div>
          <div>
            <div style={{
              fontFamily: 'Cinzel, serif', fontSize: '16px',
              fontWeight: 600, color: 'var(--gold-light)', marginBottom: '4px',
            }}>
              {player.summoner_name}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '12px', letterSpacing: '0.1em' }}>
              {player.riot_tag} · <span style={{ color: 'var(--teal)' }}>{player.region}</span>
            </div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(200,155,60,0.1)',
              border: '1px solid var(--gold-dark)',
              padding: '2px 10px', fontSize: '12px',
              fontWeight: 700, color: 'var(--gold)',
              marginTop: '6px', letterSpacing: '0.05em',
            }}>
              ⚔ {player.rank_tier}
            </div>
          </div>
        </div>

        {/* Titles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {titles.map((t, i) => (
            <span key={i} style={{
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.08em', padding: '2px 8px',
              borderRadius: '2px',
              border: `1px solid ${t.color}44`,
              background: `${t.color}22`,
              color: t.color, textTransform: 'uppercase',
            }}>{t.label}</span>
          ))}
        </div>

        {/* Score */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 0',
          borderTop: '1px solid var(--blue-border)',
          borderBottom: '1px solid var(--blue-border)',
          marginBottom: '12px',
        }}>
          <span style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Score Communauté
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '22px', fontWeight: 900, color: scoreColor }}>
              {currentScore.toLocaleString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Score bar */}
        <div style={{
          height: '4px', background: 'var(--blue-border)',
          borderRadius: '2px', marginBottom: '12px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(100, (currentScore / 1500000) * 100)}%`,
            background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`,
            borderRadius: '2px', transition: 'width 0.6s ease',
          }} />
        </div>

        {/* Vote button */}
        <button onClick={() => setShowModal(true)} style={{
          width: '100%', background: 'transparent',
          border: '1px solid var(--gold-dark)', color: 'var(--gold)',
          fontFamily: 'Rajdhani, sans-serif', fontSize: '14px',
          fontWeight: 700, letterSpacing: '0.15em',
          padding: '10px', cursor: 'pointer',
          textTransform: 'uppercase',
          clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
        }}>
          ⚡ ÉVALUER CE JOUEUR
        </button>
      </div>

      {showModal && (
        <VoteModal
          player={player}
          onClose={() => setShowModal(false)}
          onVoteSuccess={handleVoteSuccess}
        />
      )}
    </>
  )
}