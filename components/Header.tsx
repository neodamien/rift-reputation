export default function Header() {
  return (
    <header style={{
      textAlign: 'center',
      padding: '48px 24px 32px',
      borderBottom: '1px solid var(--blue-border)',
      background: 'linear-gradient(180deg, rgba(10,20,40,0.95) 0%, transparent 100%)',
      position: 'relative'
    }}>
      <h1 style={{
        fontFamily: 'Cinzel, serif',
        fontSize: 'clamp(28px, 5vw, 52px)',
        fontWeight: 900,
        letterSpacing: '0.15em',
        background: 'linear-gradient(180deg, #F0E6D3 0%, #C89B3C 50%, #785A28 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
      }}>
        RIFT REPUTATION
      </h1>
      <p style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontSize: '14px',
        letterSpacing: '0.4em',
        color: 'var(--teal)',
        textTransform: 'uppercase',
        marginTop: '8px',
        fontWeight: 500,
      }}>
        League of Legends · Community Tribunal
      </p>
    </header>
  )
}