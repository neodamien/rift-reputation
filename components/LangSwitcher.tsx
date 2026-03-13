'use client'
import { usePathname } from 'next/navigation'

export default function LangSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname()

  const toggle = () => {
    const newLocale = locale === 'fr' ? 'en' : 'fr'
    // Replace the leading /fr or /en with the new locale
    const newPath = '/' + newLocale + pathname.slice(1 + locale.length)
    window.location.href = newPath
  }

  return (
    <button
      onClick={toggle}
      title={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
      style={{
        position: 'fixed', top: '14px', right: '16px', zIndex: 1100,
        background: 'rgba(10,20,40,0.95)',
        border: '1px solid #785A28',
        color: '#C89B3C',
        fontFamily: 'Rajdhani, sans-serif', fontSize: '13px', fontWeight: 700,
        padding: '5px 12px', cursor: 'pointer',
        letterSpacing: '0.1em',
        clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
        transition: 'border-color 0.2s, color 0.2s',
      }}
    >
      {locale === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
    </button>
  )
}
