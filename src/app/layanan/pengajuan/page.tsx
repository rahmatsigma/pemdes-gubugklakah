// Path: src/app/layanan/pengajuan/page.tsx
// Dibuat baru

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { submitPermohonan } from "./action";
import Link from "next/link";
import { ArrowLeft, Send, FileUp, Loader2, AlertCircle, CheckCircle } from "lucide-react";

// Karena Next.js 15, searchParams adalah Promise
type Params = Promise<{ [key: string]: string | string[] | undefined }>;

export default function PengajuanSurat(props: { searchParams: Params }) {
  const searchParams = use(props.searchParams);
  const jenisId = searchParams.jenis as string;
  const router = useRouter();
  const supabase = createClient();

  const [jenisSurat, setJenisSurat] = useState<any>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // State untuk sukses
  const [successTiket, setSuccessTiket] = useState<string | null>(null);

  // Ambil data jenis surat untuk ditampilkan judul & syaratnya
  useEffect(() => {
    async function fetchJenisSurat() {
      if (!jenisId) {
        setIsLoadingInitial(false);
        return;
      }
      const { data } = await supabase.from("jenis_surat").select("*").eq("id", jenisId).single();
      setJenisSurat(data);
      setIsLoadingInitial(false);
    }
    fetchJenisSurat();
  }, [jenisId, supabase]);

  // Handler submit menggunakan FormData bawaan HTML & Server Action
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.append("jenis_surat_id", jenisId);

    // Panggil Server Action
    const result = await submitPermohonan(formData);

    if (result.error) {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    } else if (result.success && result.tiket) {
      setSuccessTiket(result.tiket);
      setIsSubmitting(false);
    }
  };

  if (isLoadingInitial) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-primary-500" size={48} /></div>;
  }

  if (!jenisSurat && !isLoadingInitial) {
    return (
      <div className="min-h-screen bg-neutral-50 p-8 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Layanan tidak ditemukan</h1>
        <Link href="/layanan" className="text-primary-600 font-bold hover:underline">&larr; Kembali ke Daftar Layanan</Link>
      </div>
    );
  }

  // JIKA SUKSES SUBMIT: Tampilkan layar Tiket
  if (successTiket) {
    return (
      <div className="min-h-screen bg-neutral-50 py-20 px-4">
        <div className="max-w-2xl mx-auto bg-white border-2 border-green-500 rounded-lg p-8 sm:p-12 text-center shadow-sm">
          <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-6" />
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-4">Permohonan Berhasil!</h1>
          <p className="text-neutral-600 mb-8">
            Data Anda telah masuk ke sistem kami. Harap simpan <strong className="text-neutral-900">Kode Tiket</strong> di bawah ini untuk melacak status surat Anda.
          </p>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
            <p className="text-sm font-bold text-green-800 uppercase tracking-wider mb-2">KODE TIKET ANDA</p>
            <p className="font-mono text-4xl font-bold text-green-700 tracking-widest">{successTiket}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/layanan/lacak?tiket=${successTiket}`} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-md transition-colors">
              Lacak Surat Sekarang
            </Link>
            <Link href="/" className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold py-3 px-6 rounded-md border border-neutral-300 transition-colors">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // FORM INPUT PENGAJUAN
  return (
    <div className="bg-neutral-50 min-h-screen pb-20 pt-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        <Link href="/layanan" className="inline-flex items-center text-primary-600 font-bold mb-8 hover:underline">
          <ArrowLeft size={20} className="mr-2" /> Batal & Kembali
        </Link>

        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-2">Formulir Pengajuan Surat</h1>
          <p className="text-neutral-600">Anda sedang mengajukan: <span className="font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded-md border border-primary-100">{jenisSurat.nama}</span></p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5 shrink-0" size={20} />
            <p className="text-red-700 font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border-2 border-neutral-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="bg-accent-50 border-2 border-accent-200 rounded-md p-4 mb-6">
            <h3 className="font-bold text-accent-900 mb-2">Informasi Privasi Data</h3>
            <p className="text-sm text-accent-800">
              Data NIK dan berkas yang Anda unggah dilindungi dan hanya digunakan untuk keperluan administrasi desa sesuai UU Pelindungan Data Pribadi (PDP).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">NIK (Nomor Induk Kependudukan) *</label>
              <input
                type="number"
                name="nik"
                required
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none font-mono"
                placeholder="16 Digit Angka"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Nama Lengkap Sesuai KTP *</label>
              <input
                type="text"
                name="nama"
                required
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none"
                placeholder="Nama Lengkap"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Nomor WhatsApp Aktif *</label>
            <input
              type="text"
              name="kontak"
              required
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none"
              placeholder="Contoh: 081234567890 (Untuk verifikasi lacak surat)"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Keperluan Permohonan *</label>
            <textarea
              name="keperluan"
              required
              rows={3}
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none"
              placeholder="Jelaskan secara singkat untuk apa surat ini dibuat..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Unggah Berkas Persyaratan (KTP/KK/Pengantar) *</label>
            <div className="border-2 border-dashed border-neutral-300 rounded-md p-6 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <FileUp className="text-neutral-400 mb-2" size={32} />
              <input
                type="file"
                name="berkas"
                required
                accept="image/jpeg,image/png,application/pdf"
                className="text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
              />
              <p className="text-xs text-neutral-500 mt-2 text-center">
                Jadikan satu file (PDF) jika syarat lebih dari 1 halaman. Maksimal 2MB. (Format: PDF, JPG, PNG).
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t-2 border-neutral-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-md transition-colors disabled:opacity-70 text-lg"
            >
              {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              {isSubmitting ? "Memproses Data..." : "Kirim Permohonan Surat"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}