
import type React from "react"
// Temporarily disabled Google Fonts due to network issues
// import { Inter } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@next/third-parties/google"
import Script from "next/script"
import "./globals.css"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tryschedule.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  title: "TrySchedule | Free Online Schedule Builder (No Login Required)",
  description: "The easiest free online schedule builder. Drag-and-drop interface, instant PNG export. No signup needed. PDF & AI tools available for Pro users.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [
    "free schedule builder",
    "online schedule builder",
    "schedule builder",
    "free online schedule builder",
    "visual schedule builder",
    "employee schedule builder",
    "work schedule builder",
    "weekly schedule builder",
    "schedule planner",
    "shift scheduler",
  ],
  openGraph: {
    title: "TrySchedule | Free Online Schedule Builder (No Login Required)",
    description: "The easiest free online schedule builder. Drag-and-drop interface, instant PNG export. No signup needed. PDF & AI tools available for Pro users.",
    type: "website",
    siteName: "TrySchedule",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "TrySchedule - Free Online Schedule Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrySchedule | Free Online Schedule Builder",
    description: "The easiest free online schedule builder. Drag-and-drop interface, instant PNG export. No signup needed.",
    images: ["/opengraph-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TrySchedule",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/icon.svg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3b82f6",
}

// Google Fonts disabled - using system fonts from globals.css
// const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect hints for critical third-party domains */}
        <link rel="preconnect" href="https://clerk.tryschedule.com" />
        <link rel="dns-prefetch" href="https://clerk.tryschedule.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Microsoft Clarity - deferred to avoid render blocking */}
        <Script
          id="microsoft-clarity"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "uqtlm9nmco");
              `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-7GCLCCR689" />
    </html>
  )
}