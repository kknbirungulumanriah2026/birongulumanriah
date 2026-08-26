// app/layout.tsx

import type { Metadata, Viewport } from 'next';
import './globals.css';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nagori-birongulu-manriah.desa.id';

export const metadata: Metadata = {
  title: 'Portal Desa Digital - Nagori Birong Ulu Manriah',
  description:
    'Nagori Birong Ulu Manriah, Kec. Sidamanik Kab. Simalungun.',
  keywords: ['Nagori Birong Ulu Manriah', 'Portal Desa', 'Simalungun', 'Desa Digital'],
  authors: [{ name: 'Nagori Birong Ulu Manriah' }],
  robots: 'index, follow',
  metadataBase: new URL(appUrl),
  openGraph: {
    title: 'Portal Desa Digital - Nagori Birong Ulu Manriah',
    description:
      'Nagori Birong Ulu Manriah, Kec. Sidamanik Kab. Simalungun.',
    type: 'website',
    locale: 'id_ID',
    url: 'https://nagori-birongulu-manriah.desa.id',
    siteName: 'Portal Desa Nagori Birong Ulu Manriah',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FCFCFC] font-body text-[#1A1A1A] antialiased">
        {children}
      </body>
    </html>
  );
}