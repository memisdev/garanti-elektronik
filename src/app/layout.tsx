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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111318" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://garantielektronik.net"),
  title: {
    default: "Garanti Elektronik | Orijinal TV Yedek Parça ve Anakart Tedarikçisi",
    template: "%s | Garanti Elektronik",
  },
  description:
    "Samsung, LG, Vestel ve daha fazlası için orijinal TV yedek parça ve anakart tedariki. 500+ ürün, aynı gün kargo, teknik destek.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Garanti Elektronik",
  },
  twitter: {
    card: "summary_large_image",
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
        <link rel="dns-prefetch" href="https://vacerlceqblpygsdjpeq.supabase.co" />
        <link rel="preconnect" href="https://vacerlceqblpygsdjpeq.supabase.co" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
