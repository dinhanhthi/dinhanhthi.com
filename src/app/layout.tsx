import LocalRouteChange from '@/src/app/components/LocalRouteChange'
import Nav from '@/src/app/components/nav/Nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Metadata } from 'next'
import Script from 'next/script'

import { openSans, quicksand } from '@/src/lib/fonts'
import me from '../data/me'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { ThemeProvider } from './components/ThemeProvider'
import './styles.css'

export const revalidate = 60

export const metadata: Metadata = {
  metadataBase: new URL(me.website),
  robots: {
    index: process.env.ENV_MODE !== 'prod' ? false : true,
    follow: process.env.ENV_MODE !== 'prod' ? false : true,
    nocache: process.env.ENV_MODE !== 'prod' ? true : false,
    googleBot: {
      index: process.env.ENV_MODE !== 'prod' ? false : true,
      follow: process.env.ENV_MODE !== 'prod' ? false : true,
      noimageindex: process.env.ENV_MODE !== 'prod' ? true : false
    }
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} font-sans ${quicksand.variable}`}
      suppressHydrationWarning
    >
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <Script id="google-analytics">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
          </Script>
        </>
      )}
      <body suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col bg-stone-100 dark:bg-slate-900">
            <Nav />
            <main className="min-h-0 flex-1">
              <main className="pb-12">{children}</main>
            </main>
            <Footer />
            <ScrollToTop />
          </div>
          <Analytics />
          {process.env.ENV_MODE === 'dev' && <LocalRouteChange localHostname="localhost:3004" />}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
