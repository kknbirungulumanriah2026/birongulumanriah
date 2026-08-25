-- ============================================================================
-- sidodadi-portal · Initial data seed
-- ----------------------------------------------------------------------------
-- Insert the same default data currently shipped in src/data/portalData.ts so
-- the app behaves identically after migrating to Supabase.
-- Safe to re-run: uses ON CONFLICT DO NOTHING.
-- ============================================================================

-- 1. site_settings ------------------------------------------------------------
insert into public.site_settings (
  id, village_name, logo_url,
  hero_title, hero_title_highlight, hero_subtitle, hero_bg_url,
  cta_title, cta_subtitle, cta_bg_url,
  contact_phone, contact_email, contact_address,
  operating_hours, avg_service_time
) values (
  'singleton',
  'Nagori Birong Ulu Manriah',
  '/birong.png',
  'Nagori', 'Birong Ulu Manriah.',
  'Kec. Sidamanik Kab. Simalungun',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBWrSQUgbH4e43Q2PHITUQivqQqP0LcOT-FVpUnc_ncoxrII_2HvNGTiUcPo6cAS6T2EIOpIwHtIwfAhkpyi0xvd_4j1pzbjwyg3u6_aq5jQzqyhiH3ia_4WFRGoPjMEibMmTEou6DumEaRJVdPPi3YAD6iBQlLb_lpV2nr8_i1U9OgHJii8DCBVf5PeX4IBXXKGdgNqGvTUM-UV0Ov0MsKofmfJHAF85KTB3IdN5tkFW8rhPOjQrUG',
  'Siap Memulai Administrasi Anda Hari Ini?',
  'Tak perlu lagi mengantre lama. Akses seluruh layanan Nagori Birong Ulu Manriah secara mandiri, transparan, dan terpercaya kapan pun Anda membutuhkannya.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBk67yMeOQp5KN7cPcFd7WDtD3X5wY04bacNlsI5g0HRwDI6RkDqofd88QpcNiXSsjlNrfERi7iiPbSSHhBi0L21AL-usR-iOtJAtshi9-nGEOz2sLgt1O1b4TRenM7M0SQpnP4reLPBS87dqyvct3g8gnEOA2NpntffAg27Opef6Kis_OssnHNtjdc-GuWyzpbeQP_TGsS6EYp1sKPzQBR1h8I4youtAfHcNjVtO33hfMUeUMe2Rsa',
  '0812-3456-7890',
  'halo@birongulumanriah.desa.id',
  'Nagori Birong Ulu Manriah, Kec. Sidamanik, Kab. Simalungun, Sumatera Utara 21171',
  'Senin - Jumat | 08:00 - 15:30 WIB',
  '15'
)
on conflict (id) do update set
  village_name = excluded.village_name,
  logo_url = excluded.logo_url,
  hero_title = excluded.hero_title,
  hero_title_highlight = excluded.hero_title_highlight,
  hero_subtitle = excluded.hero_subtitle,
  hero_bg_url = excluded.hero_bg_url,
  cta_title = excluded.cta_title,
  cta_subtitle = excluded.cta_subtitle,
  cta_bg_url = excluded.cta_bg_url,
  contact_phone = excluded.contact_phone,
  contact_email = excluded.contact_email,
  contact_address = excluded.contact_address,
  operating_hours = excluded.operating_hours,
  avg_service_time = excluded.avg_service_time;


-- 2. news ---------------------------------------------------------------------
insert into public.news (id, title, category, date, snippet, content, image_url, image_alt, author, read_time, is_main)
values
(
  'news-1',
  'Panen Raya 2024: Meningkatkan Ketahanan Pangan Melalui Perkebunan & Pertanian Organik',
  'Agenda Nagori',
  '12 Oktober 2024',
  'Keberhasilan panen tahun ini menjadi bukti nyata bahwa kolaborasi antara tradisi bertani dan teknologi modern mampu meningkatkan hasil produksi...',
  'Keberhasilan panen tahun ini menjadi bukti nyata bahwa kolaborasi antara tradisi bertani dan teknologi irigasi modern mampu meningkatkan hasil produksi hingga 30%. Kegiatan panen raya di area Nagori Birong Ulu Manriah dihadiri oleh Pangulu Nagori, jajaran perangkat Nagori, serta kelompok tani masyarakat Sidamanik.

Dengan penerapan pupuk organik terpadu dan pengelolaan lahan berkelanjutan, hasil komoditas unggulan Nagori Birong Ulu Manriah seperti Teh, Kopi, dan Padi Simalungun dipasarkan secara langsung melalui pasar lokal dan koperasi Nagori.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAlR9o1PFgwYe39Xt77Ofu7XYQ6e0zN1QR74G54AMPMvJQdaf8Lie0-PLFQT65zc48hrwSJigHJBPYZ0S65BYDqfWuKENiIQ7wuaPmg3jS9ml0lxuW5MMSAYmlx1gqYdsSKGKg9urppot_ZsXLU2zeMp6o5mGz8LqGm3HaCc-eMvEsgyvzCN-dbaWxpNTYj_otMAnCyjcm9tRkezTgwtu4uSO5Zxx3PtN3_haxz9lJ61s1PYrYPHYpD',
  'Petani dan warga panen raya bersama',
  'Tim Humas Nagori', '3 min', true
),
(
  'news-2',
  'Peresmian Pojok Digital Nagori Birong Ulu Manriah untuk Layanan Publik',
  'Publik',
  '08 Oktober 2024',
  'Fasilitas baru untuk mendukung warga belajar teknologi digital dan mengajukan surat administrasi secara cepat.',
  'Pemerintah Nagori Birong Ulu Manriah resmi membuka fasilitas Pojok Digital Nagori yang berlokasi di Kantor Pangulu. Fasilitas ini dilengkapi dengan perangkat cetak mandiri dan koneksi internet publik berkecepatan tinggi, serta pendampingan bagi lansia maupun warga yang membutuhkan bantuan administrasi.

Pojok Digital ini bertujuan agar seluruh masyarakat Nagori Birong Ulu Manriah, Kecamatan Sidamanik, dapat mengakses portal permohonan surat mandiri, cek bansos, dan pendaftaran UMKM lokal.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB6pELdpEWivibGK_BqfFRRioHJV2dkhMC7t1sg8cqN4o1TyYmJXxH68yf2nI7AJGT5EG0gnuJqM-W6ZDIGkrDUnsGLIT3W8vzlpow7U2FbquqmY77vz3Kz_5Colv7kOJEmuA9kyD3cHmedu4MzZaQmRH4QKnSegamdOZ4uYOz0rR3oEFvAGlqyeXmzVfs1l2ucwV86jXgsdjENmJKl1nn8BUdU2TcmSARvbKzNY-xR2Z84Jelb7Ws_',
  'Lansia dan petugas menggunakan mesin kiosk digital',
  'Admin Sekretariat Nagori', '2 min', false
),
(
  'news-3',
  'Peluncuran Katalog Produk Unggulan UMKM Nagori Birong Ulu Manriah',
  'UMKM',
  '05 Oktober 2024',
  'Memperluas jangkauan pasar lokal ke kancah kabupaten dan provinsi melalui pendampingan usaha.',
  'Pelaku UMKM binaan Nagori Birong Ulu Manriah kini terdaftar dalam Katalog Produk Digital Unggulan. Produk yang ditawarkan melingkupi Olahan Teh Sidamanik, Kerajinan Tangan Simalungun, Kopi Sangrai Lokal, dan Kuliner Khas Daerah.

Melalui katalog terpadu ini, para pengrajin dan pengusaha lokal mendapatkan fasilitas promosi serta pendaftaran legalitas NIB secara gratis.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA8xdjtCuyof9asQKyKN8MB39PIPCS8lnztx724k4VQwyOencPWx38UShK9PkyiiPur7IWQVBOA71MKOIxIcMDpm7SxKTL4V7zbychIa4kUNqiLkDMfbVdQ_031kdxDN1g211PJ37N2e1B0vRmZtZwT7GMPVgIV4XF3ZmzNN7bDPESQjR_FKJDrS5XATI2lvaEBF4reH8ql3LSqDbgRyL5MC0xWcy464L8_iQ9aIF5drPdeaCjflU-5',
  'Produk khas UMKM Nagori',
  'Pendamping UMKM', '4 min', false
),
(
  'news-4',
  'Laporan Transparansi Dana Nagori Periode Kuartal III',
  'Transparansi',
  '01 Oktober 2024',
  'Komitmen keterbukaan informasi dan akuntabilitas publik pengelolaan anggaran Nagori Birong Ulu Manriah.',
  'Melanjutkan prinsip transparansi publik, Pemerintah Nagori Birong Ulu Manriah mempublikasikan Laporan Realisasi Anggaran Pendapatan dan Belanja Nagori (APBNag) Kuartal III Tahun Anggaran 2024.

Realisasi penggunaan anggaran Nagori difokuskan pada:
1. Pembangunan Jalan Usaha Tani & Perkebunan: Rp 185.000.000
2. Pemeliharaan Posyandu & Kesehatan Ibu-Anak: Rp 64.000.000
3. Pengembangan Sistem Portal Nagori Digital: Rp 35.000.000
4. Bantuan Langsung Tunai (BLT) Nagori: Rp 120.000.000

Masyarakat dapat mengunduh dokumen laporan keuangan lengkap berformat PDF melalui menu Transparansi.',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCkTvn_qJuevS8YQx7pIOWbRCReucv6GlWxDbVw-hqV4dzYnxy9rlMmjAnlJVe7a1tcgPvT6u1MDjHigZgxVAK8yU1SzwmZCIM2a4Izep1i1Kd8_k9k-KDwYtFyJwNIXYjnuWkCvKykcccWAlJL4ge3k2AVfHaMJC9p3r-30u4hEgZn3smEMnowCA2szxCBdMAUTCkEqVQnrWHjwviXADPwIWX9yLfD6aJKr16ag18lbyABRnwzd6Cw',
  'Grafik laporan data transparansi anggaran Nagori',
  'Kaur Keuangan Nagori', '3 min', false
)
on conflict (id) do nothing;


-- 3. document_types -----------------------------------------------------------
insert into public.document_types (id, code, title, description, icon, requirements, processing_time, fields, display_order)
values
(
  'sku',
  'SK-01',
  'Surat Keterangan Usaha (SKU)',
  'Dokumen bukti legalitas usaha lokal bagi pelaku UMKM atau pedagang warga Nagori.',
  'storefront',
  array['KTP Pemohon (Asli & Fotokopi)','Kartu Keluarga (KK)','Foto Tempat Usaha'],
  '15 Menit',
  '[
    {"name":"namaUsaha","label":"Nama Usaha / Toko","type":"text","placeholder":"Contoh: Kedai Kopi Sidamanik / Toko Sembako","required":true},
    {"name":"bidangUsaha","label":"Bidang Usaha","type":"select","options":["Perdagangan / Kuliner","Pertanian / Perkebunan","Kerajinan / Industri Rumah Tangga","Jasa & Perbaikan","Lainnya"],"required":true},
    {"name":"alamatUsaha","label":"Alamat Lokasi Usaha","type":"textarea","placeholder":"RT/RW & Huta tempat usaha berada","required":true},
    {"name":"tahunMulai","label":"Tahun Berdiri Usaha","type":"number","placeholder":"2021","required":true}
  ]'::jsonb,
  0
),
(
  'skdom',
  'SK-02',
  'Surat Keterangan Domisili',
  'Surat resmi menerangkan status tempat tinggal warga atau badan usaha di wilayah Nagori.',
  'home_pin',
  array['KTP Pemohon','Kartu Keluarga (KK)','Surat Pengantar Gamot / RT'],
  '10 Menit',
  '[
    {"name":"statusTempatTinggal","label":"Status Tempat Tinggal","type":"select","options":["Milik Sendiri","Sewa / Kontrak","Ikut Orang Tua","Lainnya"],"required":true},
    {"name":"lamaTinggal","label":"Lama Tinggal (Tahun)","type":"number","placeholder":"5","required":true},
    {"name":"alasanDomisili","label":"Keperluan Surat","type":"text","placeholder":"Contoh: Persyaratan Buka Rekening Bank / Melamar Kerja","required":true}
  ]'::jsonb,
  1
),
(
  'sktm',
  'SK-03',
  'Surat Keterangan Tidak Mampu (SKTM)',
  'Surat permohonan pengajuan bantuan pendidikan, beasiswa, kesehatan, atau fasilitas sosial.',
  'volunteer_activism',
  array['KTP Orang Tua / Wali','Kartu Keluarga (KK)','Kartu BPJS / KIS (Jika Ada)'],
  '15 Menit',
  '[
    {"name":"namaAnak","label":"Nama Anak / Penerima Manfaat","type":"text","required":false},
    {"name":"sekolahInstansi","label":"Nama Sekolah / Rumah Sakit / Instansi Tujuan","type":"text","placeholder":"Contoh: SMA Negeri Sidamanik / RSUD Simalungun","required":true},
    {"name":"pekerjaanKepalaKeluarga","label":"Pekerjaan Kepala Keluarga","type":"text","placeholder":"Contoh: Petani / Buruh Kebun","required":true}
  ]'::jsonb,
  2
),
(
  'skck',
  'SK-04',
  'Surat Pengantar SKCK',
  'Surat pengantar Nagori untuk pembuatan Catatan Kepolisian di Polsek Sidamanik / Polres Simalungun.',
  'verified_user',
  array['KTP Pemohon','Kartu Keluarga (KK)','Pas Foto 4x6 Background Merah'],
  '10 Menit',
  '[
    {"name":"keperluanSkck","label":"Tujuan Pembuatan SKCK","type":"text","placeholder":"Contoh: Melamar Pekerjaan / Pendaftaran BUMN","required":true},
    {"name":"instansiTujuan","label":"Tujuan Instansi/Perusahaan","type":"text","placeholder":"Contoh: Polsek Sidamanik / Polres Simalungun","required":true}
  ]'::jsonb,
  3
),
(
  'sktik',
  'SK-05',
  'Surat Keterangan Beda Nama / Ijazah',
  'Surat penjelas perbedaan ejaan nama di KTP, KK, Akta Kelahiran, atau Ijazah.',
  'badge',
  array['KTP','KK','Akta / Ijazah yang Berbeda'],
  '15 Menit',
  '[
    {"name":"namaDokumenA","label":"Nama Tertulis di KTP / KK","type":"text","placeholder":"Sesuai KTP","required":true},
    {"name":"namaDokumenB","label":"Nama Tertulis di Ijazah / Akta","type":"text","placeholder":"Sesuai Ijazah","required":true},
    {"name":"nomorDokumenAcuan","label":"Nomor Dokumen Acuan","type":"text","placeholder":"No. Ijazah / Akta Kelahiran","required":true}
  ]'::jsonb,
  4
)
on conflict (id) do nothing;


-- 4. village_officials --------------------------------------------------------
insert into public.village_officials (name, role, icon, phone, display_order) values
  ('Pangulu Nagori',     'Pangulu Nagori Birong Ulu Manriah', 'person', '0812-3456-7890', 0),
  ('Sekretaris Nagori',  'Sekretaris Nagori (Seknag)',        'person', '0812-9876-5432', 1),
  ('Kaur Keuangan',      'Kaur Keuangan & Perencanaan',       'person', '0813-1122-3344', 2),
  ('Kasi Pelayanan',     'Kasi Pelayanan & Kesejahteraan',    'person', '0814-5566-7788', 3)
on conflict (name, role) do nothing;


-- 5. village_stats ------------------------------------------------------------
insert into public.village_stats (label, target_number, unit, description, icon, display_order) values
  ('Populasi Nagori',   4820, '+',    'Jiwa terdata secara realtime',          'groups',                   0),
  ('Luas Wilayah',      1250, 'ha',   'Lahan perkebunan & pemukiman',          'landscape',                1),
  ('UMKM Aktif',          84, 'Unit', 'Pendorong ekonomi lokal',               'store',                    2),
  ('Indeks Kepuasan',     98, '%',    'Pelayanan publik prima',                'sentiment_very_satisfied', 3)
on conflict (label) do nothing;
