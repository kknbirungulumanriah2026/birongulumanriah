// src/components/admin/ImageUpload.tsx

'use client';

import React, { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../../lib/supabase';

const BUCKET = 'landing-images';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  maxDim?: number;
  maxSizeMB?: number;
  transparent?: boolean;
}

function bucketObjectPath(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length));
}

export default function ImageUpload({ label, value, onChange, folder, maxDim = 1600, maxSizeMB = 0.2, transparent = false }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const fileType = transparent ? 'image/webp' : 'image/jpeg';
  const extension = transparent ? 'webp' : 'jpg';

  const handleFile = async (file: File) => {
    if (!supabase) {
      setError('Supabase belum dikonfigurasi.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB,
        maxWidthOrHeight: maxDim,
        fileType,
        initialQuality: 0.6,
        useWebWorker: true,
      });
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, compressed, { contentType: fileType });
      if (uploadError) throw uploadError;

      const oldPath = bucketObjectPath(value);
      if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]).catch(() => undefined);

      onChange(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`);
    } catch (cause) {
      setError(cause instanceof Error ? `Upload gagal: ${cause.message}` : 'Upload gagal.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <div className="w-20 h-14 rounded-lg border border-[#EDEDE9] bg-[#F7F7F5] overflow-hidden flex items-center justify-center flex-shrink-0">
          {value ? (
            <img src={value} alt="Pratinjau" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-gray-300 text-xl">image</span>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
            className="block w-full text-xs text-gray-500 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-[#1A1A1A] file:text-white file:text-xs file:font-medium hover:file:bg-black file:cursor-pointer cursor-pointer"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Foto dikompres otomatis di browser sebelum diunggah (maks. {Math.round(maxSizeMB * 1000)} KB).
          </p>
        </div>
      </div>
      {busy && <p className="text-[11px] text-gray-500 mt-1">Mengompres & mengunggah…</p>}
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
