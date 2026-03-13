'use client'
import { useEffect, useState } from 'react'
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

function formatVoteDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate()}/${d.getMonth() + 1} à ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

function Divider() {
  return <div style={{ height: '1px', background: '#1E3A5F', margin: '20px 0' }} />
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'Cinzel, serif', fontSize: '11px',
      letterSpacing: '0.25em', color: '#A0B4C8',
      textTransform: 'uppercase', marginBottom: '14px',
    }}>{children}</div>
  )
}

export default function PlayerSidebar({ player, onClose, onVoteSuccess }: { player: any, onClose: () => void, onVoteSuccess?: () => void }) {
  const isMobile = useIsMobile()
  const t = useTranslations()
  const [visible, setVisible] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [recentVotes, setRecentVotes] = useState<any[]>([])
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [currentScore, setCurrentScore] = useState(player.score)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    fetchData()
  }, [player.id])

  const fetchData = () => {
    fetch(`/api/player-stats?player_id=${player.id}`)
      .then(r => r.json())
      .then(({ stats }) => stats && setStats(stats))

    fetch(`/api/recent-votes?player_id=${player.id}`)
      .then(r => r.json())
      .then(({ votes }) => setRecentVotes(votes || []))
  }

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 280)
  }

  const handleVoteSuccess = (newScore: number) => {
    setCurrentScore(newScore)
    setShowVoteModal(false)
    onVoteSuccess?.()
    handleClose()
  }

  const titleKey = getTitleKey(currentScore)
  const scoreColor = getScoreColor(currentScore)
  const iconUrl = player.profile_icon_id
    ? `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${player.profile_icon_id}.png`
    : null

  const wins = player.wins ?? null
  const losses = player.losses ?? null
  const hasWinrate = wins !== null && losses !== null && (wins + losses) > 0
  const winrate = hasWinrate ? Math.round((wins / (wins + losses)) * 100) : null

  const statBars = stats ? [
    { label: t('sidebar.behavior'), value: stats.behavior_total },
    { label: t('sidebar.skill'), value: stats.skill_total },
    { label: t('sidebar.comm'), value: stats.comm_total },
    { label: t('sidebar.punc'), value: stats.punc_total },
  ] : []
  const maxAbs = Math.max(...statBars.map(s => Math.abs(s.value)), 1)

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 899,
          background: 'rgba(5,10,20,0.75)',
          backdropFilter: 'blur(3px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.28s ease',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: isMobile ? '100%' : '420px', zIndex: 900,
        background: '#0D1B2E',
        borderLeft: '1px solid #C89B3C',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: '16px', right: '20px',
            background: 'transparent', border: 'none',
            color: '#A0B4C8', fontSize: '20px', cursor: 'pointer',
            zIndex: 10, lineHeight: 1,
          }}
        >✕</button>

        {/* ── HEADER ── */}
        <div style={{
          padding: '28px 24px 24px',
          background: 'linear-gradient(135deg, rgba(200,155,60,0.06), transparent)',
          borderBottom: '1px solid #1E3A5F',
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              width: '64px', height: '64px', flexShrink: 0,
              background: 'rgba(200,155,60,0.1)',
              border: '2px solid #C89B3C',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Cinzel, serif', fontSize: '26px', fontWeight: 900,
              color: '#C89B3C', overflow: 'hidden',
            }}>
              {iconUrl
                ? <img src={iconUrl} alt="" width={64} height={64} style={{ objectFit: 'cover' }} />
                : player.summoner_name[0].toUpperCase()
              }
            </div>
            <div>
              <div style={{
                fontFamily: 'Cinzel, serif', fontSize: '18px',
                fontWeight: 700, color: '#F0E6D3', marginBottom: '4px',
              }}>{player.summoner_name}</div>
              <div style={{ fontSize: '12px', color: '#A0B4C8', letterSpacing: '0.08em', marginBottom: '6px' }}>
                {player.riot_tag} · <span style={{ color: '#0BC4E3' }}>{player.region}</span>
              </div>
              <div style={{
                display: 'inline-block',
                background: 'rgba(200,155,60,0.1)',
                border: '1px solid #785A28',
                padding: '2px 10px', fontSize: '12px',
                fontWeight: 700, color: '#C89B3C', letterSpacing: '0.05em',
              }}>
                ⚔ {player.rank_tier}
              </div>
            </div>
          </div>

          {/* Score */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '12px',
          }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#A0B4C8', textTransform: 'uppercase' }}>
              {t('card.score')}
            </span>
            <span style={{
              fontFamily: 'Cinzel, serif', fontSize: '24px',
              fontWeight: 900, color: scoreColor,
            }}>
              {currentScore.toLocaleString('fr-FR')}
            </span>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span style={{
              fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.08em', padding: '2px 8px',
              border: `1px solid ${TITLE_COLORS[titleKey]}44`,
              background: `${TITLE_COLORS[titleKey]}22`,
              color: TITLE_COLORS[titleKey], textTransform: 'uppercase',
            }}>
              {TITLE_EMOJIS[titleKey]} {t(`titles.${titleKey}` as any)}
            </span>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding: '20px 24px', flex: 1 }}>

          {/* Winrate */}
          <SectionTitle>{t('sidebar.winrate')}</SectionTitle>
          {hasWinrate ? (
            <>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ color: '#28C87A', fontSize: '13px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
                    {wins}V
                  </span>
                  <span style={{
                    fontFamily: 'Cinzel, serif', fontSize: '18px',
                    fontWeight: 900, color: (winrate ?? 0) >= 50 ? '#28C87A' : '#E05A4A',
                  }}>
                    {winrate}%
                  </span>
                  <span style={{ color: '#E05A4A', fontSize: '13px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
                    {losses}D
                  </span>
                </div>
                <div style={{ height: '6px', background: '#1E3A5F', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${winrate ?? 0}%`,
                    background: (winrate ?? 0) >= 50
                      ? 'linear-gradient(90deg, #28C87A88, #28C87A)'
                      : 'linear-gradient(90deg, #E05A4A88, #E05A4A)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            </>
          ) : (
            <div style={{
              fontSize: '13px', color: '#A0B4C8',
              fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em',
              marginBottom: '4px',
            }}>{t('sidebar.unranked')}</div>
          )}
          <Divider />

          {/* Vote stats */}
          {stats && stats.vote_count > 0 && (
            <>
              <SectionTitle>{t('sidebar.vote_stats')} ({stats.vote_count} total)</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' }}>
                {statBars.map(({ label, value }) => {
                  const color = value >= 0 ? '#28C87A' : '#E05A4A'
                  const width = Math.round((Math.abs(value) / maxAbs) * 100)
                  return (
                    <div key={label}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        marginBottom: '4px',
                      }}>
                        <span style={{ fontSize: '12px', color: '#A0B4C8', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                          {label}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color, fontFamily: 'Cinzel, sans-serif' }}>
                          {value >= 0 ? '+' : ''}{value.toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <div style={{ height: '4px', background: '#1E3A5F', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${width}%`,
                          background: `linear-gradient(90deg, ${color}66, ${color})`,
                          borderRadius: '2px', transition: 'width 0.5s ease',
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <Divider />
            </>
          )}

          {stats && stats.vote_count === 0 && (
            <>
              <div style={{
                textAlign: 'center', padding: '16px',
                color: '#A0B4C8', fontSize: '13px',
                border: '1px solid #1E3A5F',
                fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.1em',
              }}>
                {t('sidebar.no_votes')}
              </div>
              <Divider />
            </>
          )}

          {/* Recent votes */}
          {recentVotes.length > 0 && (
            <>
              <SectionTitle>{t('sidebar.last_votes')}</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {recentVotes.map((v, i) => {
                  const pos = v.total_delta >= 0
                  return (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 12px',
                      background: `${pos ? '#28C87A' : '#E05A4A'}0D`,
                      border: `1px solid ${pos ? '#28C87A' : '#E05A4A'}22`,
                    }}>
                      <span style={{ fontSize: '12px', color: '#A0B4C8', fontFamily: 'Rajdhani, sans-serif' }}>
                        {formatVoteDate(v.created_at)}
                      </span>
                      <span style={{
                        fontSize: '13px', fontWeight: 700,
                        color: pos ? '#28C87A' : '#E05A4A',
                        fontFamily: 'Cinzel, serif',
                      }}>
                        {pos ? '+' : ''}{v.total_delta.toLocaleString('fr-FR')} pts
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* ── VOTE BUTTON ── */}
        <div style={{ padding: '16px 24px 28px', borderTop: '1px solid #1E3A5F' }}>
          <button
            onClick={() => setShowVoteModal(true)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #785A28, #C89B3C)',
              border: 'none', color: '#0A1428',
              fontFamily: 'Cinzel, serif', fontSize: '14px',
              fontWeight: 900, letterSpacing: '0.15em',
              padding: '13px', cursor: 'pointer',
              textTransform: 'uppercase',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}
          >
            ⚡ {t('sidebar.evaluate').toUpperCase()}
          </button>
        </div>
      </div>

      {showVoteModal && (
        <VoteModal
          player={{ ...player, score: currentScore }}
          onClose={() => setShowVoteModal(false)}
          onVoteSuccess={handleVoteSuccess}
        />
      )}
    </>
  )
}
