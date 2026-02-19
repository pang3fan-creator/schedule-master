import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.tryschedule.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      es: "/es",
      "x-default": "/",
    },
  },
  title: "TrySchedule | Free Online Schedule Builder (No Login Required)",
  description:
    "The easiest free online schedule builder. Drag-and-drop interface, instant PNG export. No signup needed. PDF & AI tools available for Pro users.",
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
    description:
      "The easiest free online schedule builder. Drag-and-drop interface, instant PNG export. No signup needed. PDF & AI tools available for Pro users.",
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
    description:
      "The easiest free online schedule builder. Drag-and-drop interface, instant PNG export. No signup needed.",
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3b82f6",
};

// Helper function to get locale from middleware-set header
async function getLocaleFromHeaders(): Promise<string> {
  const headersList = await headers();
  // The middleware sets the 'x-locale' header based on the URL path
  return headersList.get("x-locale") || "en";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromHeaders();

  return (
    <html lang={locale} suppressHydrationWarning>
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

        {/* Google AdSense - loaded after interactive */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6636417287024414"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-7GCLCCR689" />
    </html>
  );
}
