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
  title: 'Dr. Pet Friends | Ветеринарна платформа',
  description: 'Намерете най-добрите ветеринарни специалисти за вашия любимец. Търсене по специалност, град и вид животно.',
  generator: 'v0.app',
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
