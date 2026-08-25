import React from 'react';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow mt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
