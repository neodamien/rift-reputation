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
    .select('total_delta, created_at')
    .eq('player_id', player_id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    return NextResponse.json({ error: 'Erreur BDD' }, { status: 500 })
  }

  return NextResponse.json({ votes: data })
}
