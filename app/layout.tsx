import './globals.css'

export const metadata = {
  title: 'Rift Reputation',
  description: 'League of Legends Community Tribunal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" style={{ background: '#0A1428' }}>
      <body style={{ background: '#0A1428', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}