// app/admin/news/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../src/context/AdminContext';
import { NewsItem } from '../../../src/types';
import { useSearchParams, useRouter } from 'next/navigation';
import ImageUpload from '../../../src/components/admin/ImageUpload';

export default function AdminNewsPage() {
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
      const newsToEdit = newsList.find(n => n.id === editId);
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
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
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
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                       n.snippet.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 border-gray-200">
        <div>
          <h3 className="font-headline text-base font-semibold text-[#1A1A1A]">Kelola Berita, Pengumuman & Agenda Desa</h3>
          <p className="text-xs text-gray-500">Tambah, perbarui, atur berita utama featured, dan publikasikan kabar terkini untuk warga.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-medium shadow-xs transition-all flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Tambah Berita Baru</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-[#EDEDE9]">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
          <input 
            type="text" 
            placeholder="Cari judul berita..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#EDEDE9] text-xs focus:outline-none focus:ring-1 focus:ring-black" 
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['Semua', 'Agenda Nagori', 'Agenda Desa', 'Publik', 'UMKM', 'Transparansi'].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setCategoryFilter(cat)} 
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                categoryFilter === cat 
                  ? 'bg-[#1A1A1A] text-white' 
                  : 'bg-[#F7F7F5] border border-[#EDEDE9] text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Berita */}
      {filteredNews.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-[#EDEDE9] text-center">
          <p className="text-sm text-gray-500">Tidak ada berita yang ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.map((news) => (
            <div key={news.id} className="bg-white p-4 rounded-xl border border-[#EDEDE9] shadow-2xs flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3 bg-gray-100">
                  <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-gray-800">{news.category}</span>
                    {news.isMain && (
                      <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-semibold shadow-2xs">⭐ Utama</span>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 mb-1">{news.date} • {news.author}</div>
                <h4 className="font-headline text-sm font-semibold text-[#1A1A1A] mb-1 leading-snug line-clamp-2">{news.title}</h4>
                <p className="font-body text-xs text-gray-500 line-clamp-2 leading-relaxed">{news.snippet}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <button 
                  onClick={() => { void toggleMainNews(news.id).catch(() => undefined); }} 
                  className={`text-xs font-medium flex items-center gap-1 cursor-pointer ${
                    news.isMain ? 'text-amber-600' : 'text-gray-500 hover:text-amber-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">star</span>
                  <span>{news.isMain ? 'Berita Utama' : 'Jadikan Utama'}</span>
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(news)} className="px-3 py-1 rounded bg-[#F7F7F5] border border-[#EDEDE9] hover:bg-gray-100 text-xs font-medium text-gray-700">Edit</button>
                  <button onClick={() => { void deleteNews(news.id).catch(() => undefined); }} className="px-3 py-1 rounded bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-xs font-medium">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Edit/Add */}
      {isModalOpen && editingNews && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FCFCFC] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#EDEDE9] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#1A1A1A] text-white p-4 flex items-center justify-between">
              <h3 className="font-headline text-sm font-semibold">Form Editor Berita & Agenda</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-300">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Judul Berita *</label>
                <input 
                  type="text" 
                  required 
                  value={editingNews.title} 
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Kategori Berita *</label>
                  <select 
                    value={editingNews.category} 
                    onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as NewsItem['category'] })} 
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  >
                    <option value="Agenda Nagori">Agenda Nagori</option>
                    <option value="Agenda Desa">Agenda Desa</option>
                    <option value="Publik">Publik</option>
                    <option value="UMKM">UMKM</option>
                    <option value="Transparansi">Transparansi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Penulis *</label>
                  <input 
                    type="text" 
                    required 
                    value={editingNews.author} 
                    onChange={(e) => setEditingNews({ ...editingNews, author: e.target.value })} 
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                  />
                </div>
              </div>
              <ImageUpload
                label="Gambar Berita"
                value={editingNews.imageUrl}
                onChange={(url) => setEditingNews({ ...editingNews, imageUrl: url })}
                folder="news"
                maxDim={1200}
                maxSizeMB={0.15}
              />
              <div>
                <label className="block font-medium text-gray-700 mb-1">Ringkasan Snippet Singkat *</label>
                <textarea 
                  rows={2} 
                  required 
                  value={editingNews.snippet} 
                  onChange={(e) => setEditingNews({ ...editingNews, snippet: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Isi Berita Lengkap *</label>
                <textarea 
                  rows={5} 
                  required 
                  value={editingNews.content} 
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isMainCheck" 
                  checked={editingNews.isMain || false} 
                  onChange={(e) => setEditingNews({ ...editingNews, isMain: e.target.checked })} 
                  className="w-4 h-4 rounded text-black focus:ring-black" 
                />
                <label htmlFor="isMainCheck" className="text-xs font-semibold text-gray-800 cursor-pointer">
                  Tampilkan Sebagai Berita Utama Featured di Landing Page
                </label>
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-60">Batal</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-black font-medium disabled:opacity-60 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">{isSaving ? 'progress_activity' : 'save'}</span>
                  <span>{isSaving ? 'Menyimpan ke Supabase…' : 'Simpan Berita'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}