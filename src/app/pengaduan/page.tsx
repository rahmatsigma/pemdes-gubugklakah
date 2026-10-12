// Path: src/app/pengaduan/page.tsx
// Dibuat baru

"use client";

import { useState } from "react";
import { submitPengaduan } from "./actions";
import Link from "next/link";
import { Send, FileUp, Loader2, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";

export default function PengaduanMasyarakat() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successTiket, setSuccessTiket] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitPengaduan(formData);

    if (result.error) {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    } else if (result.success && result.tiket) {
      setSuccessTiket(result.tiket);
      setIsSubmitting(false);
    }
  };

  // TAMPILAN JIKA SUKSES
  if (successTiket) {
    return (
      <div className="min-h-screen bg-neutral-50 py-20 px-4">
        <div className="max-w-2xl mx-auto bg-white border-2 border-green-500 rounded-lg p-8 sm:p-12 text-center shadow-sm">
          <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-6" />
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-4">Laporan Diterima!</h1>
          <p className="text-neutral-600 mb-8">
            Terima kasih atas kepedulian Anda. Laporan Anda telah masuk dan akan segera ditindaklanjuti oleh Pemerintah Desa Gubugklakah.
          </p>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
            <p className="text-sm font-bold text-green-800 uppercase tracking-wider mb-2">KODE TIKET PENGADUAN ANDA</p>
            <p className="font-mono text-4xl font-bold text-green-700 tracking-widest">{successTiket}</p>
            <p className="text-sm text-green-700 mt-2">Simpan kode ini untuk mengecek status tindak lanjut laporan Anda nanti.</p>
          </div>

          <div className="flex justify-center">
            <Link href="/" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-md transition-colors">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN FORM PENGADUAN
  return (
    <div className="bg-neutral-50 min-h-screen pb-20 pt-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-bold text-neutral-900 mb-4">Lapor Pemdes!</h1>
          <p className="text-lg text-neutral-600">
            Sampaikan laporan, kritik, atau saran Anda. Identitas Anda dapat dirahasiakan (Anonim).
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5 shrink-0" size={20} />
            <p className="text-red-700 font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border-2 border-neutral-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="bg-blue-50 border-2 border-blue-200 rounded-md p-4 mb-6 flex items-start gap-3">
            <ShieldAlert className="text-blue-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Jaminan Kerahasiaan</h3>
              <p className="text-sm text-blue-800">
                Laporan yang Anda kirim tidak akan ditampilkan ke publik tanpa izin, dan Anda berhak mengosongkan nama jika ingin melapor secara anonim.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Kategori Laporan *</label>
              <select
                name="kategori"
                required
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none bg-white"
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Infrastruktur">Infrastruktur & Fasilitas Umum</option>
                <option value="Pelayanan">Pelayanan Desa</option>
                <option value="Keamanan">Ketertiban & Keamanan</option>
                <option value="Lingkungan">Lingkungan (Sampah, Bencana)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Judul Laporan *</label>
              <input
                type="text"
                name="judul"
                required
                className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none"
                placeholder="Contoh: Jalan berlubang di RT 02"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Isi Laporan / Kronologi *</label>
            <textarea
              name="isi"
              required
              rows={5}
              className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none"
              placeholder="Ceritakan secara detail mengenai hal yang ingin Anda laporkan..."
            ></textarea>
          </div>

          <div className="border-t-2 border-neutral-200 pt-6 mt-6">
            <h3 className="font-bold text-neutral-900 mb-4">Data Opsional (Tidak Wajib)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Nama Anda</label>
                <input
                  type="text"
                  name="nama"
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none"
                  placeholder="Kosongkan jika ingin Anonim"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Nomor Telepon/WA</label>
                <input
                  type="text"
                  name="kontak"
                  className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none"
                  placeholder="Untuk dihubungi jika perlu keterangan lanjut"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">Lampiran Bukti (Foto/Video) - Opsional</label>
            <div className="border-2 border-dashed border-neutral-300 rounded-md p-6 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors relative">
              <FileUp className="text-neutral-400 mb-2" size={32} />
              <input
                type="file"
                name="lampiran"
                accept="image/*,video/mp4"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="bg-primary-100 text-primary-800 font-bold py-2 px-4 rounded-md text-sm">
                Pilih File Lampiran
              </span>
              <p className="text-xs text-neutral-500 mt-3 font-medium">
                {fileName ? `File terpilih: ${fileName}` : "Maksimal 5MB. Format: JPG, PNG, MP4."}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-md transition-colors disabled:opacity-70 text-lg shadow-sm"
            >
              {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              {isSubmitting ? "Mengirim Laporan..." : "Kirim Pengaduan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}