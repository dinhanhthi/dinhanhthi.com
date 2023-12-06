import toTopImg from '@/public/to-top.webp'
import Nav from '@/src/app/components/nav/Nav'
import LocalRouteChange from '@notion-x/src/components/LocalRouteChange'
import ScrollToTop from '@notion-x/src/components/ScrollToTop'
import '@notion-x/src/style/notion-x.scss'
import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'
import Script from 'next/script'
import '../fontello/css/fontello.css'

import me from '../data/me'
import { poppins } from './lib/fonts'
import './styles.scss'

export const revalidate = 20

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
    <html lang="en" className={poppins.className}>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=G-K3YRSB918B`} />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-K3YRSB918B');
        `}
      </Script>
      <body suppressHydrationWarning={true}>
        <div className="flex min-h-screen flex-col justify-between">
          <Nav />
          <div className="mb-auto">
            <main>{children}</main>
          </div>
          <ScrollToTop image={toTopImg} />
        </div>
        <Analytics />
        {process.env.ENV_MODE === 'dev' && <LocalRouteChange localHostname="localhost:3004" />}
      </body>
    </html>
  )
}
