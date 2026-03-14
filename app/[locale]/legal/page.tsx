import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })

  return (
    <main style={{
      maxWidth: '760px',
      margin: '0 auto',
      padding: '64px 24px 80px',
      color: '#A0B4C8',
      fontFamily: 'Rajdhani, sans-serif',
      fontSize: '15px',
      lineHeight: 1.7,
    }}>
      <div style={{ marginBottom: '32px' }}>
        <Link href={`/${locale}`} style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.1em',
          color: 'rgba(160,180,200,0.5)',
          textDecoration: 'none',
        }}>
          ← Rift Reputation
        </Link>
      </div>

      <h1 style={{
        fontFamily: 'Cinzel, serif',
        fontSize: 'clamp(22px, 4vw, 36px)',
        fontWeight: 900,
        letterSpacing: '0.15em',
        background: 'linear-gradient(180deg, #F0E6D3 0%, #C89B3C 50%, #785A28 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '48px',
      }}>
        {t('title')}
      </h1>

      <Section title={t('editor_title')}>
        <p>{t('editor_body')}</p>
        <p><strong>{t('editor_name')}</strong></p>
        <p>
          <strong>{t('editor_contact')} :</strong>{' '}
          <a href="mailto:contact@rift-reputation.com" style={{ color: '#C89B3C' }}>
            contact@rift-reputation.com
          </a>
        </p>
      </Section>

      <Section title={t('hosting_title')}>
        <p>{t('hosting_by')}</p>
        <p>
          <strong>Vercel Inc.</strong><br />
          340 Pine Street, Suite 900<br />
          San Francisco, CA 94104 — USA<br />
          <a href="https://vercel.com" style={{ color: '#C89B3C' }}>https://vercel.com</a>
        </p>
      </Section>

      <Section title={t('data_title')}>
        <p>{t('data_intro')}</p>
        <ul style={{ paddingLeft: '20px' }}>
          <li>{t('data_analytics')}</li>
          <li>{t('data_votes')}</li>
        </ul>
      </Section>

      <Section title={t('retention_title')}>
        <ul style={{ paddingLeft: '20px' }}>
          <li>{t('retention_votes')}</li>
          <li>{t('retention_analytics')}</li>
        </ul>
      </Section>

      <Section title={t('cookies_title')}>
        <p>{t('cookies_body')}</p>
      </Section>

      <Section title={t('rights_title')}>
        <p>
          {t('rights_body')}{' '}
          <a href="mailto:contact@rift-reputation.com" style={{ color: '#C89B3C' }}>
            contact@rift-reputation.com
          </a>
        </p>
      </Section>

      <p style={{ marginTop: '48px', fontSize: '13px', color: 'rgba(160,180,200,0.5)' }}>
        {t('updated')}
      </p>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '36px' }}>
      <h2 style={{
        fontFamily: 'Cinzel, serif',
        fontSize: '16px',
        letterSpacing: '0.15em',
        color: '#C89B3C',
        marginBottom: '12px',
        borderBottom: '1px solid rgba(200,155,60,0.2)',
        paddingBottom: '8px',
      }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
