import './globals.css'

export const metadata = {
  title: 'Rift Reputation',
  description: 'League of Legends Community Tribunal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html style={{ background: '#0A1428' }}>
      <head>
        <meta name="google-site-verification" content="Z3wsWkOuJpgcSN00kVkFt5vV3fwJvex9vDFFHyOLZBo" />
      </head>
      <body style={{ background: '#0A1428', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}