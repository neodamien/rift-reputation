import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const player_id = searchParams.get('player_id')

  if (!player_id) {
    return NextResponse.json({ error: 'player_id requis' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('votes')
    .select('behavior_score, skill_score, comm_score, punc_score')
    .eq('player_id', player_id)

  if (error) {
    return NextResponse.json({ error: 'Erreur BDD' }, { status: 500 })
  }

  const stats = {
    behavior_total: data.reduce((s, v) => s + (v.behavior_score || 0), 0),
    skill_total: data.reduce((s, v) => s + (v.skill_score || 0), 0),
    comm_total: data.reduce((s, v) => s + (v.comm_score || 0), 0),
    punc_total: data.reduce((s, v) => s + (v.punc_score || 0), 0),
    vote_count: data.length,
  }

  return NextResponse.json({ stats })
}
