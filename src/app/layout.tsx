import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo/wdth.css';
import './globals.css';
import { appUrl } from '@/lib/env';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: { default: 'Berk Spot Hırdavat Bursa | Tüm hırdavat ürünleri spot fiyatlarla', template: '%s | Berk Spot Hırdavat' },
  description: 'Bursa Yıldırım Bağlaraltı\'nda Berk Spot Hırdavat: şarjlı aletler, el aletleri, bahçe, ölçüm, vida-dübel ve iş güvenliği ürünleri. Kartla güvenli ödeme, kargo veya mağazadan teslim.',
  openGraph: { type: 'website', locale: 'tr_TR', siteName: 'Berk Spot Hırdavat', images: ['/ornek/paylasim.webp'] },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#0F1E45',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
