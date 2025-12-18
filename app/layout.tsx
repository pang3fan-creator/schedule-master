import type React from "react"
// Temporarily disabled Google Fonts due to network issues
// import { Inter } from "next/font/google"
import type { Metadata, Viewport } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Analytics } from "@vercel/analytics/next"
import { SubscriptionProvider } from "@/components/SubscriptionContext"
import { SettingsProvider } from "@/components/SettingsContext"
import "./globals.css"

export const metadata: Metadata = {
  title: "TrySchedule | The #1 Free Schedule Builder (No Login)",
  description: "TrySchedule is the easiest free online schedule builder for students, managers, and teams. Create beautiful schedules in minutes.",
  generator: "v0.app",
  manifest: "/manifest.json",
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
    apple: "/logo.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <SettingsProvider>
            <SubscriptionProvider>
              {children}
            </SubscriptionProvider>
          </SettingsProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
