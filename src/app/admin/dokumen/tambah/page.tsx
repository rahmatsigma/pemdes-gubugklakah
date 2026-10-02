// Path: src/app/admin/dokumen/tambah/page.tsx
// Dibuat baru

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ArrowLeft, Save, FileUp, Loader2, AlertCircle } from "lucide-react";

// 1. Skema Validasi Zod
const documentSchema = z.object({
  judul: z.string().min(5, { message: "Judul dokumen minimal 5 karakter." }),
  kategori: z.string().min(1, { message: "Kategori wajib dipilih." }),
  tahun: z.string().regex(/^\d{4}$/, { message: "Tahun harus 4 angka (contoh: 2026)." }).or(z.literal("")),
  is_published: z.string(), // "true" atau "false"
});

// Otomatis membuat tipe TypeScript dari skema Zod
type DocumentFormValues = z.infer<typeof documentSchema>;

export default function TambahDokumen() {
  const router = useRouter();
  const supabase = createClient();
  
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 2. Inisialisasi React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      judul: "",
      kategori: "Laporan",
      tahun: new Date().getFullYear().toString(),
      is_published: "true",
    },
  });

  // 3. Fungsi Submit
  const onSubmit = async (data: DocumentFormValues) => {
    if (!file) {
      setUploadError("Pilih file dokumen terlebih dahulu!");
      return;
    }

    // Validasi tipe file & ukuran di sisi klien (Maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 5MB.");
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    try {
      // A. Upload File ke Storage
      const fileExt = file.name.split('.').pop();
      // KEAMANAN: Ganti nama file asli dengan string acak agar tidak ada celah path traversal
      const safeFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { error: storageError, data: storageData } = await supabase.storage
        .from("dokumen_desa")
        .upload(safeFileName, file);

      if (storageError) throw new Error("Gagal mengunggah file: " + storageError.message);

      // Dapatkan URL Publik
      const { data: publicUrlData } = supabase.storage
        .from("dokumen_desa")
        .getPublicUrl(safeFileName);

      // B. Simpan data ke Database
      const { error: dbError } = await supabase.from("dokumen").insert([
        {
          judul: data.judul,
          kategori: data.kategori,
          tahun: data.tahun,
          is_published: data.is_published === "true",
          file_url: publicUrlData.publicUrl,
        },
      ]);

      if (dbError) throw new Error("Gagal menyimpan data: " + dbError.message);

      // Sukses
      router.refresh();
      router.push("/admin/dokumen");

    } catch (err: any) {
      setUploadError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dokumen" className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-md transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Unggah Dokumen</h1>
          <p className="text-neutral-600">Publikasikan laporan, peraturan desa, atau formulir.</p>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5 shrink-0" size={20} />
          <p className="text-red-700 font-medium">{uploadError}</p>
        </div>
      )}

      {/* Gunakan handleSubmit dari react-hook-form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border-2 border-neutral-200 rounded-lg p-6 sm:p-8 space-y-6">
        
        {/* Input Judul */}
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">Judul Dokumen *</label>
          <input
            type="text"
            {...register("judul")}
            className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none ${errors.judul ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-primary-500'}`}
            placeholder="Contoh: Laporan Realisasi APBDes 2026"
          />
          {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Kategori */}
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Kategori *</label>
            <select
              {...register("kategori")}
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none bg-white"
            >
              <option value="Laporan">Laporan</option>
              <option value="Perdes">Peraturan Desa (Perdes)</option>
              <option value="Buku Panduan">Buku Panduan / SOP</option>
              <option value="Formulir">Formulir Pendaftaran</option>
            </select>
            {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori.message}</p>}
          </div>

          {/* Input Tahun */}
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Tahun (Opsional)</label>
            <input
              type="text"
              {...register("tahun")}
              className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none ${errors.tahun ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-primary-500'}`}
              placeholder="Contoh: 2026"
            />
            {errors.tahun && <p className="text-red-500 text-sm mt-1">{errors.tahun.message}</p>}
          </div>
        </div>

        {/* Status Publikasi */}
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">Status Publikasi *</label>
          <select
            {...register("is_published")}
            className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none bg-white"
          >
            <option value="true">Publik (Bisa diunduh warga)</option>
            <option value="false">Sembunyikan (Hanya arsip admin)</option>
          </select>
        </div>

        {/* Area Upload File */}
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">File Dokumen (PDF/Word/Excel) *</label>
          <div className="border-2 border-dashed border-neutral-300 rounded-md p-6 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors">
            <FileUp className="text-neutral-400 mb-2" size={32} />
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
            />
            <p className="text-xs text-neutral-500 mt-2">Maksimal 5MB.</p>
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSubmitting ? "Mengunggah..." : "Simpan Dokumen"}
          </button>
        </div>
      </form>
    </div>
  );
}