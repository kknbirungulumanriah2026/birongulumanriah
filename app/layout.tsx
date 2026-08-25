// app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portal Desa Digital - Nagori Birong Ulu Manriah',
  description:
    'Nagori Birong Ulu Manriah, Kec. Sidamanik Kab. Simalungun.',
  keywords: ['Nagori Birong Ulu Manriah', 'Portal Desa', 'Simalungun', 'Desa Digital'],
  authors: [{ name: 'Nagori Birong Ulu Manriah' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Portal Desa Digital - Nagori Birong Ulu Manriah',
    description:
      'Nagori Birong Ulu Manriah, Kec. Sidamanik Kab. Simalungun.',
    type: 'website',
    locale: 'id_ID',
    url: 'https://nagori-birongulu-manriah.desa.id',
    siteName: 'Portal Desa Nagori Birong Ulu Manriah',
    images: [
      {
        url: '/birong.png',
        width: 512,
        height: 512,
        alt: 'Logo Nagori Birong Ulu Manriah',
      },
    ],
  },
  icons: {
    icon: '/birong.png',
    apple: '/birong.png',
  },
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