'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { VILLAGE_STATS } from '../data/portalData';
import { VillageStat } from '../types';

interface StatisticsSectionProps {
  stats?: VillageStat[];
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  stats = VILLAGE_STATS,
}) => {
  const activeStats = stats.length > 0 ? stats : VILLAGE_STATS;
  const [counts, setCounts] = useState<number[]>(activeStats.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    setCounts(activeStats.map(() => 0));
    animatedRef.current = false;
  }, [stats]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;

          activeStats.forEach((stat, index) => {
            const target = stat.targetNumber;
            const duration = 2000;
            const steps = 50;
            const stepValue = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += stepValue;
              if (current >= target) {
                setCounts((prev) => {
                  const updated = [...prev];
                  updated[index] = target;
                  return updated;
                });
                clearInterval(timer);
              } else {
                setCounts((prev) => {
                  const updated = [...prev];
                  updated[index] = Math.ceil(current);
                  return updated;
                });
              }
            }, duration / steps);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [activeStats]);

  return (
    <section
      id="statistik"
      ref={sectionRef}
      className="relative w-full overflow-hidden border-y border-[#EDEDE9] bg-gradient-to-b from-[#FAFAF7] via-white to-[#FAFAF7] py-20 sm:py-28 px-6"
    >
      {/* Decorative accent: dotted grid top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 h-64 w-64 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #D4D4D8 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage:
            'radial-gradient(circle at top right, black 0%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(circle at top right, black 0%, transparent 70%)',
        }}
      />
      {/* Decorative accent: subtle emerald glow bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 border-b border-[#EDEDE9] pb-8 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/60 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Data &amp; Informasi Terbuka
              </span>
            </div>
            <h2 className="font-headline text-3xl font-semibold tracking-tight text-[#1A1A1A] sm:text-4xl">
              Capaian &amp; Statistik Desa
            </h2>
            <p className="mt-3 max-w-lg font-body text-sm leading-relaxed text-gray-500">
              Ringkasan indikator utama yang dikelola melalui panel admin.
            </p>
          </div>

          <Link
            href="/profil"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#EDEDE9] bg-white px-4 py-2.5 font-body text-xs font-medium text-gray-700 shadow-xs transition-all hover:border-emerald-200 hover:bg-emerald-50/40 hover:text-emerald-700 hover:shadow-sm"
          >
            <span className="material-symbols-outlined text-base text-emerald-600">
              analytics
            </span>
            <span>Lihat Detail Statistik</span>
            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-0.5">
              east
            </span>
          </Link>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activeStats.map((stat, idx) => (
            <div
              key={`${stat.label}-${idx}`}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-[#EDEDE9] bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200/80 hover:shadow-lg hover:shadow-emerald-100/40"
            >
              {/* Top accent bar */}
              <span className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500 group-hover:w-full" />

              {/* Icon + Label */}
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-colors group-hover:bg-emerald-100">
                  <span className="material-symbols-outlined text-[22px]">
                    {stat.icon}
                  </span>
                </div>
                <span className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                  {stat.label}
                </span>
              </div>

              {/* Number + Unit */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline text-4xl font-semibold tracking-tight text-[#1A1A1A] sm:text-5xl">
                  {(counts[idx] ?? 0).toLocaleString('id-ID')}
                </span>
                <span className="font-headline text-xl font-medium text-emerald-600">
                  {stat.unit}
                </span>
              </div>

              {/* Description */}
              <p className="font-body text-xs leading-relaxed text-gray-500">
                {stat.description}
              </p>

              {/* Bottom progress indicator */}
              <div className="mt-auto flex items-center gap-2 pt-2">
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <span
                    className="block h-full origin-left rounded-full bg-emerald-500 transition-transform duration-1000 ease-out"
                    style={{
                      transform:
                        (counts[idx] ?? 0) > 0 ? 'scaleX(1)' : 'scaleX(0)',
                    }}
                  />
                </span>
                <span className="font-body text-[10px] font-medium text-gray-400">
                  LIVE
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <p className="mt-10 text-center font-body text-[11px] text-gray-400">
          Data diperbarui secara berkala melalui panel admin.
        </p>
      </div>
    </section>
  );
};