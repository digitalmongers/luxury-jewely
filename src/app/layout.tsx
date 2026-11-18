import type { Metadata, Viewport } from 'next';
import {
  Cormorant_Garamond,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Virelle — Trinity Triumph Platinum 950 Bali Earrings (EBAL0094)',
    template: '%s · Virelle Fine Jewellery',
  },
  description:
    'Explore the Trinity Triumph Platinum Bali Earrings (EBAL0094) by Virelle. Sculpted in PGI-certified Platinum 950 with natural EF-VVS diamond accents, precision hinged clasp, 360° atelier viewer, and insured vault dispatch.',
  keywords: [
    'Virelle Fine Jewellery',
    'Trinity Triumph Platinum Bali Earrings',
    'EBAL0094',
    'Platinum 950 hoops',
    'PGI certified platinum earrings',
  ],
  authors: [{ name: 'Virelle Platinum Atelier' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Virelle Fine Jewellery',
    title: 'Virelle — Trinity Triumph Platinum 950 Bali Earrings (EBAL0094)',
    description:
      'Interlocking three-strand sculptural hoops forged in PGI-certified Platinum 950 with natural EF-VVS diamond accents.',
    images: [
      {
        url: '/images/hero_platinum_bali_1794984555175.jpg',
        width: 1200,
        height: 900,
        alt: 'Trinity Triumph Platinum Bali Earrings resting on dark obsidian stone',
      },
      {
        url: '/images/editorial_ear_profile_1794984553515.jpg',
        width: 900,
        height: 1200,
        alt: 'Editorial ear profile showing Trinity Triumph Platinum Bali Earrings worn',
      },
      {
        url: '/images/macro_clasp_craft_1794984551256.jpg',
        width: 1200,
        height: 900,
        alt: 'Macro view of the hinged click-top snap lock clasp on Platinum 950 bali hoop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virelle — Trinity Triumph Platinum 950 Bali Earrings',
    description:
      'Sculpted three-strand hoops in PGI-certified Platinum 950 with micro-bezel diamonds.',
    images: ['/images/hero_platinum_bali_1794984555175.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#08080A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${cormorant.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-[#08080A] text-[#F4F4F6] antialiased selection:bg-[#D6C7AE] selection:text-[#08080A]">
        {children}
      </body>
    </html>
  );
}
