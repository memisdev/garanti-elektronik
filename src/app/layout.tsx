import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garanti Elektronik | Endüstriyel Elektronik Çözümleri",
  description:
    "Endüstriyel otomasyon, servo motor, PLC, HMI ve daha fazlası. Türkiye'nin güvenilir endüstriyel elektronik tedarikçisi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
