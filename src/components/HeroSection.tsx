// src/components/HeroSection.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { HERO_BG_URL } from '@/src/data/portalData';
import { SiteSettings } from '@/src/types';

interface HeroSectionProps {
  settings?: SiteSettings | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  const bgUrl = settings?.heroBgUrl || HERO_BG_URL;
  const title = settings?.heroTitle || 'Nagori';
  const highlight = settings?.heroTitleHighlight || 'Birung Ulu Manriah.';
  const subtitle = settings?.heroSubtitle || 'Kec. Sidamanik Kab. Simalungun';
  const avgTime = settings?.avgServiceTime || '10';

  // Typing effect
  const [displayTitle, setDisplayTitle] = useState('');
  const [displayHighlight, setDisplayHighlight] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const fullTitle = title;
    const fullHighlight = highlight;

    if (!isDeleting) {
      if (displayTitle.length < fullTitle.length) {
        timeout = setTimeout(() => {
          setDisplayTitle(fullTitle.substring(0, displayTitle.length + 1));
        }, 150);
      } else if (displayHighlight.length < fullHighlight.length) {
        timeout = setTimeout(() => {
          setDisplayHighlight(fullHighlight.substring(0, displayHighlight.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2500);
      }
    } else {
      if (displayHighlight.length > 0) {
        timeout = setTimeout(() => {
          setDisplayHighlight(fullHighlight.substring(0, displayHighlight.length - 1));
        }, 60);
      } else if (displayTitle.length > 0) {
        timeout = setTimeout(() => {
          setDisplayTitle(fullTitle.substring(0, displayTitle.length - 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayTitle, displayHighlight, isDeleting, title, highlight]);

  return (
    <section className="relative w-full h-[88vh] min-h-[600px] max-h-[880px] overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center scale-105 animate-ken-burns"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/75 via-[#1A1A1A]/40 to-[#FCFCFC]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl leading-[1.08] text-white font-semibold mb-6 tracking-tight drop-shadow-xs animate-fadeInUp">
          {displayTitle}
          {(!isDeleting && displayHighlight.length === 0 || isDeleting && displayHighlight.length === 0) && (
            <span className="typing-cursor">|</span>
          )}
          <br />
          <span className="font-light text-gray-200">{displayHighlight}</span>
          {displayHighlight.length > 0 && (
            <span className="typing-cursor">|</span>
          )}
        </h1>

        <p className="font-body text-sm sm:text-base md:text-lg text-white/85 max-w-xl mx-auto mb-8 animate-fadeInUp leading-relaxed font-normal">
          {subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-3 animate-fadeInUp">
          {/* CTA Buttons */}
        </div>
      </div>
    </section>
  );
};