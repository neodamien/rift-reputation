import { supabase } from '@/lib/supabase'
import HubClient from '@/components/HubClient'

export const revalidate = 0

export default async function Home() {
  const { data: players, error } = await supabase
    .from('players')
    .select('*')
    .order('score', { ascending: false })

  if (error) {
    console.error(error)
    return <div>Erreur de connexion</div>
  }

  return <HubClient initialPlayers={players} />
}