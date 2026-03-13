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
    .from('score_history')
    .select('score_snapshot, recorded_at')
    .eq('player_id', player_id)
    .order('recorded_at', { ascending: true })
    .limit(30)

  if (error) {
    return NextResponse.json({ error: 'Erreur BDD' }, { status: 500 })
  }

  return NextResponse.json({ history: data })
}