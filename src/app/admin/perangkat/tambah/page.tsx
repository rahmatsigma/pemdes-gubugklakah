// Path: src/app/admin/perangkat/tambah/page.tsx
// Dibuat baru

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save, UserCircle, Loader2 } from "lucide-react";

export default function TambahPerangkat() {
  const router = useRouter();
  const supabase = createClient();

  // State untuk data form
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [orderIndex, setOrderIndex] = useState("0");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // State untuk mengatur UI (loading dan pesan error)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      let imageUrl = null;

      // 1. Proses Upload Foto (Jika admin memilih foto)
      if (imageFile) {
        // Buat nama file yang aman dan unik
        const fileExt = imageFile.name.split('.').pop();
        const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const fileName = `staf-${Date.now()}-${safeName}.${fileExt}`;
        const filePath = `perangkat/${fileName}`;

        // Unggah ke bucket 'public_assets' di Supabase
        const { error: uploadError } = await supabase.storage
          .from("public_assets")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error("Gagal mengunggah foto profil: " + uploadError.message);
        }

        // Ambil URL publik dari file yang baru diunggah
        const { data: publicUrlData } = supabase.storage
          .from("public_assets")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Simpan Data Teks ke Tabel 'officials'
      const { error: insertError } = await supabase
        .from("officials")
        .insert([
          {
            name: name,
            position: position,
            order_index: parseInt(orderIndex, 10),
            image_url: imageUrl,
          },
        ]);

      if (insertError) {
        throw new Error("Gagal menyimpan data ke database: " + insertError.message);
      }

      // 3. Sukses! Refresh dan kembali ke daftar perangkat
      router.refresh();
      router.push("/admin/perangkat");

    } catch (err: any) {
      setErrorMsg(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/perangkat"
          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-md transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Tambah Perangkat Desa</h1>
          <p className="text-neutral-600">Masukkan data staf atau perangkat desa yang baru.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-medium">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border-2 border-neutral-200 rounded-lg p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Kolom Kiri: Form Teks */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-accent-500 focus:outline-none"
                placeholder="Contoh: Budi Santoso, S.Sos"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Jabatan *</label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-accent-500 focus:outline-none"
                placeholder="Contoh: Kepala Urusan Keuangan"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Nomor Urut Tampil (0 = Paling Atas) *
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Gunakan angka untuk mengurutkan (contoh: Kades = 0, Sekdes = 1, Kaur = 2).
              </p>
              <input
                type="number"
                required
                min="0"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-accent-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Kolom Kanan: Upload Foto Profil */}
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Foto Profil (Opsional)</label>
            <div className="border-2 border-dashed border-neutral-300 rounded-md p-8 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors h-64">
              <UserCircle className="text-neutral-400 mb-4" size={48} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                className="text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-accent-100 file:text-accent-800 hover:file:bg-accent-200 cursor-pointer w-full"
              />
              <p className="text-xs text-neutral-500 mt-4 text-center">
                Disarankan pas foto rasio 1:1 (persegi). Maksimal 2MB.
              </p>
            </div>
          </div>

        </div>

        {/* Tombol Simpan */}
        <div className="mt-10 pt-6 border-t-2 border-neutral-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {isSubmitting ? "Menyimpan Data..." : "Simpan Perangkat"}
          </button>
        </div>
      </form>
    </div>
  );
}