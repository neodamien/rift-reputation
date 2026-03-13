'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import VoteModal from './VoteModal'
import { useIsMobile } from '../lib/useIsMobile'

function getScoreColor(score: number) {
  if (score >= 1100000) return '#28C87A'
  if (score >= 950000) return '#C89B3C'
  return '#E05A4A'
}

const TITLE_EMOJIS: Record<string, string> = {
  legend: '👑', champion: '🏆', warrior: '⚡', fairplay: '🌟',
  esteemed: '👍', invoker: '⚔️', reported: '💀', flamer: '🔥',
  banned: '☠️', persona: '🚫',
}

const TITLE_COLORS: Record<string, string> = {
  legend: '#C89B3C', champion: '#C89B3C', warrior: '#28C87A', fairplay: '#28C87A',
  esteemed: '#28C87A', invoker: '#0BC4E3', reported: '#E05A4A', flamer: '#E05A4A',
  banned: '#E05A4A', persona: '#E05A4A',
}

function getTitleKey(score: number): string {
  if (score >= 1400000) return 'legend'
  if (score >= 1200000) return 'champion'
  if (score >= 1100000) return 'warrior'
  if (score >= 1050000) return 'fairplay'
  if (score >= 1010000) return 'esteemed'
  if (score >= 990000) return 'invoker'
  if (score >= 900000) return 'reported'
  if (score >= 800000) return 'flamer'
  if (score >= 600000) return 'banned'
  return 'persona'
}

export default function PlayerCard({ player, rank, onOpenSidebar }: { player: any, rank: number, onOpenSidebar?: (player: any) => void }) {
  const isMobile = useIsMobile()
  const t = useTranslations()
  const [showModal, setShowModal] = useState(false)
  const [currentScore, setCurrentScore] = useState(player.score)
  const [lastDelta, setLastDelta] = useState(player.score - 1000000)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const titleKey = getTitleKey(currentScore)
  const scoreColor = getScoreColor(currentScore)
  const iconUrl = player.profile_icon_id
    ? `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${player.profile_icon_id}.png`
    : null

  const handleVoteSuccess = (newScore: number, delta: number) => {
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
        padding: isMobile ? '14px' : '20px',
        position: 'relative',
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
      }}>

        {/* Toast */}
        {showToast && (
          <div style={{
            position: 'absolute', top: '-40px', left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--blue-panel)', border: '1px solid var(--gold)',
            padding: '6px 16px', fontFamily: 'Cinzel, serif', fontSize: '13px',
            color: lastDelta >= 0 ? '#28C87A' : '#E05A4A',
            whiteSpace: 'nowrap', zIndex: 100,
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

        {/* Sidebar button */}
        {onOpenSidebar && (
          <button
            onClick={() => onOpenSidebar(player)}
            title="Voir le profil"
            style={{
              position: 'absolute', top: '12px', left: '12px',
              background: 'rgba(200,155,60,0.1)',
              border: '1px solid #785A28',
              color: '#C89B3C', fontSize: '13px',
              width: '24px', height: '24px',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              lineHeight: 1, zIndex: 2,
            }}
          >👤</button>
        )}

        {/* Top row */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
          <div
            onClick={() => onOpenSidebar?.(player)}
            style={{
              width: '56px', height: '56px',
              background: 'var(--blue-panel)',
              border: '2px solid var(--gold-dark)',
              borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Cinzel, serif', fontSize: '22px', fontWeight: 900,
              color: 'var(--gold)', flexShrink: 0, overflow: 'hidden',
              cursor: onOpenSidebar ? 'pointer' : 'default',
            }}>
            {iconUrl
              ? <img src={iconUrl} alt="" width={56} height={56} style={{ objectFit: 'cover' }} />
              : player.summoner_name[0].toUpperCase()
            }
          </div>
          <div>
            <div
              onClick={() => onOpenSidebar?.(player)}
              style={{
                fontFamily: 'Cinzel, serif', fontSize: '16px',
                fontWeight: 600, color: 'var(--gold-light)', marginBottom: '4px',
                cursor: onOpenSidebar ? 'pointer' : 'default',
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

        {/* Title */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          <span style={{
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.08em', padding: '2px 8px',
            borderRadius: '2px',
            border: `1px solid ${TITLE_COLORS[titleKey]}44`,
            background: `${TITLE_COLORS[titleKey]}22`,
            color: TITLE_COLORS[titleKey], textTransform: 'uppercase',
          }}>
            {TITLE_EMOJIS[titleKey]} {t(`titles.${titleKey}` as any)}
          </span>
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
            {t('card.score')}
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
          ⚡ {t('card.evaluate').toUpperCase()}
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
