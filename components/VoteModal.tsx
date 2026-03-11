'use client'
import { useState } from 'react'

const VOTE_OPTIONS = {
  behavior: {
    label: '🛡️ COMPORTEMENT EN JEU',
    options: [
      { value: 300, label: 'Fair-play exemplaire', points: '+300' },
      { value: 150, label: "Bon esprit d'équipe", points: '+150' },
      { value: -250, label: 'Flame régulier', points: '-250' },
      { value: -400, label: 'Comportement toxique', points: '-400' },
    ]
  },
  skill: {
    label: '⚔️ COMPÉTENCES / NIVEAU',
    options: [
      { value: 400, label: 'Niveau godlike', points: '+400' },
      { value: 100, label: 'Joueur compétent', points: '+100' },
      { value: -350, label: 'Grief en jeu', points: '-350' },
      { value: -500, label: 'Feed intentionnel', points: '-500' },
    ]
  },
  comm: {
    label: '💬 COMMUNICATION',
    options: [
      { value: 200, label: 'Shot-calling efficace', points: '+200' },
      { value: 150, label: 'Excellente synergie', points: '+150' },
      { value: -150, label: 'Spam /all chat', points: '-150' },
      { value: -300, label: 'AFK / Déco', points: '-300' },
    ]
  },
  punc: {
    label: '⏱️ PONCTUALITÉ',
    options: [
      { value: 100, label: 'Toujours présent', points: '+100' },
      { value: 80, label: 'Fiable et régulier', points: '+80' },
      { value: -120, label: 'Vote /ff15 abusif', points: '-120' },
      { value: -200, label: 'Dodge systématique', points: '-200' },
    ]
  }
}

export default function VoteModal({ player, onClose, onVoteSuccess }) {
  const [votes, setVotes] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = Object.values(votes).reduce((a: number, b: number) => a + b, 0)
  const isPos = total >= 0

  const submitVote = async () => {
    if (Object.keys(votes).length === 0) { setError('Sélectionnez au moins une évaluation'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: player.id,
        behavior_score: votes['behavior'] || 0,
        skill_score: votes['skill'] || 0,
        comm_score: votes['comm'] || 0,
        punc_score: votes['punc'] || 0,
      })
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Erreur lors du vote'); return }
    onVoteSuccess(data.new_score, data.delta)
    onClose()
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(5,10,20,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', backdropFilter: 'blur(6px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#0D1B2E',
        border: '1px solid #785A28',
        maxWidth: '580px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
        position: 'relative',
      }}>

        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '20px',
          background: 'transparent', border: 'none',
          color: '#A0B4C8', fontSize: '20px', cursor: 'pointer',
          lineHeight: 1, zIndex: 10,
        }}>✕</button>

        {/* Header */}
        <div style={{
          padding: '28px 32px 20px',
          borderBottom: '1px solid #1E3A5F',
          background: 'linear-gradient(135deg, rgba(200,155,60,0.08), transparent)',
        }}>
          <div style={{
            fontFamily: 'Cinzel, serif', fontSize: '11px',
            letterSpacing: '0.3em', color: '#0BC4E3',
            textTransform: 'uppercase', marginBottom: '6px',
          }}>Tribunal Communautaire</div>
          <div style={{
            fontFamily: 'Cinzel, serif', fontSize: '22px',
            color: '#C89B3C', letterSpacing: '0.05em',
          }}>
            Juger : <span style={{ color: '#F0E6D3' }}>{player.summoner_name}</span>
          </div>
          <div style={{ fontSize: '13px', color: '#A0B4C8', marginTop: '4px' }}>
            {player.region} · {player.rank_tier} · Score actuel : {player.score?.toLocaleString('fr-FR')} pts
          </div>
        </div>

        {/* Categories */}
        <div style={{ padding: '24px 32px' }}>
          {Object.entries(VOTE_OPTIONS).map(([key, cat]) => (
            <div key={key} style={{ marginBottom: '20px' }}>
              <div style={{
                fontFamily: 'Cinzel, serif', fontSize: '12px',
                letterSpacing: '0.2em', color: '#F0E6D3',
                marginBottom: '8px', display: 'flex',
                alignItems: 'center', gap: '8px',
              }}>
                <div style={{ flex: 1, height: '1px', background: '#1E3A5F' }} />
                {cat.label}
                <div style={{ flex: 1, height: '1px', background: '#1E3A5F' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {cat.options.map(opt => {
                  const selected = votes[key] === opt.value
                  const pos = opt.value > 0
                  return (
                    <button key={opt.value} onClick={() => setVotes(prev => ({ ...prev, [key]: opt.value }))} style={{
                      background: selected
                        ? pos ? 'rgba(40,200,122,0.12)' : 'rgba(200,54,42,0.12)'
                        : 'rgba(10,20,40,0.8)',
                      border: `1px solid ${selected ? (pos ? '#28C87A' : '#C8362A') : '#1E3A5F'}`,
                      color: selected ? (pos ? '#28C87A' : '#E05A4A') : '#A0B4C8',
                      padding: '10px 12px', cursor: 'pointer',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontSize: '13px', fontWeight: 600,
                      textAlign: 'left', transition: 'all 0.15s',
                      clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span>{opt.label}</span>
                      <span style={{
                        fontSize: '12px', fontWeight: 700,
                        color: pos ? '#28C87A88' : '#E05A4A88',
                        fontFamily: 'Cinzel, serif',
                      }}>{opt.points}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Total */}
          {Object.keys(votes).length > 0 && (
            <div style={{
              textAlign: 'center', padding: '14px',
              background: isPos ? 'rgba(40,200,122,0.08)' : 'rgba(200,54,42,0.08)',
              border: `1px solid ${isPos ? '#28C87A33' : '#C8362A33'}`,
              margin: '8px 0',
            }}>
              <span style={{ color: '#A0B4C8', fontSize: '12px', letterSpacing: '0.2em', fontFamily: 'Cinzel, serif' }}>
                IMPACT TOTAL
              </span>
              <div style={{
                fontFamily: 'Cinzel, serif', fontSize: '28px', fontWeight: 900,
                color: isPos ? '#28C87A' : '#E05A4A', letterSpacing: '0.05em',
              }}>
                {total >= 0 ? '+' : ''}{total.toLocaleString('fr-FR')} pts
              </div>
            </div>
          )}

          {error && (
            <div style={{
              color: '#E05A4A', fontSize: '13px', textAlign: 'center',
              padding: '10px', background: 'rgba(200,54,42,0.1)',
              border: '1px solid rgba(200,54,42,0.3)', marginTop: '8px',
            }}>⚠ {error}</div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', gap: '10px',
          padding: '16px 32px 28px',
          borderTop: '1px solid #1E3A5F',
        }}>
          <button onClick={onClose} style={{
            flex: 1, background: 'transparent',
            border: '1px solid #1E3A5F', color: '#A0B4C8',
            fontFamily: 'Rajdhani, sans-serif', fontSize: '14px',
            fontWeight: 700, letterSpacing: '0.15em',
            padding: '13px', cursor: 'pointer',
            textTransform: 'uppercase',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
          }}>ANNULER</button>
          <button onClick={submitVote} disabled={loading} style={{
            flex: 2,
            background: loading ? '#785A28' : 'linear-gradient(135deg, #785A28, #C89B3C)',
            border: 'none', color: '#0A1428',
            fontFamily: 'Cinzel, serif', fontSize: '14px',
            fontWeight: 900, letterSpacing: '0.15em',
            padding: '13px', cursor: loading ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(200,155,60,0.3)',
          }}>
            {loading ? 'ENVOI EN COURS...' : '⚡ VALIDER LE JUGEMENT'}
          </button>
        </div>
      </div>
    </div>
  )
}