// app/admin/news/page.tsx

'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useAdmin } from '../../../src/context/AdminContext';
import { NewsItem } from '../../../src/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminPageHeader } from '../../../src/components/admin/AdminPageHeader';
import ImageUpload from '../../../src/components/admin/ImageUpload';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-[#EDEDE9] bg-white text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10 transition';

const labelClass = 'block font-body text-xs font-medium text-gray-700 mb-1.5';

function AdminNewsPageContent() {
  const { newsList, saveNews, deleteNews, toggleMainNews } = useAdmin();
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('edit');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle edit from URL param
  useEffect(() => {
    if (editId) {
      const newsToEdit = newsList.find((n) => n.id === editId);
      if (newsToEdit) {
        setEditingNews({ ...newsToEdit });
        setIsModalOpen(true);
        router.replace('/admin/news');
      }
    }
  }, [editId, newsList, router]);

  const handleOpenAdd = () => {
    setEditingNews({
      id: `news-${Date.now()}`,
      title: '',
      category: 'Agenda Nagori',
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      snippet: '',
      content: '',
      imageUrl: '',
      imageAlt: 'Gambar Berita Desa',
      author: 'Admin Nagori',
      readTime: '3 min',
      isMain: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (news: NewsItem) => {
    setEditingNews({ ...news });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;
    setIsSaving(true);
    try {
      await saveNews(editingNews);
      setIsModalOpen(false);
    } catch {
      // Error toast already shown by AdminContext; keep modal open.
    } finally {
      setIsSaving(false);
    }
  };

  const filteredNews = newsList.filter((n) => {
    const matchCat = categoryFilter === 'Semua' || n.category === categoryFilter;
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.snippet.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={`Modul 03 • Konten • ${newsList.length} item`}
        title="Berita & Agenda Nagori"
        description="Tambah, perbarui, dan kelola kabar desa. Pilih satu berita untuk tampil sebagai sorotan utama di landing page."
        icon="newspaper"
        actions={
          <button
            onClick={handleOpenAdd}
            className="bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-headline font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Tambah Berita</span>
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EDEDE9] shadow-xs flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1 min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Cari judul atau ringkasan berita…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#EDEDE9] bg-[#FAFAF7] text-sm focus:outline-none focus:border-[#1A1A1A] focus:bg-white focus:ring-2 focus:ring-[#1A1A1A]/10 transition"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1">
          {['Semua', 'Agenda Nagori', 'Agenda Desa', 'Publik', 'UMKM', 'Transparansi'].map(
            (cat) => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all whitespace-nowrap ${
                    active
                      ? 'bg-[#1A1A1A] text-white shadow-sm'
                      : 'bg-[#F7F7F5] border border-[#EDEDE9] text-gray-600 hover:bg-white hover:border-[#1A1A1A]/30'
                  }`}
                >
                  {cat}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredNews.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#EDEDE9] shadow-xs text-center">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block mx-auto">
            newspaper
          </span>
          <h3 className="font-headline text-base font-semibold text-[#1A1A1A]">
            Tidak ada berita ditemukan
          </h3>
          <p className="font-body text-xs text-gray-500 mt-1.5 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau kategori, atau buat berita baru
            untuk ditambahkan ke portal publik.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Tambah Berita</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="group bg-white p-4 sm:p-5 rounded-2xl border border-[#EDEDE9] shadow-xs hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 hover:border-emerald-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-[#F7F7F5]">
                  {news.imageUrl ? (
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <span className="material-symbols-outlined text-4xl">image</span>
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span className="bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-[#EDEDE9] text-[10px] font-semibold text-gray-800">
                      {news.category}
                    </span>
                    {news.isMain && (
                      <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-md text-[10px] font-semibold shadow-sm inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">star</span>
                        Utama
                      </span>
                    )}
                  </div>
                </div>
                <div className="font-body text-[11px] text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <span>{news.date}</span>
                  <span>•</span>
                  <span>{news.author}</span>
                </div>
                <h4 className="font-headline text-sm sm:text-base font-semibold text-[#1A1A1A] mb-1.5 leading-snug line-clamp-2 group-hover:text-black transition-colors">
                  {news.title}
                </h4>
                <p className="font-body text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {news.snippet}
                </p>
              </div>
              <div className="mt-4 pt-3.5 border-t border-[#EDEDE9] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    void toggleMainNews(news.id).catch(() => undefined);
                  }}
                  className={`text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                    news.isMain
                      ? 'text-amber-600 hover:text-amber-700'
                      : 'text-gray-500 hover:text-amber-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {news.isMain ? 'star' : 'star_outline'}
                  </span>
                  <span>{news.isMain ? 'Berita Utama' : 'Jadikan Utama'}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(news)}
                    className="px-3 py-1.5 rounded-lg bg-[#F7F7F5] border border-[#EDEDE9] hover:bg-white hover:border-[#1A1A1A]/30 text-xs font-medium text-gray-700 hover:text-black transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      void deleteNews(news.id).catch(() => undefined);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal Edit/Add */}
      {isModalOpen && editingNews && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-black/55 backdrop-blur-xs animate-fadeInUp">
          <div className="bg-[#FCFCFC] w-full max-w-2xl rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border sm:border-[#EDEDE9] overflow-hidden flex flex-col max-h-screen sm:max-h-[90vh]">
            <div className="bg-[#1A1A1A] text-white p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-emerald-300 text-xl">
                    edit_note
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Editor Konten
                  </p>
                  <h3 className="font-headline text-sm sm:text-base font-semibold truncate">
                    Form Editor Berita &amp; Agenda
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5"
            >
              <div>
                <label className={labelClass}>Judul Berita *</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) =>
                    setEditingNews({ ...editingNews, title: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Kategori Berita *</label>
                  <select
                    value={editingNews.category}
                    onChange={(e) =>
                      setEditingNews({
                        ...editingNews,
                        category: e.target.value as NewsItem['category'],
                      })
                    }
                    className={inputClass}
                  >
                    <option value="Agenda Nagori">Agenda Nagori</option>
                    <option value="Agenda Desa">Agenda Desa</option>
                    <option value="Publik">Publik</option>
                    <option value="UMKM">UMKM</option>
                    <option value="Transparansi">Transparansi</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Penulis *</label>
                  <input
                    type="text"
                    required
                    value={editingNews.author}
                    onChange={(e) =>
                      setEditingNews({ ...editingNews, author: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <ImageUpload
                label="Gambar Berita"
                value={editingNews.imageUrl}
                onChange={(url) =>
                  setEditingNews({ ...editingNews, imageUrl: url })
                }
                folder="news"
                maxDim={1200}
                maxSizeMB={0.15}
              />

              <div>
                <label className={labelClass}>Ringkasan / Snippet *</label>
                <textarea
                  rows={2}
                  required
                  value={editingNews.snippet}
                  onChange={(e) =>
                    setEditingNews({ ...editingNews, snippet: e.target.value })
                  }
                  className={inputClass + ' resize-y'}
                />
              </div>
              <div>
                <label className={labelClass}>Isi Berita Lengkap *</label>
                <textarea
                  rows={6}
                  required
                  value={editingNews.content}
                  onChange={(e) =>
                    setEditingNews({ ...editingNews, content: e.target.value })
                  }
                  className={inputClass + ' resize-y'}
                />
              </div>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 cursor-pointer hover:bg-emerald-50 transition-colors">
                <input
                  type="checkbox"
                  checked={editingNews.isMain || false}
                  onChange={(e) =>
                    setEditingNews({ ...editingNews, isMain: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-headline text-xs font-semibold text-[#1A1A1A] block">
                    Tampilkan Sebagai Berita Utama
                  </span>
                  <span className="font-body text-[11px] text-gray-600">
                    Hanya satu berita yang featured di landing page pada satu waktu.
                  </span>
                </div>
                <span className="material-symbols-outlined text-amber-500">star</span>
              </label>

              <div className="pt-4 border-t border-[#EDEDE9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-[#EDEDE9] bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white rounded-xl hover:bg-black text-xs font-headline font-medium disabled:opacity-60 flex items-center gap-2 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-base">
                    {isSaving ? 'progress_activity' : 'cloud_upload'}
                  </span>
                  <span>{isSaving ? 'Menyimpan…' : 'Simpan Berita'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminNewsPage() {
  return (
    <Suspense fallback={<div className="space-y-4" aria-busy="true" />}>
      <AdminNewsPageContent />
    </Suspense>
  );
}