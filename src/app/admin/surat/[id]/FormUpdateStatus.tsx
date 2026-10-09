"use client";

import { useState } from "react";
import { updateStatusSurat } from "../../../layanan/lacak/action";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FormUpdateStatus({ id, currentStatus, currentCatatan }: { id: string, currentStatus: string, currentCatatan: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    formData.append("id", id); // Sisipkan ID ke form

    const result = await updateStatusSurat(formData);

    if (result?.error) {
      setErrorMsg(result.error);
    } else {
      router.refresh(); // Refresh data halaman
      alert("Status berhasil diperbarui!");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border-2 border-neutral-200 rounded-lg p-6 shadow-sm sticky top-6">
      <h3 className="font-heading text-lg font-bold text-neutral-900 mb-6 border-b-2 border-neutral-100 pb-2">
        Aksi Admin
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
            <option value="Diajukan">Diajukan</option>
            <option value="Diverifikasi">Diverifikasi (Berkas Lengkap)</option>
            <option value="Diproses">Diproses (Sedang Diketik)</option>
            <option value="Selesai">Selesai (Siap Diambil)</option>
            <option value="Ditolak">Ditolak (Bermasalah)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-700 mb-2">Catatan untuk Warga</label>
          <textarea
            name="catatan"
            defaultValue={currentCatatan}
            rows={4}
            className="w-full px-4 py-2 border-2 border-neutral-300 rounded-md focus:border-primary-500 focus:outline-none text-sm"
            placeholder="Opsional. (Wajib diisi jika surat ditolak, misal: Foto KTP kurang jelas)"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-md transition-colors disabled:opacity-70 mt-2"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}