import { supabase } from '@/lib/supabase'
import HubClient from '@/components/HubClient'

export const revalidate = 0

export default async function Home() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { data: players, error },
    { data: recentlyJudged },
    { data: hallOfFame },
    { data: hallOfShame },
    { data: thisWeekData },
  ] = await Promise.all([
    supabase.from('players').select('*').order('score', { ascending: false }),
    supabase.from('players').select('*').order('updated_at', { ascending: false }).limit(12),
    supabase.from('players').select('*').order('score', { ascending: false }).limit(12),
    supabase.from('players').select('*').order('score', { ascending: true }).limit(12),
    supabase.from('players').select('*').gte('updated_at', sevenDaysAgo).order('score', { ascending: false }),
  ])

  if (error) {
    console.error(error)
    return <div>Erreur de connexion</div>
  }

  const thisWeekBest = (thisWeekData || []).slice(0, 3)
  const thisWeekWorst = [...(thisWeekData || [])].sort((a, b) => a.score - b.score).slice(0, 3)

  return (
    <HubClient
      initialPlayers={players || []}
      recentlyJudged={recentlyJudged || []}
      hallOfFame={hallOfFame || []}
      hallOfShame={hallOfShame || []}
      thisWeekBest={thisWeekBest}
      thisWeekWorst={thisWeekWorst}
    />
  )
}
