import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import LangSwitcher from '@/components/LangSwitcher'
import CookieBanner from '@/components/CookieBanner'

const locales = ['fr', 'en']

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <LangSwitcher locale={locale} />
      {children}
      <CookieBanner />
    </NextIntlClientProvider>
  )
}
