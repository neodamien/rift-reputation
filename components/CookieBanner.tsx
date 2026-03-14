'use client'
import { useState, useEffect } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'

export default function CookieBanner() {
  const t = useTranslations('cookie')
  const [consent, setConsent] = useState<'accepted' | 'refused' | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent') as 'accepted' | 'refused' | null
    if (stored) {
      setConsent(stored)
    } else {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setConsent('accepted')
    setVisible(false)
  }

  const refuse = () => {
    localStorage.setItem('cookie_consent', 'refused')
    setConsent('refused')
    setVisible(false)
  }

  return (
    <>
      {consent === 'accepted' && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-FR282ZCXTH"
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FR282ZCXTH');
          `}</Script>
        </>
      )}

      {visible && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'rgba(10, 20, 40, 0.97)',
          borderTop: '1px solid rgba(200,155,60,0.3)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <p style={{
            margin: 0,
            color: '#A0B4C8',
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '14px',
            flex: 1,
            minWidth: '240px',
          }}>
            {t('message')}
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={refuse} style={{
              background: 'transparent',
              border: '1px solid rgba(160,180,200,0.4)',
              color: '#A0B4C8',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '8px 18px',
              cursor: 'pointer',
            }}>
              {t('refuse')}
            </button>
            <button onClick={accept} style={{
              background: 'linear-gradient(135deg, rgba(200,155,60,0.2), rgba(200,155,60,0.05))',
              border: '1px solid #C89B3C',
              color: '#C89B3C',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '8px 18px',
              cursor: 'pointer',
            }}>
              {t('accept')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
