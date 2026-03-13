import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const RIOT_API_KEY = process.env.RIOT_API_KEY as string

const REGION_MAP: Record<string, string> = {
  EUW: 'euw1',
  EUNE: 'eun1',
  NA: 'na1',
  KR: 'kr',
  BR: 'br1',
  LAN: 'la1',
}

const ROUTING_MAP: Record<string, string> = {
  EUW: 'europe',
  EUNE: 'europe',
  NA: 'americas',
  KR: 'asia',
  BR: 'americas',
  LAN: 'americas',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const tag = searchParams.get('tag')
  const region = searchParams.get('region') || 'EUW'

  if (!name || !tag) {
    return NextResponse.json({ error: 'Nom et tag requis' }, { status: 400 })
  }

  // Vérifier si le joueur existe déjà en BDD
  const { data: existing } = await supabase
    .from('players')
    .select('*')
    .ilike('summoner_name', name)
    .eq('region', region)
    .single()

  if (existing) {
    return NextResponse.json({ player: existing, fromCache: true })
  }

  // Sinon appeler l'API Riot
  try {
    const routing = ROUTING_MAP[region]

    // 1. Récupérer le PUUID via Riot ID
    const accountRes = await fetch(
      `https://${routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      { headers: { 'X-Riot-Token': RIOT_API_KEY } }
    )

    if (!accountRes.ok) {
      return NextResponse.json({ error: 'Joueur introuvable sur Riot' }, { status: 404 })
    }

    const account = await accountRes.json()

    // 2. Récupérer les infos du summoner
    const platform = REGION_MAP[region]
    const summonerRes = await fetch(
      `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
      { headers: { 'X-Riot-Token': RIOT_API_KEY } }
    )

    const summoner = await summonerRes.json()

    // 3. Récupérer le rang via PUUID directement
    const rankRes = await fetch(
      `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${account.puuid}`,
      { headers: { 'X-Riot-Token': RIOT_API_KEY } }
    )

    const rankData = await rankRes.json()
    console.log('RANK DATA:', JSON.stringify(rankData))
    const soloQ = Array.isArray(rankData)
      ? rankData.find(r => r.queueType === 'RANKED_SOLO_5x5')
      : null
    const rankTier = soloQ
      ? `${soloQ.tier} ${soloQ.rank}`
      : 'UNRANKED'
    const wins = soloQ?.wins ?? null
    const losses = soloQ?.losses ?? null

    console.log('WINS:', soloQ?.wins, 'LOSSES:', soloQ?.losses)
    console.log('INSERT DATA:', { wins, losses, profile_icon_id: summoner.profileIconId })

    // 4. Créer le joueur dans la BDD
    const { data: newPlayer } = await supabase
      .from('players')
      .insert({
        summoner_name: account.gameName,
        riot_tag: `#${account.tagLine}`,
        region,
        score: 1000000,
        rank_tier: rankTier,
        wins,
        losses,
        profile_icon_id: summoner.profileIconId,
      })
      .select()
      .single()

    // 5. Snapshot initial dans l'historique
    await supabase
      .from('score_history')
      .insert({ player_id: newPlayer.id, score_snapshot: 1000000 })

    return NextResponse.json({ player: newPlayer, fromCache: false })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur API Riot' }, { status: 500 })
  }
}