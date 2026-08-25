import { NewsItem, VillageStat, VillageOfficial, SiteSettings } from '../types';

export const LOGO_URL = '/birong.png';

export const HERO_BG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWrSQUgbH4e43Q2PHITUQivqQqP0LcOT-FVpUnc_ncoxrII_2HvNGTiUcPo6cAS6T2EIOpIwHtIwfAhkpyi0xvd_4j1pzbjwyg3u6_aq5jQzqyhiH3ia_4WFRGoPjMEibMmTEou6DumEaRJVdPPi3YAD6iBQlLb_lpV2nr8_i1U9OgHJii8DCBVf5PeX4IBXXKGdgNqGvTUM-UV0Ov0MsKofmfJHAF85KTB3IdN5tkFW8rhPOjQrUG';

export const CTA_BG_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBk67yMeOQp5KN7cPcFd7WDtD3X5wY04bacNlsI5g0HRwDI6RkDqofd88QpcNiXSsjlNrfERi7iiPbSSHhBi0L21AL-usR-iOtJAtshi9-nGEOz2sLgt1O1b4TRenM7M0SQpnP4reLPBS87dqyvct3g8gnEOA2NpntffAg27Opef6Kis_OssnHNtjdc-GuWyzpbeQP_TGsS6EYp1sKPzQBR1h8I4youtAfHcNjVtO33hfMUeUMe2Rsa';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  villageName: 'Nagori Birong Ulu Manriah',
  logoUrl: LOGO_URL,
  heroTitle: 'Nagori',
  heroTitleHighlight: 'Birong Ulu Manriah.',
  heroSubtitle: 'Kec. Sidamanik Kab. Simalungun',
  heroBgUrl: HERO_BG_URL,
  ctaTitle: 'Pantau Perkembangan Nagori Lewat Portal Digital',
  ctaSubtitle: 'Dapatkan informasi terkini mengenai berita, agenda, dan program Nagori Birong Ulu Manriah secara terbuka dan terpercaya kapan pun Anda membutuhkannya.',
  ctaBgUrl: CTA_BG_URL,
  contactPhone: '0812-3456-7890',
  contactEmail: 'halo@birongulumanriah.desa.id',
  contactAddress: 'Nagori Birong Ulu Manriah, Kec. Sidamanik, Kab. Simalungun, Sumatera Utara 21171',
  operatingHours: 'Senin - Jumat | 08:00 - 15:30 WIB',
  avgServiceTime: '15',
};

// All content lives in Supabase — no bundled dummy data.
export const NEWS_DATA: NewsItem[] = [];

export const VILLAGE_STATS: VillageStat[] = [];

export const VILLAGE_OFFICIALS: VillageOfficial[] = [];
