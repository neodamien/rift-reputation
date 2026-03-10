import { supabase } from '@/lib/supabase'
import PlayerCard from '@/components/PlayerCard'
import Header from '@/components/Header'
import SearchBar from '@/components/SearchBar'

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

  return (
    <main style={{ minHeight: '100vh', background: 'var(--blue-deep)' }}>
      <Header />
      <SearchBar />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px',
        }}>
          <h2 style={{
            fontFamily: 'Cinzel, serif', fontSize: '18px',
            letterSpacing: '0.2em', color: 'var(--gold)',
          }}>✦ CLASSEMENT COMMUNAUTAIRE</h2>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--gold-dark), transparent)' }} />
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}>
          {players.map((player, index) => (
            <PlayerCard key={player.id} player={player} rank={index + 1} />
          ))}
        </div>
      </div>
    </main>
  )
}