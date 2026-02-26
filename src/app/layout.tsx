import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://garantielektronik.net"),
  title: {
    default: "Garanti Elektronik | Orijinal TV Yedek Parça ve Anakart Tedarikçisi",
    template: "%s | Garanti Elektronik",
  },
  description:
    "Samsung, LG, Vestel ve daha fazlası için orijinal TV yedek parça ve anakart tedariki. 500+ ürün, aynı gün kargo, teknik destek.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Garanti Elektronik",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Garanti Elektronik — Orijinal TV Yedek Parça Tedarikçisi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable} suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <>
            <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="anonymous" />
          </>
        )}
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
