import type { Metadata, Viewport } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import { SkipLink } from "@/components/a11y/skip-link";
import { AdSenseScript } from "@/components/ads/adsense-script";
import { GoogleAnalyticsScript } from "@/components/analytics/google-analytics";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers/providers";
import { RegisterSW } from "@/components/pwa/register-sw";
import { SITE } from "@/lib/constants";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.titleDefault,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  keywords: [
    "recetas andaluzas",
    "cocina andaluza",
    "recetas fáciles andalucía",
    "gazpacho andaluz",
    "salmorejo cordobés",
    "tapas andaluzas",
    "guisos andaluces",
    "recetas españolas",
    "modo cocina",
  ],
  alternates: {
    canonical: SITE.url,
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "256x256" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon.png"],
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.titleDefault,
    description: SITE.description,
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE.titleDefault,
    description: SITE.description,
    images: ["/icons/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE.name,
  },
  ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
    ? {
        other: {
          "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${newsreader.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="app-shell flex min-h-full flex-col bg-background text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("recetas-andaluzas-storage");var t=s?JSON.parse(s).state?.tema||"light":"light";var d=t==="dark";document.documentElement.classList.toggle("dark",d)}catch(e){}})()`,
          }}
        />
        <SkipLink />
        <AdSenseScript />
        <GoogleAnalyticsScript />
        <RegisterSW />
        <Providers>
          <Header />
          <main id="contenido-principal" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
