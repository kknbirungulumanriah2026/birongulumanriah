# Supabase · Schema Relationships

Diagram + reference untuk struktur database portal **sidodadi-portal**. Semua tabel berada di schema `public`. Source SQL ada di [`schema.sql`](./schema.sql).

## Entity-Relationship Diagram

```
┌────────────────────────┐
│     site_settings      │  (single-row config, id='singleton')
│────────────────────────│
│ PK id (text)           │
│    village_name        │
│    logo_url            │
│    hero_title          │
│    hero_subtitle       │
│    cta_title           │
│    contact_*           │
│    admin_passcode      │
│    updated_at          │
└────────────────────────┘


┌────────────────────────┐         ┌──────────────────────────────────┐
│      document_types    │ 1     N │       document_applications      │
│────────────────────────│─────────│──────────────────────────────────│
│ PK id (text)           │         │ PK id (text)                     │
│    code  (unique)      │         │ UK tracking_number               │
│    title               │         │ FK document_id ───────►──────────┘
│    description         │         │    document_title (denormalized)
│    icon                │         │    full_name, nik, phone, address
│    requirements[]      │         │    purpose
│    processing_time     │         │    extra_data (jsonb)
│    pdf_template_*      │         │    attached_pdf_path → storage
│    fields (jsonb)      │         │    attached_pdf_name
│    display_order       │         │    submitted_at
│    created_at          │         │    status  ('Menunggu Verifikasi'
│    updated_at          │         │             'Diproses'
└────────────────────────┘         │             'Selesai Diproses'
                                   │             'Ditolak')
                                   │    qr_code_value
                                   │    created_at
                                   │    updated_at
                                   └──────────────────────────────────┘


┌────────────────────────┐         ┌────────────────────────┐
│       village_stats    │         │   village_officials    │
│────────────────────────│         │────────────────────────│
│ PK id (uuid)           │         │ PK id (uuid)           │
│ UK label               │         │ UK (name, role)        │
│    target_number       │         │    avatar_url          │
│    unit                │         │    icon                │
│    description         │         │    phone               │
│    icon                │         │    display_order       │
│    display_order       │         │    created_at          │
│    created_at          │         └────────────────────────┘
└────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                              news                               │
│─────────────────────────────────────────────────────────────────│
│ PK id (text)                                                   │
│    title                                                        │
│    category  CHECK IN ('Agenda Nagori','Agenda Desa','Publik',  │
│                        'UMKM','Transparansi')                   │
│    date, snippet, content                                       │
│    image_url, image_alt                                         │
│    author, read_time                                            │
│    is_main  (only 1 row allowed true via partial uniq idx)     │
│    created_at, updated_at                                       │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                     storage.objects (bucket)                    │
│─────────────────────────────────────────────────────────────────│
│  bucket: applicant-pdfs  (private)                              │
│  Path convention: applicant-pdfs/<tracking_number>/<file>.pdf  │
│  Referenced from: document_applications.attached_pdf_path      │
└─────────────────────────────────────────────────────────────────┘
```

## Foreign-key map

| Constraint | From | → To | ON DELETE | ON UPDATE |
| --- | --- | --- | --- | --- |
| `doc_apps_document_id_fkey` | `document_applications.document_id` | `document_types.id` | `RESTRICT` | `CASCADE` |

`RESTRICT` pada `document_id`: jenis surat tidak bisa dihapus kalau masih ada pengajuan yang mereferensikannya — mengunci histori pengajuan warga.

## Index reference

| Index | Table | Columns | Purpose |
| --- | --- | --- | --- |
| `site_settings_singleton_idx` | `site_settings` | `(true) WHERE id='singleton'` | Cegah multi-row insertion |
| `news_pkey` | `news` | `id` | Lookup by id |
| `news_category_idx` | `news` | `category` | Filter kategori di landing page |
| `news_created_at_idx` | `news` | `created_at DESC` | Sort berita terbaru |
| `news_is_main_idx` | `news` | `is_main WHERE is_main=true` | Lookup featured news |
| `news_single_main_idx` | `news` | `(is_main) WHERE is_main=true` | **UNIQUE** partial — hanya 1 berita utama |
| `document_types_pkey` | `document_types` | `id` | Lookup by id |
| `document_types_code_key` | `document_types` | `code` (UNIQUE) | Kode surat (SK-01, dst) |
| `document_types_order_idx` | `document_types` | `display_order` | Sort di panel admin |
| `document_applications_pkey` | `document_applications` | `id` | Lookup by id |
| `document_applications_tracking_number_key` | `document_applications` | `tracking_number` (UNIQUE) | Tracking oleh warga |
| `doc_apps_tracking_idx` | `document_applications` | `tracking_number` | Lookup tracking |
| `doc_apps_status_idx` | `document_applications` | `status` | Filter status di admin |
| `doc_apps_nik_idx` | `document_applications` | `nik` | Cari pengajuan per NIK |
| `doc_apps_created_idx` | `document_applications` | `created_at DESC` | Sort pengajuan terbaru |
| `doc_apps_doc_id_idx` | `document_applications` | `document_id` | Join / filter per jenis surat |
| `village_officials_pkey` | `village_officials` | `id` | Lookup by UUID |
| `village_officials_name_role_uidx` | `village_officials` | `(name, role)` UNIQUE | Cegah duplikat |
| `village_officials_order_idx` | `village_officials` | `display_order` | Sort |
| `village_stats_pkey` | `village_stats` | `id` | Lookup by UUID |
| `village_stats_label_uidx` | `village_stats` | `label` UNIQUE | Cegah duplikat |
| `village_stats_order_idx` | `village_stats` | `display_order` | Sort |

## RLS policy reference

| Policy | Table | Role | Command | Rule |
| --- | --- | --- | --- | --- |
| `site_settings_public_read` | `site_settings` | anon, authenticated | SELECT | always true |
| `news_public_read` | `news` | anon, authenticated | SELECT | always true |
| `document_types_public_read` | `document_types` | anon, authenticated | SELECT | always true |
| `doc_apps_public_read` | `document_applications` | anon, authenticated | SELECT | always true |
| `doc_apps_public_insert` | `document_applications` | anon, authenticated | INSERT | always true |
| `village_officials_public_read` | `village_officials` | anon, authenticated | SELECT | always true |
| `village_stats_public_read` | `village_stats` | anon, authenticated | SELECT | always true |
| `applicant_pdfs_anon_upload` | `storage.objects` (bucket `applicant-pdfs`) | anon, authenticated | INSERT | bucket_id = `applicant-pdfs` |

> Admin writes (UPDATE/DELETE + INSERT ke tabel lain) melewati `/api/admin` (Next.js route handler) yang memegang `SUPABASE_SERVICE_ROLE_KEY` → bypass RLS.

## Triggers

| Trigger | Table | When | Effect |
| --- | --- | --- | --- |
| `trg_site_settings_updated` | `site_settings` | BEFORE UPDATE | Set `updated_at = now()` |
| `trg_news_updated` | `news` | BEFORE UPDATE | Set `updated_at = now()` |
| `trg_document_types_updated` | `document_types` | BEFORE UPDATE | Set `updated_at = now()` |
| `trg_doc_apps_updated` | `document_applications` | BEFORE UPDATE | Set `updated_at = now()` |

## Storage bucket

| Bucket | Visibility | Used for | Path convention |
| --- | --- | --- | --- |
| `applicant-pdfs` | **private** | PDF lampiran pada `document_applications` | `<tracking_number>/<filename>.pdf` |

Pembacaan lewat signed URL yang diterbitkan server-side. Tidak ada policy SELECT publik untuk bucket ini.

## Type contract

File [`src/types.ts`](../src/types.ts) adalah source of truth untuk shape data di TypeScript. Untuk setiap tabel, mapper `snake_case ↔ camelCase` ada di:

| Tabel | Mapper |
| --- | --- |
| `site_settings` | `toSiteSettings` di [`src/lib/repository.ts`](../src/lib/repository.ts) |
| `news` | `toNews` / `fromNews` |
| `document_types` | `toDocumentType` |
| `document_applications` | `toApplication` / `fromApplication` |
| `village_officials` | `toVillageOfficial` |
| `village_stats` | `toVillageStat` |

Normalizer untuk admin API ada di [`app/api/admin/route.ts`](../app/api/admin/route.ts) — memastikan payload dari client cocok dengan kolom DB sebelum di-upsert via service-role client.
