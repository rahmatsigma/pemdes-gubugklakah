// Path: src/app/admin/berita/tambah/page.tsx
// Dibuat baru

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from "lucide-react";

export default function TambahBerita() {
  const router = useRouter();
  const supabase = createClient();

  // State untuk form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Berita");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState("true"); // String agar mudah dengan select
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // State untuk UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fungsi membuat slug dari judul (contoh: "Halo Dunia" -> "halo-dunia")
  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Ganti spasi dengan -
      .replace(/[^\w\-]+/g, "") // Hapus karakter non-word
      .replace(/\-\-+/g, "-"); // Ganti double - dengan single -
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      let imageUrl = null;
      const slug = generateSlug(title);

      // 1. Upload Gambar (Jika ada)
      if (imageFile) {
        // Buat nama file unik
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${slug}.${fileExt}`;
        const filePath = `berita/${fileName}`;

        // Upload ke bucket 'public_assets' yang kita buat di awal
        const { error: uploadError } = await supabase.storage
          .from("public_assets")
          .upload(filePath, imageFile);

        if (uploadError) throw new Error("Gagal mengunggah gambar: " + uploadError.message);

        // Dapatkan URL publik dari gambar yang baru diupload
        const { data: publicUrlData } = supabase.storage
          .from("public_assets")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Simpan Data ke Tabel 'posts'
      const { error: insertError } = await supabase
        .from("posts")
        .insert([
          {
            title: title,
            slug: slug,
            category: category,
            content: content,
            image_url: imageUrl,
            is_published: isPublished === "true",
          },
        ]);

      if (insertError) {
        // Tangani error slug ganda (jika judul sama persis)
        if (insertError.code === '23505') {
          throw new Error("Judul ini sudah digunakan. Silakan gunakan judul lain agar URL (slug) unik.");
        }
        throw new Error("Gagal menyimpan data: " + insertError.message);
      }

      // 3. Sukses, kembali ke halaman daftar berita
      router.refresh();
      router.push("/admin/berita");

    } catch (err: any) {
      setErrorMsg(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/admin/berita"
          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-md transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Tulis Berita Baru</h1>
          <p className="text-neutral-600">Publikasikan informasi terbaru untuk warga desa.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 font-medium">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border-2 border-neutral-200 rounded-lg p-6 sm:p-8">
        <div className="space-y-6">
          
          {/* Baris 1: Judul */}
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Judul Berita *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none"
              placeholder="Contoh: Kerja Bakti Dusun Kunci"
            />
          </div>

          {/* Baris 2: Kategori & Status (Grid 2 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Kategori *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none bg-white"
              >
                <option value="Berita">Berita</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Kegiatan">Kegiatan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Status Publikasi *</label>
              <select
                value={isPublished}
                onChange={(e) => setIsPublished(e.target.value)}
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none bg-white"
              >
                <option value="true">Terbitkan (Langsung tampil di web)</option>
                <option value="false">Simpan sebagai Draft (Belum tampil)</option>
              </select>
            </div>
          </div>

          {/* Baris 3: Gambar Sampul */}
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Gambar Sampul</label>
            <div className="border-2 border-dashed border-neutral-300 rounded-md p-6 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <ImageIcon className="text-neutral-400 mb-2" size={32} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                className="text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
              />
              <p className="text-xs text-neutral-500 mt-2">Maksimal 2MB. Format JPG, PNG, atau WebP.</p>
            </div>
          </div>

          {/* Baris 4: Isi Konten */}
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Isi Berita *</label>
            <textarea
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none font-sans leading-relaxed"
              placeholder="Tulis isi lengkap berita atau pengumuman di sini..."
            ></textarea>
          </div>

        </div>

        {/* Tombol Simpan */}
        <div className="mt-8 pt-6 border-t-2 border-neutral-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:bg-primary-300"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {isSubmitting ? "Menyimpan..." : "Simpan Berita"}
          </button>
        </div>
      </form>
    </div>
  );
}