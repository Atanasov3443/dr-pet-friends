import type { Metadata } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { NavigationLoader } from '@/components/navigation-loader'
import { AuthSessionProvider } from '@/components/session-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter',
})

const interTight = Inter_Tight({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter-tight',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    default:  'Dr. Pet Friends — Намери ветеринар онлайн',
    template: '%s | Dr. Pet Friends',
  },
  description: 'Намерете най-добрите ветеринари и груминг салони за вашия любимец. Онлайн резервации, реални отзиви, спешни 24/7 клиники.',
  keywords: ['ветеринар', 'ветеринарна клиника', 'груминг', 'домашни любимци', 'онлайн запис', 'Bulgaria'],
  authors: [{ name: 'Dr. Pet Friends' }],
  openGraph: {
    type:        'website',
    locale:      'bg_BG',
    siteName:    'Dr. Pet Friends',
    title:       'Dr. Pet Friends — Намери ветеринар онлайн',
    description: 'Намерете най-добрите ветеринари и груминг салони за вашия любимец. Онлайн резервации без телефон.',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Dr. Pet Friends' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Dr. Pet Friends — Намери ветеринар онлайн',
    description: 'Онлайн платформа за ветеринарни услуги в България.',
    images:      ['/api/og'],
  },
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bg" className={`${inter.variable} ${interTight.variable} bg-background`}>
      <body className="font-sans antialiased">
        <AuthSessionProvider>
          <NavigationLoader />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthSessionProvider>
      </body>
    </html>
  )
}
