// Path: src/app/admin/penduduk/tambah/page.tsx
// Edit (Memperbaiki tipe Zod Resolver dan pemanggilan Supabase Client)

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";

// Skema Validasi Zod
const pendudukSchema = z.object({
  nik: z.string().length(16, "NIK wajib 16 digit angka.").regex(/^\d+$/, "NIK hanya boleh angka."),
  no_kk: z.string().length(16, "No. KK wajib 16 digit angka.").regex(/^\d+$/, "No KK hanya boleh angka."),
  nama_lengkap: z.string().min(3, "Nama terlalu pendek."),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"]),
  tempat_lahir: z.string().min(3, "Tempat lahir wajib diisi."),
  tanggal_lahir: z.string().min(1, "Tanggal lahir wajib dipilih."),
  agama: z.enum(["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "Kepercayaan Lainnya"]),
  pendidikan: z.string().min(1, "Pendidikan wajib diisi."),
  pekerjaan: z.string().min(1, "Pekerjaan wajib diisi."),
  golongan_darah: z.string().default("-"),
  status_perkawinan: z.enum(["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"]),
  hubungan_keluarga: z.string().min(1, "Hubungan dalam keluarga wajib diisi."),
  rt: z.string().regex(/^\d{1,3}$/, "RT wajib angka (contoh: 01 atau 001)."),
  rw: z.string().regex(/^\d{1,3}$/, "RW wajib angka (contoh: 02 atau 002)."),
  alamat_lengkap: z.string().optional(),
  status_penduduk: z.enum(["Tetap", "Pindah", "Meninggal"]),
});

// Extract type dari schema Zod
type PendudukFormValues = z.infer<typeof pendudukSchema>;
type FormValues = z.output<typeof pendudukSchema>;

export default function TambahPenduduk() {
  const router = useRouter();
  
  const supabase = createClient(); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inisialisasi form — biarkan useForm meng-infer tipe dari zodResolver (Zod v4)
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(pendudukSchema),
    defaultValues: {
      nik: "",
      no_kk: "",
      nama_lengkap: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      pendidikan: "Tidak/Belum Sekolah",
      pekerjaan: "",
      alamat_lengkap: "",
      rt: "",
      rw: "",
      jenis_kelamin: "Laki-laki" as const,
      agama: "Islam" as const,
      golongan_darah: "-",
      status_perkawinan: "Belum Kawin" as const,
      hubungan_keluarga: "Kepala Keluarga",
      status_penduduk: "Tetap" as const,
    },
  });

  // Fungsi onSubmit menerima data yang sudah divalidasi oleh Zod
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {

      // Cek apakah NIK sudah ada di database (mencegah duplikat NIK)
      const { data: cekNik } = await supabase
        .from("penduduk")
        .select("nik")
        .eq("nik", data.nik)
        .single();

      // Jika cekError bukan null dan bukan error "baris tidak ditemukan", log errornya
      // (Error baris tidak ditemukan justru bagus, artinya NIK belum dipakai)
      if (cekNik) {
        setErrorMsg(`Data dengan NIK ${data.nik} sudah terdaftar di sistem.`);
        setIsSubmitting(false);
        return;
      }

      // Insert ke database
      const { error: dbError } = await supabase
        .from("penduduk")
        .insert([data]);

      if (dbError) {
        throw new Error(dbError.message);
      } 
      
      router.refresh();
      router.push("/admin/penduduk");

    } catch (error: any) {
      setErrorMsg("Gagal menyimpan data: " + (error.message || "Terjadi kesalahan server."));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/penduduk" className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 rounded-md transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Tambah Data Penduduk</h1>
          <p className="text-neutral-600">Masukkan data penduduk warga Desa Gubugklakah yang baru.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5 shrink-0" size={20} />
          <p className="text-red-700 font-medium">{errorMsg}</p>
        </div>
      )}

      {/* PERBAIKAN: Pastikan handleSubmit dipanggil dengan benar */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border-2 border-neutral-200 rounded-lg p-6 sm:p-8 shadow-sm">
        
        {/* SECTION 1: IDENTITAS UTAMA */}
        <h2 className="text-lg font-bold text-neutral-900 border-b-2 border-neutral-100 pb-2 mb-4">Identitas Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Nomor Induk Kependudukan (NIK) *</label>
            <input type="text" maxLength={16} {...register("nik")} className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none font-mono ${errors.nik ? 'border-red-500' : 'border-neutral-300 focus:border-primary-500'}`} placeholder="16 Digit Angka" />
            {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Nomor Kartu Keluarga (KK) *</label>
            <input type="text" maxLength={16} {...register("no_kk")} className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none font-mono ${errors.no_kk ? 'border-red-500' : 'border-neutral-300 focus:border-primary-500'}`} placeholder="16 Digit Angka" />
            {errors.no_kk && <p className="text-red-500 text-xs mt-1">{errors.no_kk.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-neutral-700 mb-1">Nama Lengkap (Sesuai KTP) *</label>
            <input type="text" {...register("nama_lengkap")} className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none ${errors.nama_lengkap ? 'border-red-500' : 'border-neutral-300 focus:border-primary-500'}`} placeholder="NAMA LENGKAP" />
            {errors.nama_lengkap && <p className="text-red-500 text-xs mt-1">{errors.nama_lengkap.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Tempat Lahir *</label>
            <input type="text" {...register("tempat_lahir")} className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none ${errors.tempat_lahir ? 'border-red-500' : 'border-neutral-300 focus:border-primary-500'}`} />
            {errors.tempat_lahir && <p className="text-red-500 text-xs mt-1">{errors.tempat_lahir.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Tanggal Lahir *</label>
            <input type="date" {...register("tanggal_lahir")} className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none ${errors.tanggal_lahir ? 'border-red-500' : 'border-neutral-300 focus:border-primary-500'}`} />
            {errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1">{errors.tanggal_lahir.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Jenis Kelamin *</label>
            <select {...register("jenis_kelamin")} className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 bg-white outline-none">
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Golongan Darah</label>
            <select {...register("golongan_darah")} className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 bg-white outline-none">
              <option value="-">Tidak Tahu / -</option>
              <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
            </select>
          </div>
        </div>

        {/* SECTION 2: STATUS & SOSIAL */}
        <h2 className="text-lg font-bold text-neutral-900 border-b-2 border-neutral-100 pb-2 mb-4">Status & Profil</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Agama *</label>
            <select {...register("agama")} className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 bg-white outline-none">
              <option value="Islam">Islam</option><option value="Kristen">Kristen</option><option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option><option value="Buddha">Buddha</option><option value="Konghucu">Konghucu</option>
              <option value="Kepercayaan Lainnya">Kepercayaan Lainnya</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Status Perkawinan *</label>
            <select {...register("status_perkawinan")} className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 bg-white outline-none">
              <option value="Belum Kawin">Belum Kawin</option><option value="Kawin">Kawin</option>
              <option value="Cerai Hidup">Cerai Hidup</option><option value="Cerai Mati">Cerai Mati</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Pendidikan Terakhir *</label>
            <select {...register("pendidikan")} className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 bg-white outline-none">
              <option value="Tidak/Belum Sekolah">Tidak/Belum Sekolah</option><option value="Tamat SD/Sederajat">Tamat SD/Sederajat</option>
              <option value="SLTP/Sederajat">SLTP/Sederajat</option><option value="SLTA/Sederajat">SLTA/Sederajat</option>
              <option value="Diploma I/II">Diploma I/II</option><option value="Akademi/Diploma III/S.Muda">Akademi/Diploma III</option>
              <option value="Diploma IV/Strata I">Diploma IV/Strata I (S1)</option><option value="Strata II">Strata II (S2)</option>
              <option value="Strata III">Strata III (S3)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Pekerjaan *</label>
            <input type="text" {...register("pekerjaan")} className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none ${errors.pekerjaan ? 'border-red-500' : 'border-neutral-300 focus:border-primary-500'}`} placeholder="Contoh: Petani, Wiraswasta, PNS" />
            {errors.pekerjaan && <p className="text-red-500 text-xs mt-1">{errors.pekerjaan.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Hubungan dalam Keluarga *</label>
            <select {...register("hubungan_keluarga")} className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 bg-white outline-none">
              <option value="Kepala Keluarga">Kepala Keluarga</option><option value="Istri">Istri</option>
              <option value="Anak">Anak</option><option value="Cucu">Cucu</option><option value="Orang Tua">Orang Tua</option>
              <option value="Mertua">Mertua</option><option value="Famili Lain">Famili Lain</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Status Penduduk *</label>
            <select {...register("status_penduduk")} className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 bg-white outline-none">
              <option value="Tetap">Tetap (Warga Aktif)</option>
              <option value="Pindah">Pindah Domisili</option>
              <option value="Meninggal">Meninggal Dunia</option>
            </select>
          </div>
        </div>

        {/* SECTION 3: ALAMAT */}
        <h2 className="text-lg font-bold text-neutral-900 border-b-2 border-neutral-100 pb-2 mb-4">Alamat di Desa Gubugklakah</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">RT *</label>
            <input type="text" {...register("rt")} className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none ${errors.rt ? 'border-red-500' : 'border-neutral-300 focus:border-primary-500'}`} placeholder="Contoh: 01" />
            {errors.rt && <p className="text-red-500 text-xs mt-1">{errors.rt.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">RW *</label>
            <input type="text" {...register("rw")} className={`w-full px-4 py-2 border-2 rounded-md focus:outline-none ${errors.rw ? 'border-red-500' : 'border-neutral-300 focus:border-primary-500'}`} placeholder="Contoh: 02" />
            {errors.rw && <p className="text-red-500 text-xs mt-1">{errors.rw.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-neutral-700 mb-1">Alamat Lengkap / Jalan (Opsional)</label>
            <textarea {...register("alamat_lengkap")} rows={2} className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 outline-none" placeholder="Jalan, Gang, atau Nama Perumahan"></textarea>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-neutral-200 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-md transition-colors disabled:opacity-70">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSubmitting ? "Menyimpan Data..." : "Simpan Data Penduduk"}
          </button>
        </div>
      </form>
    </div>
  );
}