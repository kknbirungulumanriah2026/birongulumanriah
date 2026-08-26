// app/(public)/layout.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { DEFAULT_SITE_SETTINGS } from '@/src/data/portalData';
import { SiteSettings } from '@/src/types';
import { getSiteSettings } from '@/src/lib/repository';
import { readCache } from '@/src/lib/cache';
import { PublicSettingsContext } from '@/src/context/PublicSettingsContext';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    const cached = readCache<SiteSettings>('site_settings');
    if (cached) setSettings(cached);

    getSiteSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  return (
    <PublicSettingsContext.Provider value={settings}>
      <div className="flex flex-col min-h-screen">
        <Header villageName={settings.villageName} logoUrl={settings.logoUrl} />
        <main className="flex-grow mt-16">
          {children}
        </main>
        <Footer settings={settings} />
      </div>
    </PublicSettingsContext.Provider>
  );
}
