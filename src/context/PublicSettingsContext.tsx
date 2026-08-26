'use client';

import { createContext, useContext } from 'react';
import { SiteSettings } from '../types';

export const PublicSettingsContext = createContext<SiteSettings | null>(null);

export function usePublicSettings(): SiteSettings {
  const settings = useContext(PublicSettingsContext);
  if (!settings) throw new Error('usePublicSettings must be used within PublicSettingsProvider');
  return settings;
}
