'use client'
import { useState } from 'react'

const VOTE_OPTIONS = {
  behavior: {
    label: '🛡️ COMPORTEMENT EN JEU',
    options: [
      { value: 300, label: 'Fair-play exemplaire (+300)' },
      { value: 150, label: 'Bon esprit d\'équipe (+150)' },
      { value: -250, label: 'Flame régulier (-250)' },
      { value: -400, label: 'Comportement toxique (-400)' },
    ]
  },
  skill: {
    label: '⚔️ COMPÉTENCES / NIVEAU',
    options: [
      { value: 400, label: 'Niveau mécanique godlike (+400)' },
      { value: 100, label: 'Joueur compétent (+100)' },
      { value: -350, label: 'Grief en jeu (-350)' },
      { value: -500, label: 'Feed intentionnel (-500)' },
    ]
  },
  comm: {
    label: '💬 COMMUNICATION / TEAMWORK',
    options: [
      { value: 200, label: 'Shot-calling efficace (+200)' },
      { value: 150, label: 'Excellente synergie (+150)' },
      { value: -150, label: 'Spam /all chat (-150)' },
      { value: -300, label: 'AFK / Déconnexions (-300)' },
    ]
  },
  punc: {
    label: '⏱️ PONCTUALITÉ / PRÉSENCE',
    options: [
      { value: 100, label: 'Toujours présent (+100)' },
      { value: 80, label: 'Fiable et régulier (+80)' },
      { value: -120, label: 'Vote /ff15 abusif (-120)' },
      { value: -200, label: 'Dodge systématique (-200)' },
    ]
  }
}

export default function VoteModal({ player, onClose, onVoteSuccess }) {
  const [votes, setVotes] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = Object.values(votes).reduce((a: number, b: number) => a + b, 0)

  const selectVote = (category, value) => {
    setVotes(prev => ({ ...prev, [category]: value }))
  }

  const submitVote = async () => {
    if (Object.keys(votes).length === 0) {
      setError('Sélectionnez au moins une évaluation')
      return
    }
    setLoading(true)
    setError('')

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

    if (!res.ok) {
      setError(data.error || 'Erreur lors du vote')
      return
    }

    onVoteSuccess(data.new_score, data.delta)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(5,10,20,0.92)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--blue-panel)',
        border: '1px solid var(--gold-dark)',
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid var(--blue-border)',
          background: 'linear-gradient(135deg, rgba(200,155,60,0.1), transparent)',
        }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '20px', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: '4px' }}>
            Juger : {player.summoner_name}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
            Votre vote impactera le score et les titres du joueur
          </div>
        </div>

        {/* Categories */}
        <div style={{ padding: '24px 28px' }}>
          {Object.entries(VOTE_OPTIONS).map(([key, cat]) => (
            <div key={key} style={{ marginBottom: '24px' }}>
              <div style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '13px',
                letterSpacing: '0.15em',
                color: 'var(--gold-light)',
                marginBottom: '10px',
              }}>
                {cat.label}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {cat.options.map(opt => {
                  const isSelected = votes[key] === opt.value
                  const isPos = opt.value > 0
                  return (
                    <button key={opt.value} onClick={() => selectVote(key, opt.value)} style={{
                      background: isSelected
                        ? isPos ? 'rgba(40,200,122,0.1)' : 'rgba(200,54,42,0.1)'
                        : 'rgba(13,27,46,0.8)',
                      border: `1px solid ${isSelected ? (isPos ? '#28C87A' : '#C8362A') : 'var(--blue-border)'}`,
                      color: isSelected
                        ? isPos ? '#28C87A' : '#E05A4A'
                        : 'var(--text-dim)',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textAlign: 'left',
                      fontFamily: 'Rajdhani, sans-serif',
                      clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
                      transition: 'all 0.15s',
                    }}>
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Total */}
          {Object.keys(votes).length > 0 && (
            <div style={{
              textAlign: 'center',
              padding: '12px',
              background: total >= 0 ? 'rgba(40,200,122,0.1)' : 'rgba(200,54,42,0.1)',
              border: `1px solid ${total >= 0 ? '#28C87A44' : '#C8362A44'}`,
              marginBottom: '12px',
              fontFamily: 'Cinzel, serif',
              fontSize: '16px',
              color: total >= 0 ? '#28C87A' : '#E05A4A',
            }}>
              Impact total : {total >= 0 ? '+' : ''}{total.toLocaleString('fr-FR')} pts
            </div>
          )}

          {error && (
            <div style={{
              color: '#E05A4A',
              fontSize: '13px',
              textAlign: 'center',
              marginBottom: '12px',
              padding: '8px',
              background: 'rgba(200,54,42,0.1)',
              border: '1px solid rgba(200,54,42,0.3)',
            }}>
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '10px',
          padding: '20px 28px 28px',
          borderTop: '1px solid var(--blue-border)',
        }}>
          <button onClick={onClose} style={{
            flex: 1,
            background: 'transparent',
            border: '1px solid var(--blue-border)',
            color: 'var(--text-dim)',
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            padding: '12px',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}>
            ANNULER
          </button>
          <button onClick={submitVote} disabled={loading} style={{
            flex: 2,
            background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
            border: 'none',
            color: 'var(--blue-deep)',
            fontFamily: 'Cinzel, serif',
            fontSize: '14px',
            fontWeight: 900,
            letterSpacing: '0.15em',
            padding: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'ENVOI...' : '⚡ VALIDER LE JUGEMENT'}
          </button>
        </div>
      </div>
    </div>
  )
}