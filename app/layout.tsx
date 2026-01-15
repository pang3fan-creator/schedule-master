import type React from "react"
// Temporarily disabled Google Fonts due to network issues
// import { Inter } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@next/third-parties/google"
import Script from "next/script"
import { NextIntlClientProvider } from "next-intl"
import { SubscriptionProvider } from "@/components/SubscriptionContext"
import { SettingsProvider } from "@/components/SettingsContext"
import { ThemeProvider } from "@/components/ThemeProvider"
import "./globals.css"

// Import messages for root layout (default to English)
import messages from "@/messages/en.json"

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
  // Organization Schema for brand recognition
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TrySchedule",
    "url": baseUrl,
    "logo": `${baseUrl}/icon.svg`,
    "description": "The easiest free online schedule builder for students, managers, and gyms.",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@tryschedule.com",
    },
  }

  // SoftwareApplication Schema for rich search results
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TrySchedule",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "priceValidUntil": "2026-12-31",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "ratingCount": "526",
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Sarah M." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "Best free schedule builder I've found. The drag-and-drop is so intuitive!"
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Mike T." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "Perfect for creating my weekly class schedule. Love the instant PNG export."
      }
    ],
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Preconnect hints for critical third-party domains */}
          <link rel="preconnect" href="https://clerk.tryschedule.com" />
          <link rel="dns-prefetch" href="https://clerk.tryschedule.com" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

          {/* Organization Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          {/* SoftwareApplication Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
          />
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
          <ThemeProvider>
            <NextIntlClientProvider messages={messages} locale="en">
              <SettingsProvider>
                <SubscriptionProvider>
                  {children}
                </SubscriptionProvider>
              </SettingsProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
          <Analytics />
        </body>
        <GoogleAnalytics gaId="G-7GCLCCR689" />
      </html>
    </ClerkProvider>
  )
}