'use client'
import { useEffect, useRef, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatScore(score: number) {
  if (score >= 1000000) return `${(score / 1000000).toFixed(2)}M`
  return score.toLocaleString('fr-FR')
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
  if (!active || !payload?.length) return null
  const score = payload[0].value
  const isPos = score >= 1000000
  return (
    <div style={{
      background: '#0D1B2E',
      border: `1px solid ${isPos ? '#28C87A' : '#C8362A'}`,
      padding: '10px 16px',
      fontFamily: 'Rajdhani, sans-serif',
    }}>
      <div style={{ color: '#A0B4C8', fontSize: '12px', letterSpacing: '0.1em' }}>{label}</div>
      <div style={{
        fontFamily: 'Cinzel, serif', fontSize: '18px', fontWeight: 700,
        color: isPos ? '#28C87A' : '#E05A4A',
      }}>
        {score.toLocaleString('fr-FR')} pts
      </div>
    </div>
  )
}

export default function ScoreChart({ playerId, currentScore, refreshTrigger }: { playerId: string, currentScore: number, refreshTrigger: number }) {
  const [data, setData] = useState<{ date: string; score: number }[]>([])
  const [loading, setLoading] = useState(true)
  const currentScoreRef = useRef(currentScore)
  currentScoreRef.current = currentScore

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    const doFetch = () => {
      fetch(`/api/history?player_id=${playerId}&_t=${Date.now()}`)
        .then(r => r.json())
        .then(({ history }) => {
          if (cancelled) return
          const now = new Date()
          const todayLabel = `${now.getDate()}/${now.getMonth() + 1}`
          if (!history || history.length === 0) {
            setData([{ date: todayLabel, score: currentScoreRef.current }])
          } else {
            const points = history.map((h: { recorded_at: string; score_snapshot: number }) => ({
              date: formatDate(h.recorded_at),
              score: h.score_snapshot,
            }))
            setData(points)
          }
          setLoading(false)
        })
    }

    if (refreshTrigger === 0) {
      setLoading(true)
      doFetch()
    } else {
      timer = setTimeout(doFetch, 600)
    }

    return () => { cancelled = true; clearTimeout(timer) }
  }, [playerId, refreshTrigger])

  if (loading) return (
    <div style={{
      height: '120px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      color: '#A0B4C8', fontSize: '13px', letterSpacing: '0.1em',
    }}>
      Chargement...
    </div>
  )

  const scores = data.map(d => d.score)
  const rawMin = Math.min(...scores)
  const rawMax = Math.max(...scores)
  const padding = Math.max((rawMax - rawMin) * 0.3, 15000)
  const minScore = rawMin - padding
  const maxScore = rawMax + padding

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{
        fontSize: '11px', letterSpacing: '0.2em',
        color: '#A0B4C8', textTransform: 'uppercase',
        marginBottom: '8px', fontFamily: 'Cinzel, serif',
      }}>
        Évolution du score
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#A0B4C8', fontSize: 10, fontFamily: 'Rajdhani' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            domain={[minScore, maxScore]}
            tickFormatter={formatScore}
            tick={{ fill: '#A0B4C8', fontSize: 10, fontFamily: 'Rajdhani' }}
            axisLine={false} tickLine={false} width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={1000000} stroke="#785A28" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#C89B3C"
            strokeWidth={2}
            dot={{ fill: '#C89B3C', r: 3, strokeWidth: 0 }}
            activeDot={{ fill: '#F0E6D3', r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}