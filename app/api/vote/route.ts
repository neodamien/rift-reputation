import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { player_id, behavior_score, skill_score, comm_score, punc_score } = body

  // Récupérer l'IP du votant
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  // Vérifier si cette IP a déjà voté pour ce joueur dans les 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: existingVotes } = await supabase
    .from('votes')
    .select('id, created_at')
    .eq('player_id', player_id)
    .eq('voter_ip', ip)
    .gte('created_at', since)

  // Compter les votes des dernières 24h
  if (existingVotes && existingVotes.length >= 10) {
    return NextResponse.json(
      { error: 'Vous avez atteint la limite de 10 votes par joueur par 24h' },
      { status: 429 }
    )
  }

  // Calculer le delta total
  const total_delta = (behavior_score || 0) + (skill_score || 0) + (comm_score || 0) + (punc_score || 0)

  // Enregistrer le vote
  const { error: voteError } = await supabase
    .from('votes')
    .insert({
      player_id,
      voter_ip: ip,
      behavior_score: behavior_score || 0,
      skill_score: skill_score || 0,
      comm_score: comm_score || 0,
      punc_score: punc_score || 0,
      total_delta,
    })

  if (voteError) {
    return NextResponse.json({ error: 'Erreur enregistrement vote' }, { status: 500 })
  }

  // Mettre à jour le score du joueur
  const { data: player } = await supabase
    .from('players')
    .select('score')
    .eq('id', player_id)
    .single()

  const newScore = Math.max(0, (player?.score || 1000000) + total_delta)

  await supabase
    .from('players')
    .update({ score: newScore, updated_at: new Date().toISOString() })
    .eq('id', player_id)

  // Enregistrer dans l'historique
  await supabase
    .from('score_history')
    .insert({ player_id, score_snapshot: newScore })

  return NextResponse.json({ success: true, new_score: newScore, delta: total_delta })
}