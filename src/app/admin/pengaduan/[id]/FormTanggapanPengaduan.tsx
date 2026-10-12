"use client";

import { useState } from "react";
import { updatePengaduanAdmin } from "../../../pengaduan/actions";
import { Loader2, Save, AlertCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FormTanggapanPengaduan({ 
  id, 
  currentStatus, 
  currentTanggapan,
  isPublic
}: { 
  id: string, 
  currentStatus: string, 
  currentTanggapan: string,
  isPublic: boolean
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.append("id", id);
    
    // Checkbox value dikirim sebagai "true" jika dicentang, dan undefined jika tidak.
    // Kita pastikan nilainya adalah string "true" atau "false"
    const isPublicCheck = formData.get("is_public") ? "true" : "false";
    formData.set("is_public", isPublicCheck);

    const result = await updatePengaduanAdmin(formData);

    if (result?.error) {
      setErrorMsg(result.error);
    } else {
      router.refresh();
      alert("Tanggapan berhasil disimpan!");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border-2 border-neutral-200 rounded-lg p-6 shadow-sm sticky top-6">
      <h3 className="font-heading text-lg font-bold text-neutral-900 mb-6 border-b-2 border-neutral-100 pb-2">
        Tindak Lanjut Admin
      </h3>

      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 flex items-start">
          <AlertCircle className="text-red-500 mr-2 shrink-0 mt-0.5" size={16} />
          <p className="text-red-700 text-sm">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">Ubah Status</label>
          <select
            name="status"
            defaultValue={currentStatus}
            className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none bg-white font-medium"
          >
            <option value="Baru">Baru Masuk</option>
            <option value="Ditindaklanjuti">Sedang Ditindaklanjuti</option>
            <option value="Selesai">Masalah Selesai</option>
            <option value="Ditolak">Ditolak / Bukan Wewenang Desa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">Tanggapan Resmi Desa</label>
          <textarea
            name="tanggapan"
            defaultValue={currentTanggapan}
            rows={5}
            className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none text-sm"
            placeholder="Balasan ini akan bisa dibaca oleh warga jika mereka melacak nomor tiketnya."
          ></textarea>
        </div>

        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="is_public" 
              defaultChecked={isPublic}
              className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <div>
              <p className="text-sm font-bold text-blue-900 flex items-center gap-1"><ShieldCheck size={14}/> Tampilkan ke Publik</p>
              <p className="text-xs text-blue-800 mt-1">
                Centang jika pengaduan ini (judul dan isi) boleh ditampilkan di halaman depan web desa. (Nama asli tetap disembunyikan).
              </p>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-70 mt-2"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSubmitting ? "Menyimpan..." : "Simpan Tanggapan"}
        </button>
      </form>
    </div>
  );
}