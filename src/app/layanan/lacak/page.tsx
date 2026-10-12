// Path: src/app/layanan/lacak/page.tsx
// Dibuat baru

"use client";

import { useState } from "react";
import { cekStatusSurat } from "./action";
import Link from "next/link";
import { ArrowLeft, Search, Loader2, AlertCircle, FileText, Calendar, Clock } from "lucide-react";
import Badge from "../../../components/ui/badge";

export default function LacakSurat() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleLacak = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const response = await cekStatusSurat(formData);

    if (response.error) {
      setErrorMsg(response.error);
    } else if (response.success && response.data) {
      setResult(response.data);
    }
    
    setIsSubmitting(false);
  };

  // Fungsi pembantu untuk menentukan warna badge berdasarkan status surat
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Selesai": return "success";
      case "Ditolak": return "danger";
      case "Diverifikasi":
      case "Diproses": return "warning";
      default: return "info"; // "Diajukan"
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-20 pt-10 px-4">
      <div className="max-w-xl mx-auto">
        
        <Link href="/layanan" className="inline-flex items-center text-primary-600 font-bold mb-8 hover:underline">
          <ArrowLeft size={20} className="mr-2" /> Kembali ke Layanan
        </Link>

        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-2">Lacak Status Surat</h1>
          <p className="text-neutral-600">Masukkan kode tiket yang Anda dapatkan saat pengajuan.</p>
        </div>

        {/* Form Pelacakan */}
        <form onSubmit={handleLacak} className="bg-white border-2 border-neutral-200 rounded-lg p-6 sm:p-8 mb-8 shadow-sm">
          
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start">
              <AlertCircle className="text-red-500 mr-3 mt-0.5 shrink-0" size={20} />
              <p className="text-red-700 font-medium text-sm">{errorMsg}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Kode Tiket *</label>
              <input
                type="text"
                name="tiket"
                required
                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-md focus:border-accent-500 focus:outline-none font-mono uppercase text-lg"
                placeholder="Contoh: GBK-2026-X8Y9Z"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Verifikasi Keamanan *</label>
              <input
                type="text"
                name="verifikasi"
                required
                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-md focus:border-accent-500 focus:outline-none"
                placeholder="4 Digit Terakhir NIK / No. WhatsApp"
              />
              <p className="text-xs text-neutral-500 mt-2">Untuk memastikan bahwa ini benar-benar surat Anda.</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              {isSubmitting ? "Mencari..." : "Cek Status Surat"}
            </button>
          </div>
        </form>

        {/* Hasil Pelacakan */}
        {result && (
          <div className="bg-white border-2 border-primary-500 rounded-lg overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-primary-50 px-6 py-4 border-b-2 border-primary-100 flex justify-between items-center">
              <span className="font-mono font-bold text-primary-800">{result.tiket}</span>
              <Badge variant={getStatusVariant(result.status)}>{result.status}</Badge>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-neutral-500 font-bold mb-1">Jenis Layanan</p>
                <div className="flex items-center gap-2 text-neutral-900 font-bold">
                  <FileText size={18} className="text-primary-500" /> {result.jenis_surat}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500 font-bold mb-1">Nama Pemohon</p>
                <p className="text-neutral-900 font-medium">{result.nama}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-neutral-500 font-bold mb-1 flex items-center gap-1"><Calendar size={14}/> Diajukan</p>
                  <p className="text-sm text-neutral-800">{new Date(result.tanggal_pengajuan).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-bold mb-1 flex items-center gap-1"><Clock size={14}/> Diupdate</p>
                  <p className="text-sm text-neutral-800">{new Date(result.tanggal_update).toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              {/* Tampilkan pesan/catatan dari admin jika ada (sangat penting jika surat ditolak/selesai) */}
              {result.catatan && (
                <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-md p-4">
                  <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">Catatan dari Admin Desa:</p>
                  <p className="text-sm text-yellow-900 font-medium">{result.catatan}</p>
                </div>
              )}
              
              {result.status === "Selesai" && (
                <div className="mt-4 bg-green-50 text-green-800 p-4 rounded-md border border-green-200 text-sm font-medium">
                  Surat Anda sudah selesai dan dapat diambil di Kantor Kepala Desa Gubugklakah pada jam kerja dengan membawa KTP/KK asli.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}